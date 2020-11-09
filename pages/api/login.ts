import {NextApiRequest, NextApiResponse} from 'next';
import {checkAndDecodeGoogleJWT, signObject} from './lib/auth';

const login = async (request: NextApiRequest, res: NextApiResponse) => {
	const googleJWT = request.headers.authorization;

	if (!googleJWT) {
		return res.status(401);
	}

	try {
		const decoded = await checkAndDecodeGoogleJWT(googleJWT);

		// TODO: logic here for signing up new users

		// Issue new JWT
		const token = signObject({
			user: {},
			picture: (decoded as any).picture
		});

		res.status(200).json({token});
	} catch {
		res.status(401);
	}
};

export default login;
