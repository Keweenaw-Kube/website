import {NextApiRequest, NextApiResponse} from 'next';
import {NextHandler} from 'next-connect';

export const trimBodyFieldsMiddleware = () => (request: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
	if (request.method === 'POST') {
		for (const [key, value] of Object.entries(request.body)) {
			if (typeof value === 'string') {
				request.body[key] = value.trim();
			}
		}
	}

	next();
};
