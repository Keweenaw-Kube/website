import React, {useState, useCallback, useContext, useMemo, useEffect} from 'react';
import useSWR from 'swr';
import ButterToast from 'butter-toast';
import {Tag} from 'rbx';
import {useRouter} from 'next/router';
import {APIClient} from '../lib/api-client';
import {AuthToken} from '../lib/auth-token';

const APIContext = React.createContext<[APIClient, (newToken: AuthToken) => void]>([new APIClient(AuthToken.fromCookie()), (newToken: AuthToken) => { /* default value */ }]);

export const APIClientProvider = ({children, token}: {children: React.ReactNode; token: AuthToken}) => {
	// Need to re-instantiate AuthToken because of hydration
	const [client, setClient] = useState(new APIClient(new AuthToken(token.token)));

	const setAuthToken = useCallback((newToken: AuthToken) => {
		setClient(new APIClient(new AuthToken(newToken.token)));
	}, []);

	return (
		<APIContext.Provider value={[client, setAuthToken]}>
			{children}
		</APIContext.Provider>
	);
};

export const useAPI = () => {
	const [client, setAuthToken] = useContext(APIContext);

	return {client, setAuthToken};
};

export const useAPIRoute = <T extends Record<symbol, unknown>>(route: string) => {
	const router = useRouter();
	const {client, setAuthToken} = useAPI();

	const fetcher = useMemo(() => async (input: RequestInfo, init?: RequestInit | undefined) => {
		const options = init ?? {};
		options.headers = options.headers ?? {};

		if (client.isAuthorized()) {
			(options.headers as any).authorization = client.token.authorizationString;
		}

		const res = await fetch(input, options);

		if (res.ok) {
			return res.json();
		}

		if (res.status === 401) {
			AuthToken.clearToken();
			setAuthToken(new AuthToken());
			await router.push('/');

			return;
		}

		throw new Error(`Request failed: ${res.status}`);
	}, [client, router, setAuthToken]);

	const {data, error} = useSWR<T>(route, fetcher);

	useEffect(() => {
		if (error) {
			console.error('Error from useAPIRoute hook:', error);

			ButterToast.raise({
				content: <Tag color="danger" size="large">API Error</Tag>
			});
		}
	}, [error]);

	return data;
};

