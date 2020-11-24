export interface IServer {
	id: number;
	name: string;
	description: string;
	domain: string;
}

export interface IRole {
	id: number;
	name: string;
}

export interface IUser {
	id: number;
	email: string;
	minecraftUUID: string;
	minecraftUsername: string;
	isOfficer: boolean;
	isBanned: boolean;
}

export interface IMojangName {
	name: string;
	changedToAt?: number;
}
