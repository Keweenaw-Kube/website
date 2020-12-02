import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = Number.parseInt(request.query.id as string, 10);

		const server = await prisma.server.findOne({
			where: {
				id: Number.parseInt(request.query.id as string, 10)
			}
		});

		res.json({data: server});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.put(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = Number.parseInt(request.query.id as string, 10);

		await prisma.server.update({
			where: {
				id
			},
			data: request.body
		});

		res.json({});
	});

