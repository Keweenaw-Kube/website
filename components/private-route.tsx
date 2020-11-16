import {NextPageContext, NextPage} from 'next';
import React, {Component} from 'react';
import {AuthToken} from '../lib/auth-token';

export function privateRoute<T>(WrappedComponent: NextPage<T>) {
	return class extends Component<T> {
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
