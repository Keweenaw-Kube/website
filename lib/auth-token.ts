import {NextPageContext} from 'next';
import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie';
import nextCookie from 'next-cookies';

export type DecodedToken = {
	readonly picture: string;
	readonly exp: number;
};

export class AuthToken {
	readonly decodedToken: DecodedToken;

	constructor(readonly token?: string) {
		// We are going to default to an expired decodedToken
		this.decodedToken = {picture: '', exp: 0};

		// Then try and decode the jwt using jwt-decode
		try {
			if (token) {
				this.decodedToken = jwtDecode(token) as DecodedToken;
			}
		} catch {
		}
	}

	get authorizationString() {
		if (!this.token) {
			throw new Error('token is undefined');
		}

		return `Bearer ${this.token}`;
	}

	get expiresAt(): Date {
		return new Date(this.decodedToken.exp * 1000);
	}

	get isExpired(): boolean {
		return new Date() > this.expiresAt;
	}

	get isValid(): boolean {
		return !this.isExpired;
	}

	static storeToken(token: string) {
		Cookie.set('token', token);
	}

	static fromNext(ctx: NextPageContext) {
		const {token} = nextCookie(ctx);

		return new AuthToken(token);
	}

	static clearToken() {
		Cookie.remove('token');
	}
}
