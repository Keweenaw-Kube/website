import {useState} from 'react';
import ky from 'ky/umd';
import {AuthToken} from './auth-token';

export class APIClient {
	readonly token: AuthToken;

	constructor(token: AuthToken) {
		this.token = token;
	}

	isAuthorized(): boolean {
		return this.token?.isValid;
	}

	async login(jwt: string) {
		const response = await ky.get('/api/login', {headers: {
			Authorization: jwt
		}}).json();

		return (response as any).token as string;
	}
}
