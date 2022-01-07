import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import * as securePin from 'secure-pin';
import prisma from './lib/db';
import {authMiddleware, authWithToken, IRequestWithUser} from './lib/auth';
import {getProfileByUUID} from './lib/mojang';
import {User, Server, ConnectionEvent} from '@prisma/client';

const CODE_VALID_PERIOD_MS = 5 * 60 * 1000;

const isUserAuthorizedOnServer = (user: User, server: Server): {isAuthorized: boolean; msg?: string} => {
	if (user.isBanned) {
		const msg = user.banMessage && user.banMessage !== '' ? user.banMessage : 'Your user is banned. Please contact an officer.';
		return {isAuthorized: false, msg};
	}

	if (server.limitToMembers && !user.isMember) {
		return {isAuthorized: false, msg: 'You must be a member to access this server.'};
	}

	return {isAuthorized: true};
};

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const isAuthorized = await authWithToken(request);

		if (!isAuthorized) {
			res.status(401).send('Bad API authorization.');
			return;
		}

		const domain = request.query.domain as string;
		const uuid = request.query.uuid as string;

		const user = await prisma.user.findFirst({
			where: {
				minecraftUUID: uuid
			}
		});

		const server = await prisma.server.findFirst({
			where: {
				domain,
				isArchived: false
			}
		});

		if (!server) {
			res.status(500).send('Server error. Please contact an officer.');
			return;
		}

		if (user) {
			if (request.query.state === 'disconnected') {
				await prisma.userConnectionHistory.create({
					data: {
						userId: user.id,
						serverId: server.id,
						event: ConnectionEvent.DISCONNECTED
					}
				});
				res.status(200).send('');
				return;
			}

			// Check if user is authorized
			const {isAuthorized, msg: deniedMsg} = isUserAuthorizedOnServer(user, server);

			if (isAuthorized) {
				await Promise.all([
					prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							lastLoggedInAt: new Date()
						}
					}),
					prisma.userConnectionHistory.create({
						data: {
							userId: user.id,
							serverId: server.id,
							event: ConnectionEvent.CONNECTED
						}
					})
				]);

				res.status(200).send('');
			} else {
				await prisma.userConnectionHistory.create({
					data: {
						userId: user.id,
						serverId: server.id,
						event: ConnectionEvent.DENIED
					}
				});

				res.status(401).send(deniedMsg ?? 'You\'re authorized to access this server.');
			}
		} else {
			// Generate code for user
			securePin.generatePin(6, async pin => {
				await prisma.whitelistToken.create({
					data: {
						code: pin,
						minecraftUUID: uuid
					}
				});

				res.status(401).send(`You're not on the whitelist. Go to kubemtu.com and enter this code when linking your account: ${pin}.`);
			});
		}
	})
	.use(authMiddleware({limitToOfficer: false}))
	.post(async (request: IRequestWithUser, res: NextApiResponse) => {
		const code = request.body.code as string;

		if (!code) {
			res.status(400).json({error: 'Missing code'});
			return;
		}

		const token = await prisma.whitelistToken.findFirst({
			where: {
				code,
				createdAt: {
					gte: new Date(new Date().getTime() - CODE_VALID_PERIOD_MS)
				}
			}
		});

		if (!token) {
			res.status(400).json({error: 'Code either does not exist or expired'});
			return;
		}

		// Get Mojang username
		const profile = await getProfileByUUID(token.minecraftUUID);

		// Update user
		await prisma.user.update({
			where: {
				id: request.user.id
			},
			data: {
				minecraftUUID: token.minecraftUUID,
				minecraftUsername: profile.name
			}
		});

		res.status(200).json({});
	})
	.delete(async (request: IRequestWithUser, res: NextApiResponse) => {
		// Unlink account

		await prisma.user.update({
			where: {
				id: request.user.id
			},
			data: {
				minecraftUUID: '',
				minecraftUsername: ''
			}
		});

		res.status(200).json({});
	});
