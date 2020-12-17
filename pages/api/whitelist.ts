import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import * as securePin from 'secure-pin';
import prisma from './lib/db';
import {authMiddleware, authWithToken, IRequestWithUser} from './lib/auth';
import {getProfileByUUID} from './lib/mojang';

const CODE_VALID_PERIOD_MS = 5 * 60 * 1000;

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

		if (user) {
			// Check if user is authorized
			if (user.isBanned) {
				res.status(401).send('Your user is banned. Please contact an officer.');
				return;
			}

			const server = await prisma.server.findFirst({
				where: {
					domain
				}
			});

			if (!server) {
				res.status(500).send('Server error. Please contact an officer.');
				return;
			}

			if (server.limitToMembers && !user.isMember) {
				res.status(401).send('You must be a member to access this server.');
				return;
			}

			res.status(200).send('');
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
