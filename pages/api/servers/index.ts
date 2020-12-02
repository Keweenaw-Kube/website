import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const servers = await prisma.server.findMany({orderBy: {name: 'asc'}});

		res.status(200).json({data: servers});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const server = await prisma.server.create({
			data: request.body
		});

		res.json({data: server});
	});
