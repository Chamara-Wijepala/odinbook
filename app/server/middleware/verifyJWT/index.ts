import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { UserToken } from '../../types';

const PUB_KEY = process.env.PUB_KEY as string;

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
