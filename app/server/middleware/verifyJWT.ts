import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { UserToken } from '../types';

const PUB_KEY = {
	key: fs.readFileSync(
		path.join(__dirname, '..', 'keys/id_rsa_pub.pem'),
		'utf-8'
	),
	passphrase: process.env.KEY_PASSPHRASE,
};

export default function verifyJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	if (!authHeader || !token) {
		res.status(401).json({
			type: 'error',
			message:
				'There was an unexpected error when verifying your session. Please log in again',
		});
		return;
	}

	try {
		const decoded = jwt.verify(token, PUB_KEY) as UserToken;
		req.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
}
