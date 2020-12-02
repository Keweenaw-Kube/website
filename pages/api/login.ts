import {NextApiRequest, NextApiResponse} from 'next';
import prisma from './lib/db';
import {checkAndDecodeGoogleJWT, signObject} from './lib/auth';

interface GoogleJWT {
	email: string;
	picture: string;
	given_name: string;
}

const login = async (request: NextApiRequest, res: NextApiResponse) => {
	const googleJWT = request.headers.authorization;

	if (!googleJWT) {
		return res.status(401).json({error: 'token not found'});
	}

	try {
		const decoded = await checkAndDecodeGoogleJWT(googleJWT) as GoogleJWT;

		let user = await prisma.user.findOne({where: {email: decoded.email}});

		if (!user) {
			// Make a new user
			user = await prisma.user.create({
				data: {
					email: decoded.email,
					isOfficer: false,
					isMember: false
				}
			});
		}

		// Issue new JWT
		const token = signObject({
			isMember: user.isMember,
			isOfficer: user.isOfficer,
			picture: decoded.picture,
			name: decoded.given_name,
			email: decoded.email
		});

		res.status(200).json({data: {token}});
	} catch {
		res.status(401).json({error: 'could not decode/verify token'});
	}
};

export default login;
