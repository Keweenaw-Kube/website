import {NextPageContext} from 'next';
import ky from 'ky/umd';
import {Options} from 'ky';
import {Except} from 'type-fest';
import {AuthToken} from './auth-token';
import {IServer, IRole, IMojangName, IMojangUser, IUser} from './types';
import {getBaseURL} from './helpers';

interface IAPIResponse<T> {
	data: T;
	error?: string;
}

interface ILoginResponse {
	token: string;
}

export class APIClient {
	readonly token: AuthToken;
	private readonly client: typeof ky;

	constructor(option: AuthToken | NextPageContext) {
		const token = option.constructor === AuthToken ? option : AuthToken.fromNext(option as NextPageContext);

		this.token = token;

		const options: Options = {
			headers: {
				Authorization: token.isValid ? token.authorizationString : ''
			},
			prefixUrl: '/',
			hooks: {
				afterResponse: [
					async (_request, _options, response) => {
						if (!response.ok) {
							const {error} = await response.json();
							throw new Error(error);
						}
					}
				]
			},
			throwHttpErrors: false
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
		const response = await ky.get('api/login', {
			headers: {
				Authorization: jwt
			},
			throwHttpErrors: false
		}).json<IAPIResponse<ILoginResponse>>();

		if (response.error) {
			throw new Error(response.error);
		}

		return response.data.token;
	}

	async getServer(id: number) {
		return this.getData(this.client.get(`api/servers/${id}`).json<IAPIResponse<IServer>>());
	}

	async putServer(id: number, server: IServer) {
		await this.client.put(`api/servers/${id}`, {json: this.removeId(server)});
	}

	async createServer(server: Except<IServer, 'id'>) {
		return this.getData(this.client.post('api/servers', {json: server}).json<IAPIResponse<IServer>>());
	}

	async createUser(user: Except<IUser, 'id'>) {
		return this.getData(this.client.post('api/users', {json: user}).json<IAPIResponse<IUser>>());
	}

	async getMojangNameHistory(uuid: string) {
		return this.getData(this.client.get('api/mojang/profiles', {searchParams: {uuid}}).json<IAPIResponse<IMojangName[]>>());
	}

	async getMojangProfile(name: string) {
		return this.getData(this.client.get('api/mojang/profiles', {searchParams: {name}}).json<IAPIResponse<IMojangUser[]>>());
	}

	private async getData<T>(req: Promise<IAPIResponse<T>>) {
		const res = await req;
		return res.data;
	}

	private removeId<T extends {id?: number}>(obj: T): Except<T, 'id'> {
		const o = {...obj};

		delete o.id;

		return o;
	}
}
