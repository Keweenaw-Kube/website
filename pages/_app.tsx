import React from 'react';
import App, {AppProps} from 'next/app';
import {AppContextType} from 'next/dist/next-server/lib/utils';
import Link from 'next/link';
import Head from 'next/head';
import {Navbar, Button, Tag} from 'rbx';
import ButterToast, {POS_BOTTOM, POS_RIGHT} from 'butter-toast';
import LoginButton from '../components/login-button';
// eslint-disable-next-line import/no-unassigned-import
import './styles/global.scss';
import {APIClientProvider} from '../components/api-client-context';
import {AuthToken} from '../lib/auth-token';
import {Router} from 'next/router';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<div>
			<Head>
				<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
				<title>Keweenaw Kube</title>
			</Head>

			<Navbar>
				<Navbar.Brand>
					<Link passHref href="/">
						<Navbar.Item>
							<img
								src="/logo.svg"
								alt=""
								role="presentation"
								width="28"
								height="28"
							/>
						</Navbar.Item>
					</Link>
					<Navbar.Burger/>
				</Navbar.Brand>
				<Navbar.Menu>
					<Navbar.Segment align="start">
						<Link passHref href="/servers">
							<Navbar.Item>Servers</Navbar.Item>
						</Link>

						<Link passHref href="/about">
							<Navbar.Item>About</Navbar.Item>
						</Link>
					</Navbar.Segment>

					<Navbar.Segment align="end">
						<Navbar.Item>
							<Button.Group>
								<LoginButton render={renderProps => (
									<Button color={renderProps.loggedIn ? 'danger' : 'primary'} disabled={renderProps.disabled} onClick={renderProps.onClick}>
										<strong>{renderProps.loggedIn ? 'Logout' : 'Login'}</strong>
									</Button>
								)}/>
							</Button.Group>
						</Navbar.Item>
					</Navbar.Segment>
				</Navbar.Menu>
			</Navbar>

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
		...appProps.pageProps,
		token: AuthToken.fromNext(props.ctx)
	};
};

export default WrappedApp;
