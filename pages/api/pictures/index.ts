import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const pictures = await prisma.picture.findMany({orderBy: {createdAt: 'desc'}});

		res.status(200).json({data: pictures});
	})
	.use(authMiddleware({limitToOfficer: true}))
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const {path, height, width, serverId, userId, isApproved, caption} = request.body;

		const picture = await prisma.picture.create({
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

		res.json({data: picture});
	});
