import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import {v4 as uuidv4} from 'uuid';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const tokens = await prisma.authToken.findMany({orderBy: {lastUsedAt: 'desc'}});

		res.status(200).json({data: tokens});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const {name} = request.body;

		const token = await prisma.authToken.create({
			data: {
				name,
				token: uuidv4()
			}
		});

		res.json({data: token});
	});
