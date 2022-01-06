import React from 'react';
import App, {AppProps, AppContext} from 'next/app';
import Head from 'next/head';
import ButterToast, {POS_BOTTOM, POS_RIGHT} from 'butter-toast';
// eslint-disable-next-line import/no-unassigned-import
import './styles/global.scss';
import {APIClientProvider} from '../components/api-client-context';
import {AuthToken} from '../lib/auth-token';
import MainNavbar from '../components/navbar';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<div>
			<Head>
				<title>Keweenaw Kube</title>
			</Head>

			<MainNavbar/>

			<ButterToast position={{vertical: POS_BOTTOM, horizontal: POS_RIGHT}}/>

			<Component {...pageProps}/>
		</div>
	);
}

const WrappedApp = (props: AppProps & { token: AuthToken }) => (
	<APIClientProvider token={props.token}>
		<MyApp {...props}/>
	</APIClientProvider>
);

// TODO: convert to server-side props?
WrappedApp.getInitialProps = async (props: AppContext) => {
	const appProps = await App.getInitialProps(props);

	return {
		...appProps,
		token: AuthToken.fromNext(props.ctx)
	};
};

export default WrappedApp;
