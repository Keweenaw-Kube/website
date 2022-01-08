import {Prisma, ConnectionEvent, User, UserConnectionHistory} from '@prisma/client';
import prisma from './db';

export interface ISession {
	id: string;
	start: Date;
	end: Date;
}

interface Params {
	userId: User['id'];
	after?: Date;
	before?: Date;
}

const DEFAULT_SESSION_LENGTH_MS = 2 * 60 * 60 * 1000;

const getUserSessions = async (params: Params): Promise<ISession[]> => {
	// Prisma doesn't currently support database views :(

	const {userId, after, before} = params;

	let where: Prisma.UserConnectionHistoryFindManyArgs['where'] = {
		event: {
			not: ConnectionEvent.DENIED
		},
		userId
	};

	if (after) {
		where = {
			...where,
			createdAt: {
				gte: after
			}
		};
	}

	if (before) {
		where = {
			...where,
			createdAt: {
				lte: before
			}
		};
	}

	const connectionHistory = await prisma.userConnectionHistory.findMany({where, orderBy: {createdAt: 'asc'}});

	const sessions: ISession[] = [];

	let previousConnectionEvent: UserConnectionHistory | null = null;

	for (const connectionEvent of connectionHistory) {
		switch (connectionEvent.event) {
			case ConnectionEvent.CONNECTED: {
				if (previousConnectionEvent) {
					// Got into a bad state
					sessions.push({
						id: connectionEvent.id,
						start: previousConnectionEvent.createdAt,
						end: new Date(previousConnectionEvent.createdAt.getTime() + DEFAULT_SESSION_LENGTH_MS)
					});
				} else {
					previousConnectionEvent = connectionEvent;
				}

				break;
			}

			case ConnectionEvent.DISCONNECTED: {
				if (previousConnectionEvent) {
					sessions.push({
						id: connectionEvent.id,
						start: previousConnectionEvent.createdAt,
						end: connectionEvent.createdAt
					});

					previousConnectionEvent = null;
				} else {
					// Got into a bad state, ignore
				}

				break;
			}

			default:
				throw new Error(`Unknown connection event: ${connectionEvent.event}`);
		}
	}

	return sessions;
};

export default getUserSessions;
