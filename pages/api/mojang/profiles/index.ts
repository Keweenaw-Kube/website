import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import got from 'got';
import {IMojangName, IMojangUser} from '../../../../lib/types';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const uuid = request.query.uuid as string;
		const name = request.query.name as string;

		if (uuid) {
			try {
				const names = await got.get(`https://api.mojang.com/user/profiles/${uuid}/names`).json<IMojangName[]>();

				res.status(200).json({data: names});
			} catch {
				res.status(500).json({error: 'Mojang API error'});
			}
		} else if (name) {
			try {
				const profiles = await got.post('https://api.mojang.com/profiles/minecraft', {json: [name]}).json<IMojangUser[]>();

				res.status(200).json({data: profiles});
			} catch {
				res.status(500).json({error: 'Mojang API error'});
			}
		} else {
			res.status(400).json({error: 'Bad request'});
		}
	});
