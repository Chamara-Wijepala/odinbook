import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { UserToken } from '../../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUB_KEY = {
	key: fs.readFileSync(
		process.env.NODE_ENV === 'production'
			? (process.env.PUBLIC_KEY_PATH as string)
			: path.join(__dirname, '..', '..', 'keys/id_rsa_pub.pem'),
		'utf-8'
	),
};

export default function verifyJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization'];
	const bearerToken = authHeader?.split(' ')[1];

	if (!authHeader) throw new Error('MissingHeaderError');
	if (!bearerToken) throw new Error('MissingBearerTokenError');

	try {
		const decoded = jwt.verify(bearerToken, PUB_KEY) as UserToken;
		req.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
}
