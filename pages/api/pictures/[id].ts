import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';
import {parseId} from '../lib/parse-params';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		const picture = await prisma.picture.findFirst({
			where: {
				id
			},
			include: {
				user: true,
				server: true
			}
		});

		if (!picture) {
			res.status(404).json({error: 'Not found'});
			return;
		}

		res.json({data: picture});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.put(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);
		const {path, height, width, serverId, userId, isApproved, caption} = request.body;

		await prisma.picture.update({
			where: {
				id
			},
			data: {
				path,
				height,
				width,
				isApproved,
				caption,
				server: {
					connect: {id: serverId}
				},
				user: {
					connect: {id: userId}
				}
			}
		});

		res.json({});
	})
	.delete(async (request: NextApiRequest, res: NextApiResponse) => {
		const id = parseId(request);

		await prisma.picture.delete({where: {id}});

		res.status(200).json({});
	});
