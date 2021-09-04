import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware, IRequestWithUser} from '../lib/auth';
import {getProfileByName} from '../lib/mojang';
import {parseId} from '../lib/parse-params';

export default nc()
	.use(authMiddleware({limitToOfficer: false}))
	.get(async (request: IRequestWithUser, res: NextApiResponse) => {
		const id = parseId(request);

		if (request.user.id !== id && !request.user.isOfficer) {
			res.status(401).json({error: 'Unauthorized'});
			return;
		}

		const user = await prisma.user.findFirst({
			where: {
				id
			}
		});

		if (!user) {
			res.status(404).json({error: 'Not found'});
			return;
		}

		res.json({data: user});
	})
	.put(async (request: IRequestWithUser, res: NextApiResponse) => {
		const id = parseId(request);

		if (request.user.id !== id && !request.user.isOfficer) {
			res.status(401).json({error: 'Unauthorized'});
			return;
		}

		// Check email
		const u = await prisma.user.findFirst({where: {email: request.body.email}});

		if (u?.id !== id) {
			res.status(400).json({error: 'Email already exists'});
			return;
		}

		// Look up Mojang username
		if (request.body.minecraftUsername === '') {
			request.body.minecraftUUID = '';
		} else {
			const profile = await getProfileByName(request.body.minecraftUsername);

			if (!profile) {
				res.status(400).json({error: 'Minecraft user does not exist'});
				return;
			}

			request.body.minecraftUUID = profile.id;
		}

		await prisma.user.update({
			where: {
				id
			},
			data: request.body
		});

		res.json({});
	})
	.delete(async (request: IRequestWithUser, res: NextApiResponse) => {
		const id = parseId(request);

		if (request.user.id !== id && !request.user.isOfficer) {
			res.status(401).json({error: 'Unauthorized'});
			return;
		}

		// https://github.com/prisma/migrate/issues/249
		await prisma.picture.deleteMany({where: {userId: id}});

		await prisma.user.delete({
			where: {
				id
			}
		});

		res.json({});
	});
