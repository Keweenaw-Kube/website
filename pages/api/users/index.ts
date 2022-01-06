import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import prisma from '../lib/db';
import {authMiddleware} from '../lib/auth';
import {getProfileByName} from '../lib/mojang';
import {trimBodyFieldsMiddleware} from '../lib/trim-body-fields';

export default nc()
	.use(authMiddleware({limitToOfficer: true}))
	.use(trimBodyFieldsMiddleware())
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const {has} = request.query;

		const requiredFields = [];

		if (typeof has === 'string') {
			requiredFields.push(has);
		} else if (Array.isArray(has)) {
			requiredFields.push(...has);
		}

		const users = await prisma.user.findMany({
			where: {
				AND: [
					...requiredFields.map(field => ({
						[field]: {
							not: null
						}
					})),
					...requiredFields.map(field => ({
						[field]: {
							not: ''
						}
					}))
				]
			},
			orderBy: {email: 'asc'}
		});

		res.status(200).json({data: users});
	})
	.post(async (request: NextApiRequest, res: NextApiResponse) => {
		const u = await prisma.user.findFirst({where: {email: request.body.email}});

		if (u) {
			res.status(400).json({error: 'Email already exists'});
			return;
		}

		// Look up Mojang username
		if (request.body.minecraftUsername === '') {
			request.body.minecraftUUID = '';
		} else {
			const profile = await getProfileByName(request.body.minecraftUsername);

			if (!profile) {
				res.status(400).json({error: 'Minecraft user does not exist'});
				return;
			}

			request.body.minecraftUUID = profile.id;
		}

		if (!request.body.sponsoredByUserId && (!request.body.email || request.body.email === '')) {
			res.status(400).json({error: 'Email or sponsorship is required'});
			return;
		}

		try {
			const user = await prisma.user.create({
				data: {
					...request.body,
					email: (request.body.email && request.body.email === '') ? null : request.body.email
				}
			});

			res.json({data: user});
		} catch {
			res.status(400).json({error: 'Unknown error'});
		}
	})
	.delete(async (request: NextApiRequest, res: NextApiResponse) => {
		const {ids} = request.body;

		try {
			await prisma.user.deleteMany({
				where: {
					id: {
						in: ids
					}
				}
			});

			res.status(200).json({data: []});
		} catch {
			res.status(400).json({error: 'Unknown error'});
		}
	});
