import fs from 'fs';
import path from 'path';
import jwt, { SignOptions } from 'jsonwebtoken';

const PRIV_KEY = {
	key: fs.readFileSync(
		path.join(__dirname, '..', 'keys/id_rsa_priv.pem'),
		'utf-8'
	),
	passphrase: process.env.KEY_PASSPHRASE,
};

export function issueAccessToken(username: string) {
	const expiresIn = '15m';
	const payload = {
		username,
	};
	const options: SignOptions = {
		expiresIn,
		algorithm: 'RS256',
	};

	return jwt.sign(payload, PRIV_KEY, options);
}

export function issueRefreshToken(username: string, tokenVersion: number) {
	// when passing in a numeric value, the jsonwebtoken library interprets it as
	// seconds, not milliseconds
	const expiresIn =
		process.env.NODE_ENV === 'production' ? 24 * 60 * 60 : 60 * 60;
	const payload = {
		username,
		tokenVersion,
	};
	const options: SignOptions = {
		expiresIn,
		algorithm: 'RS256',
	};

	return {
		refreshToken: jwt.sign(payload, PRIV_KEY, options),
		expiresIn,
	};
}
