import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateCreateUser } from '@odinbook/utils';
import usersService from '../services/usersService';
import { issueAccessToken, issueRefreshToken } from '../utils/issueJWT';
import type { Request, Response, NextFunction } from 'express';
import type { CreateUserErrors } from '@odinbook/types';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserToken } from '../types';

const PUB_KEY = {
	key: fs.readFileSync(
		path.join(__dirname, '..', 'keys/id_rsa_pub.pem'),
		'utf-8'
	),
	passphrase: process.env.KEY_PASSPHRASE,
};

async function createUser(req: Request, res: Response, next: NextFunction) {
	const { body } = req;
	const validation = validateCreateUser(body);

	if (!validation.success) {
		res.status(400).json({ errors: validation.errors });
		return;
	}

	// used to determine if username is a duplicate or not
	const userId = await usersService.getUserId(body.username);

	if (userId) {
		const errors: CreateUserErrors = {
			username: ['This username already exists.'],
		};
		res.status(409).json(errors);
		return;
	}

	bcrypt.hash(body.password, 10, async (err, hash) => {
		if (err) return next(err);

		const { firstName, lastName, username } = body;

		await usersService.createUser(firstName, lastName, username, hash);

		return res.sendStatus(200);
	});
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
	const user = await usersService.getUserAuthDetails(req.body.username);

	if (!user) {
		res
			.status(404)
			.json({ username: 'The username is incorrect.', password: '' });
		return;
	}

	bcrypt.compare(req.body.password, user.password, async (err, result) => {
		if (err) return next(err);

		if (!result) {
			return res
				.status(401)
				.json({ username: '', password: 'The password is incorrect.' });
		}

		const expiresIn =
			process.env.NODE_ENV === 'production' ? 24 * 60 * 60 : 60 * 60;
		const accessToken = issueAccessToken(user.username);
		const refreshToken = issueRefreshToken(
			user.username,
			user.tokenVersion,
			expiresIn
		);

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			// expiresIn is supposed to be used as a seconds value but maxAge expects
			// the value to be in milliseconds
			maxAge: expiresIn * 1000,
			sameSite: 'none',
			secure: true,
			path: '/auth',
		});
		return res.status(200).json({
			accessToken,
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				following: user.following.map((user) => user.id),
			},
		});
	});
}

async function refresh(req: Request, res: Response, next: NextFunction) {
	if (!req.cookies || !req.cookies.jwt) {
		return next(new Error('RefreshTokenExpiredError'));
	}

	const refreshToken: string = req.cookies.jwt;

	try {
		const decoded = jwt.verify(refreshToken, PUB_KEY) as UserToken;

		const currentUser = await usersService.getUserAuthDetails(decoded.username);

		// Type guard. User will always exist.
		if (!currentUser) return;

		// received refresh token is an older version
		if (currentUser.tokenVersion !== decoded.tokenVersion) {
			next(new Error('RefreshTokenExpiredError'));
			return;
		}

		const accessToken = issueAccessToken(currentUser.username);

		res.status(200).json({
			newToken: accessToken,
			user: {
				id: currentUser.id,
				firstName: currentUser.firstName,
				lastName: currentUser.lastName,
				username: currentUser.username,
				following: currentUser.following.map((user) => user.id),
			},
		});
	} catch (err) {
		// refresh token is expired
		if (err instanceof TokenExpiredError) {
			return next(new Error('RefreshTokenExpiredError'));
		}

		// since the possibility of err being a TokenExpiredError is handled earlier
		// passing it to next is safe. Since TokenExpiredError is used to handle
		// expired access tokens, if it's returned as is to the error handler
		// it will call a refresh.
		if (err) return next(err);
	}
}

async function logout(req: Request, res: Response) {
	if (!req.cookies.jwt) {
		res.sendStatus(200);
	}

	res
		.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			path: '/auth',
		})
		.sendStatus(200);
}

async function logoutFromAllDevices(req: Request, res: Response) {
	if (!req.cookies.jwt) {
		res.sendStatus(200);
	}

	await usersService.updateTokenVersion(req.user.username);

	res
		.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			path: '/auth',
		})
		.sendStatus(200);
}

export default {
	createUser,
	loginUser,
	refresh,
	logout,
	logoutFromAllDevices,
};
