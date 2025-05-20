import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt, { SignOptions } from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIV_KEY = {
	key: fs.readFileSync(
		process.env.NODE_ENV === 'production'
			? (process.env.PRIVATE_KEY_PATH as string)
			: path.join(__dirname, '..', 'keys/id_rsa_priv.pem'),
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
