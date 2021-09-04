import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const query = request.query;

		const parsedQuery: Record<string, string | boolean> = {};

		for (const key in query) {
			if (Object.prototype.hasOwnProperty.call(query, key)) {
				const value = query[key];
				if (value === 'false') {
					parsedQuery[key] = false;
				} else if (value === 'true') {
					parsedQuery[key] = true;
				} else {
					parsedQuery[key] = value as string;
				}
			}
		}

		const servers = await prisma.server.findMany({
			orderBy: {name: 'asc'},
			where: parsedQuery
		});

		res.status(200).json({data: servers});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const server = await prisma.server.create({
			data: request.body
		});

		res.json({data: server});
	});
