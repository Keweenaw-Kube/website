import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	// .use(authMiddleware({limitToOfficer: true}))
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const servers = await prisma.server.findMany();

		res.status(200).json(servers);
	});
