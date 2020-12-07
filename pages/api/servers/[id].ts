import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

const parseId = (request: NextApiRequest) => Number.parseInt(request.query.id as string, 10);

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		const server = await prisma.server.findOne({
			where: {
				id
			}
		});

		if (!server) {
			res.status(404).json({error: 'Not found'});
			return;
		}

		res.json({data: server});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.put(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		await prisma.server.update({
			where: {
				id
			},
			data: request.body
		});

		res.json({});
	})
	.delete(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		// https://github.com/prisma/migrate/issues/249
		await prisma.picture.deleteMany({where: {serverId: id}});

		await prisma.server.delete({
			where: {
				id
			}
		});

		res.status(200).json({});
	});

