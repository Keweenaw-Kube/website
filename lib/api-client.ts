import {NextPageContext} from 'next';
import ky, {Options, ResponsePromise} from 'ky';
import {Except} from 'type-fest';
import {AuthToken} from './auth-token';
import {IServer, IUser, IUserWithSponsorInfo, IPicture} from './types';

interface IAPIResponse<T> {
	data: T;
	error?: string;
}

interface ILoginResponse {
	token: string;
}

interface IUploadResponse {
	path: string;
	width: number;
	height: number;
}

export interface IPictureWithRelations extends IPicture {
	user: IUser;
	server: IServer;
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
			prefixUrl: `${process.env.NEXT_PUBLIC_ENDPOINT as string}/`,
			throwHttpErrors: false,
			retry: 0,
			timeout: 20000
		};

		this.client = ky.create(options);
	}

	isAuthorized(): boolean {
		return this.token?.isValid;
	}

	async login(jwt: string) {
		const response = await ky.get(`${process.env.NEXT_PUBLIC_ENDPOINT as string}/api/login`, {
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
		return this.getData<IServer>(this.client.get(`api/servers/${id}`));
	}

	async putServer(id: number, server: IServer) {
		await this.getData(this.client.put(`api/servers/${id}`, {json: this.removeId(server)}));
	}

	async createServer(server: Except<IServer, 'id'>) {
		return this.getData<IServer>(this.client.post('api/servers', {json: server}));
	}

	async deleteServer(id: number) {
		await this.getData(this.client.delete(`api/servers/${id}`));
	}

	async createUser(user: Except<IUser, 'id' | 'minecraftUUID' | 'lastLoggedInAt' | 'banMessage'>) {
		return this.getData<IUser>(this.client.post('api/users', {json: user}));
	}

	async getUser(id: number) {
		return this.getData<IUserWithSponsorInfo>(this.client.get(`api/users/${id}`));
	}

	async putUser(id: number, user: Except<IUser, 'minecraftUUID'>) {
		await this.getData(this.client.put(`api/users/${id}`, {json: this.removeId(user)}));
	}

	async deleteUser(id: number) {
		await this.getData(this.client.delete(`api/users/${id}`));
	}

	async deleteUsers(ids: number[]) {
		await this.getData(this.client.delete('api/users', {json: {ids}}));
	}

	async uploadPicture(file: File) {
		const form = new FormData();

		form.append('file', file);

		return this.getData<IUploadResponse>(this.client.post('api/pictures/upload', {body: form}));
	}

	async createPicture(picture: Except<IPicture, 'id'>) {
		return this.getData<IPicture>(this.client.post('api/pictures', {json: picture}));
	}

	async deletePicture(id: number) {
		await this.getData(this.client.delete(`api/pictures/${id}`));
	}

	async putPicture(id: number, picture: IPicture) {
		await this.getData(this.client.put(`api/pictures/${id}`, {json: this.removeId(picture)}));
	}

	async getPicture(id: number) {
		return this.getData<IPictureWithRelations>(this.client.get(`api/pictures/${id}`));
	}

	async linkMinecraftAccount(code: string) {
		return this.getData<void>(this.client.post('api/whitelist', {json: {code}}));
	}

	async unlinkMinecraftAccount() {
		return this.getData<void>(this.client.delete('api/whitelist'));
	}

	async createToken(name: string) {
		return this.getData(this.client.post('api/tokens', {json: {name}}));
	}

	async deleteToken(token: string) {
		await this.getData(this.client.delete(`api/tokens/${token}`));
	}

	private async getData<T>(req: ResponsePromise): Promise<T> {
		const res = await req;

		const payload = (await res.json()) as IAPIResponse<T>;

		if (res.ok) {
			return payload.data;
		}

		const error = payload.error ? new Error(`APIError ${res.status}: ${payload.error}`) : new Error(`APIError ${res.status}`);

		throw error;
	}

	private removeId<T extends {id?: number}>(obj: T): Except<T, 'id'> {
		const o = {...obj};

		delete o.id;

		return o;
	}
}
