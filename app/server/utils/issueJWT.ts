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

export function issueAccessToken(
	id: string,
	username: string,
	expiresIn: string | number
) {
	const payload = {
		id,
		username,
	};
	const options: SignOptions = {
		expiresIn,
		algorithm: 'RS256',
	};

	return jwt.sign(payload, PRIV_KEY, options);
}

export function issueRefreshToken(
	username: string,
	tokenVersion: number,
	// When passing in a numeric value, the jsonwebtoken library interprets it as
	// seconds, not milliseconds
	expiresIn: number
) {
	const payload = {
		username,
		tokenVersion,
	};
	const options: SignOptions = {
		expiresIn,
		algorithm: 'RS256',
	};

	return jwt.sign(payload, PRIV_KEY, options);
}
