import React from 'react';
import {useRouter} from 'next/router';
import {Tag} from 'rbx';
import ButterToast from 'butter-toast';
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import {AuthToken} from '../lib/auth-token';
import {useAPI} from './api-client-context';

const LoginButton = ({render}: {render: (props: { onClick: () => void; disabled?: boolean; loggedIn: boolean }) => JSX.Element}) => {
	const router = useRouter();
	const [apiClient, setAuthToken] = useAPI();

	const displayLoginError = () => ButterToast.raise({
		content: <Tag color="danger" size="large">Error logging in</Tag>
	});

	const handleLoginSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		try {
			if ((response as GoogleLoginResponse).tokenId) {
				const token = await apiClient.login((response as GoogleLoginResponse).tokenId);

				AuthToken.storeToken(token);

				setAuthToken(new AuthToken(token));
			} else {
				displayLoginError();
			}
		} catch {
			AuthToken.clearToken();

			displayLoginError();
		}
	};

	const handleLoginFailure = (error: any) => {
		displayLoginError();
	};

	const handleLogout = async () => {
		AuthToken.clearToken();
		setAuthToken(new AuthToken());
		await router.push('/');
	};

	const loggedIn = apiClient.isAuthorized();

	return (
		<GoogleLogin
			clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string} render={renderProps => render({disabled: typeof window === 'undefined' ? true : renderProps.disabled, onClick: loggedIn ? handleLogout : renderProps.onClick, loggedIn})}
			cookiePolicy="single_host_origin"
			onSuccess={handleLoginSuccess}
			onFailure={handleLoginFailure}
		/>
	);
};

export default LoginButton;
