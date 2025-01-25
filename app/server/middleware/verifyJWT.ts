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

	if (!authHeader) {
		res.status(401).json({ success: false, message: 'No token provided' });
		return;
	}

	const token = authHeader?.split(' ')[1];

	try {
		const decoded = jwt.verify(token, PUB_KEY) as UserToken;
		req.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
}
