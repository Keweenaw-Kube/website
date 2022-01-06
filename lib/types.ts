export interface IServer {
	id: number;
	name: string;
	description: string;
	domain: string;
	limitToMembers: boolean;
	isArchived: boolean;
	archiveFileUrl: string | null;
}

export interface IRole {
	id: number;
	name: string;
}

export interface IUser {
	id: number;
	email: string | null;
	minecraftUUID: string;
	minecraftUsername: string;
	isOfficer: boolean;
	isMember: boolean;
	isBanned: boolean;
	banMessage?: string | null;
	lastLoggedInAt: string;
	sponsoredByUserId?: number | null;
}

export interface IUserWithSponsorInfo extends IUser {
	sponsoredBy?: IUser;
	sponsoring: IUser[];
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
