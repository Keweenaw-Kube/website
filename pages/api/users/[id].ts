import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';
import {getProfileByName} from '../lib/mojang';

const parseId = (request: NextApiRequest) => Number.parseInt(request.query.id as string, 10);

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		const user = await prisma.user.findOne({
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
	.use(authMiddleware({limitToOfficer: true}))
	.put(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		// Check email
		const u = await prisma.user.findOne({where: {email: request.body.email}});

		if (u?.id !== id) {
			res.status(400).json({error: 'Email already exists'});
			return;
		}

		// Look up Mojang username
		if (request.body.minecraftUsername === '') {
			request.body.minecraftUUID = '';
		} else {
			const profiles = await getProfileByName(request.body.minecraftUsername);

			if (profiles.length === 0) {
				res.status(400).json({error: 'Minecraft user does not exist'});
				return;
			}

			request.body.minecraftUUID = profiles[0].id;
		}

		await prisma.user.update({
			where: {
				id
			},
			data: request.body
		});

		res.json({});
	})
	.delete(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		await prisma.user.delete({
			where: {
				id
			}
		});

		res.json({});
	});

