import React, {Component} from 'react';
import {APIClient} from '../lib/api-client';
import {AuthToken} from '../lib/auth-token';

type AuthProps = {
	auth: AuthToken;
};

export type APIClientProps = {
	client: APIClient;
};

export function privateRoute(WrappedComponent: any) {
	return class extends Component<AuthProps> {
		static async getInitialProps(ctx: any) {
			const auth = AuthToken.fromNext(ctx);
			const initialProps = {auth};
			if (auth.isExpired) {
				ctx.res.writeHead(302, {
					Location: '/'
				});
				ctx.res.end();
			}

			if (WrappedComponent.getInitialProps) {
				return WrappedComponent.getInitialProps(initialProps);
			}

			return initialProps;
		}

		get auth() {
			return new AuthToken(this.props.auth.token);
		}

		get client() {
			return new APIClient(this.auth);
		}

		render() {
			return <WrappedComponent client={this.client} {...this.props}/>;
		}
	};
}
