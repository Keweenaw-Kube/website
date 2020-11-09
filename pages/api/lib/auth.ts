import jwt, {JwtHeader, SigningKeyCallback} from 'jsonwebtoken';
import jwk from 'jwks-rsa';
import {SIGNING_SECRET} from './config';

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
