import {NextPageContext} from 'next';
import ky from 'ky/umd';
import {Except} from 'type-fest';
import {AuthToken} from './auth-token';
import {IServer} from './types';
import {getBaseURL} from './helpers';

export class APIClient {
	readonly token: AuthToken;
	private readonly client: typeof ky;

	constructor(option: AuthToken | NextPageContext) {
		const token = option.constructor === AuthToken ? option : AuthToken.fromNext(option as NextPageContext);

		this.token = token;

		const options = {
			headers: {
				Authorization: token.isValid ? token.authorizationString : ''
			},
			prefixUrl: '/'
		};

		if (option.constructor !== AuthToken) {
			options.prefixUrl = getBaseURL(option as NextPageContext);
		}

		this.client = ky.create(options);
	}

	isAuthorized(): boolean {
		return this.token?.isValid;
	}

	async login(jwt: string) {
		const response = await ky.get('api/login', {headers: {
			Authorization: jwt
		}}).json();

		return (response as any).token as string;
	}

	async getServer(id: number) {
		return this.client.get(`api/servers/${id}`).json<IServer>();
	}

	async putServer(id: number, server: Except<IServer, 'id'>) {
		await this.client.put(`api/servers/${id}`, {json: server});
	}

	async createServer(server: Except<IServer, 'id'>) {
		return this.client.post('api/servers', {json: server}).json<IServer>();
	}
}
