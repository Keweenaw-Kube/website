import {NextApiRequest, NextApiResponse} from 'next';
import nc from 'next-connect';
import got from 'got';
import {IMojangName} from '../../../../lib/types';

export default nc()
	.get(async (request: NextApiRequest, res: NextApiResponse) => {
		const uuid = request.query.uuid as string;

		const names = await got.get(`https://api.mojang.com/user/profiles/${uuid}/names`).json<IMojangName[]>();

		res.status(200).json(names);
	});
