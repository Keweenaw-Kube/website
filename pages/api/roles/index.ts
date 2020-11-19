import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const roles = await prisma.whitelistRole.findMany({orderBy: {name: 'asc'}});

		res.status(200).json(roles);
	})
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const role = await prisma.whitelistRole.create({
			data: request.body
		});

		res.json(role);
	});
