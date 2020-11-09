import React from 'react';
import {Tag} from 'rbx';
import ButterToast from 'butter-toast';
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import {APIClient} from '../lib/api-client';
import {AuthToken} from '../lib/auth-token';

const LoginButton = ({render}: {render: (props: { onClick: () => void; disabled?: boolean }) => JSX.Element}) => {
	const displayLoginError = () => ButterToast.raise({
		content: <Tag color="danger" size="large">Error logging in</Tag>
	});

	const handleLoginSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		try {
			if ((response as GoogleLoginResponse).tokenId) {
				const token = await new APIClient(new AuthToken()).login((response as GoogleLoginResponse).tokenId);

				AuthToken.storeToken(token);
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

	return (
		<GoogleLogin
			clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string} render={renderProps => render({disabled: typeof window === 'undefined' ? true : renderProps.disabled, onClick: renderProps.onClick})}
			cookiePolicy="single_host_origin"
			onSuccess={handleLoginSuccess}
			onFailure={handleLoginFailure}
		/>
	);
};

export default LoginButton;
