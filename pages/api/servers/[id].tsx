import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	// .use(authMiddleware({limitToOfficer: true}))
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = Number.parseInt(request.query.id as string, 10);

		const server = await prisma.server.findOne({
			where: {
				id: Number.parseInt(request.query.id as string, 10)
			}
		});

		res.json(server);
	});

export const getServerById = async (id: number) => prisma.server.findOne({
	where: {
		id
	}
});
