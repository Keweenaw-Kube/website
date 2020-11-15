import {NextPageContext} from 'next';
import React, {Component} from 'react';
import {APIClient} from '../lib/api-client';
import {AuthToken} from '../lib/auth-token';

type AuthProps = {
	token: string;
};

export type APIClientProps = {
	client: APIClient;
};

export function privateRoute(WrappedComponent: any) {
	return class extends Component<AuthProps> {
		static async getInitialProps(ctx: NextPageContext) {
			const auth = AuthToken.fromNext(ctx);

			const initialProps = {token: auth.token};
			if (auth.isExpired) {
				ctx.res?.writeHead(302, {
					Location: '/'
				});
				ctx.res?.end();
			}

			if (WrappedComponent.getInitialProps) {
				return WrappedComponent.getInitialProps(initialProps);
			}

			return initialProps;
		}

		render() {
			return <WrappedComponent client={new APIClient(new AuthToken(this.props.token))} {...this.props}/>;
		}
	};
}
