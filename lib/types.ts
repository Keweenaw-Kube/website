export interface IServer {
	id: number;
	name: string;
	description: string;
	domain: string;
	limitToMembers: boolean;
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
	isMember: boolean;
	isBanned: boolean;
}

export interface IMojangName {
	id: string;
	name: string;
}

export interface IMojangProfile {
	id: string;
	name: string;
}

export interface IPicture {
	id: number;
	userId: number;
	serverId: number;
	path: string;
	width: number;
	height: number;
	isApproved: boolean;
	caption: string;
}

export interface IToken {
	token: string;
	name: string;
	lastUsedAt: string;
}
