import {User} from '@prisma/client';
import jwt, {JwtHeader, SigningKeyCallback} from 'jsonwebtoken';
import jwk from 'jwks-rsa';
import {NextApiRequest, NextApiResponse} from 'next';
import {NextHandler} from 'next-connect';
import {SIGNING_SECRET} from './config';
import prisma from './db';

export const signObject = (object: Record<string, unknown>) => {
	return jwt.sign(object, SIGNING_SECRET, {expiresIn: '24h'});
};

const getGoogleJWK = (header: JwtHeader, callback: SigningKeyCallback) => {
	if (!header.kid) {
		callback(new Error());
	}

	jwk({
		cache: true,
		jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
	}).getSigningKey(header.kid as string, (error, key) => {
		if (error) {
			callback(error);
		}

		const signingKey = key.getPublicKey();

		callback(null, signingKey);
	});
};

export const checkAndDecodeGoogleJWT = async (token: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, getGoogleJWK, {}, (error, decoded) => {
			if (error) {
				return reject(error);
			}

			resolve(decoded);
		});
	});
};

const getToken = (request: NextApiRequest): string | null => {
	if (request.headers.authorization) {
		return request.headers.authorization.replace('Bearer ', '');
	}

	return null;
};

export interface IRequestWithUser extends NextApiRequest {
	user: User;
}

export const authMiddleware = ({limitToOfficer = false} = {}) => (request: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
	const token = getToken(request);

	if (!token) {
		res.status(401).end();
		return;
	}

	return new Promise((resolve, reject) => {
		jwt.verify(token, SIGNING_SECRET, {}, async (error, decoded) => {
			if (error) {
				res.status(401).end();
				return;
			}

			const {email} = (decoded as {email: string});

			const user = await prisma.user.findFirst({where: {email}});

			if (!user) {
				res.status(401).end();
				return;
			}

			if (limitToOfficer && !user.isOfficer) {
				res.status(401).end();
				return;
			}

			(request as IRequestWithUser).user = user;

			next();
		});
	});
};

export const authWithToken = async (request: NextApiRequest): Promise<boolean> => {
	const header = request.headers.authorization;

	let tokenSegment;

	if (header) {
		if (!header?.startsWith('Basic ')) {
			return false;
		}

		tokenSegment = header.replace('Basic ', '');
	} else {
		tokenSegment = request.query.token as string;
	}

	if (!tokenSegment) {
		return false;
	}

	const storedToken = await prisma.authToken.findFirst({
		where: {
			token: tokenSegment
		}
	});

	if (!storedToken) {
		return false;
	}

	await prisma.authToken.update({
		where: {
			token: tokenSegment
		},
		data: {
			lastUsedAt: new Date()
		}
	});

	return true;
};
