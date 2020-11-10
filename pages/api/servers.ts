import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import {PrismaClient} from '@prisma/client';
import {authMiddleware} from './lib/auth';

export default nc()
	.use(authMiddleware({limitToOfficer: true}))
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const prisma = new PrismaClient();

		const servers = await prisma.server.findMany();

		res.status(200).json(servers);
	});
