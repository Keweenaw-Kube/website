import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';
import {getProfileByName} from '../lib/mojang';

export default nc()
	.use(authMiddleware({limitToOfficer: true}))
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const users = await prisma.user.findMany({orderBy: {email: 'asc'}});

		res.status(200).json({data: users});
	})
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const u = await prisma.user.findOne({where: {email: request.body.email}});

		if (u) {
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

		try {
			const user = await prisma.user.create({
				data: request.body
			});

			res.json({data: user});
		} catch {
			res.status(400).json({error: 'Unknown error'});
		}
	});
