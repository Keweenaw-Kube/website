import {NextPageContext} from 'next';
import ky from 'ky/umd';
import {Except} from 'type-fest';
import {AuthToken} from './auth-token';
import {IServer, IRole, IMojangName} from './types';
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

	async getRole(id: number) {
		return this.client.get(`api/roles/${id}`).json<IRole>();
	}

	async putRole(id: number, role: IRole) {
		await this.client.put(`api/roles/${id}`, {json: this.removeId(role)});
	}

	async putServer(id: number, server: IServer) {
		await this.client.put(`api/servers/${id}`, {json: this.removeId(server)});
	}

	async createServer(server: Except<IServer, 'id'>) {
		return this.client.post('api/servers', {json: server}).json<IServer>();
	}

	async createRole(role: Except<IRole, 'id'>) {
		return this.client.post('api/roles', {json: role}).json<IRole>();
	}

	async getMojangProfile(uuid: string) {
		return this.client.get(`api/mojang/profiles/${uuid}`).json<IMojangName[]>();
	}

	private removeId<T extends {id?: number}>(obj: T): Except<T, 'id'> {
		const o = {...obj};

		delete o.id;

		return o;
	}
}
