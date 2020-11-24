import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const users = await prisma.user.findMany({orderBy: {email: 'asc'}});

		res.status(200).json(users);
	})
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const user = await prisma.user.create({
			data: request.body
		});

		res.json(user);
	});
