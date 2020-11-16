import React from 'react';
import App, {AppProps} from 'next/app';
import Head from 'next/head';
import {Router} from 'next/router';
import {AppContextType} from 'next/dist/next-server/lib/utils';
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
				<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
				<title>Keweenaw Kube</title>
			</Head>

			<MainNavbar/>

			<ButterToast position={{vertical: POS_BOTTOM, horizontal: POS_RIGHT}}/>

			<Component {...pageProps}/>
		</div>
	);
}

const WrappedApp = (props: AppProps & {token: AuthToken}) => (
	<APIClientProvider token={props.token}>
		<MyApp {...props}/>
	</APIClientProvider>
);

WrappedApp.getInitialProps = async (props: AppContextType<Router>) => {
	const appProps = await App.getInitialProps(props);

	return {
		...appProps,
		token: AuthToken.fromNext(props.ctx)
	};
};

export default WrappedApp;
