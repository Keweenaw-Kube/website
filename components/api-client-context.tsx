import React, {useState, useCallback, useContext, useEffect} from 'react';
import {APIClient} from '../lib/api-client';
import {AuthToken} from '../lib/auth-token';

const APIContext = React.createContext<[APIClient, (newToken: AuthToken) => void]>([new APIClient(new AuthToken()), (newToken: AuthToken) => { /* default value */ }]);

export const APIClientProvider = ({children}: {children: React.ReactNode}) => {
	const [client, setClient] = useState(new APIClient(new AuthToken()));

	const setAuthToken = useCallback((newToken: AuthToken) => {
		setClient(new APIClient(newToken));
	}, []);

	return (
		<APIContext.Provider value={[client, setAuthToken]}>
			{children}
		</APIContext.Provider>
	);
};

export const useAPI = () => {
	return useContext(APIContext);
};

