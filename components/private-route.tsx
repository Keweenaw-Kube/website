import {NextPageContext, NextPage} from 'next';
import React, {Component} from 'react';
import {APIClient} from '../lib/api-client';
import {AuthToken} from '../lib/auth-token';

type AuthProps = {
	token: string;
};

export function privateRoute(WrappedComponent: NextPage) {
	return class extends Component<AuthProps> {
		static async getInitialProps(ctx: NextPageContext) {
			const auth = AuthToken.fromNext(ctx);

			if (auth.isExpired) {
				ctx.res?.writeHead(302, {
					Location: '/'
				});
				ctx.res?.end();
			}

			let wrappedProps = {};

			if (WrappedComponent.getInitialProps) {
				wrappedProps = await WrappedComponent.getInitialProps(ctx);
			}

			return wrappedProps;
		}

		render() {
			return <WrappedComponent {...this.props}/>;
		}
	};
}
