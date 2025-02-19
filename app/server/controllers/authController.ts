import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateCreateUser } from '@odinbook/utils';
import authService from '../services/authService';
import usersService from '../services/usersService';
import { issueAccessToken, issueRefreshToken } from '../utils/issueJWT';
import type { Request, Response, NextFunction } from 'express';
import type { CreateUserErrors } from '@odinbook/types';
import { TokenExpiredError } from 'jsonwebtoken';

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

		const accessToken = issueAccessToken(user.username);
		const { refreshToken, expiresIn } = issueRefreshToken(user.username);

		await authService.createRefreshToken(refreshToken, user.id);

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

	jwt.verify(refreshToken, PUB_KEY, async (err: unknown) => {
		const foundToken = await authService.getRefreshToken(refreshToken);

		if (!foundToken) {
			return next(new Error('RefreshTokenExpiredError'));
		}

		// refresh token is either expired or flagged as revoked in the db
		if (
			foundToken.revoked ||
			(foundToken && err instanceof TokenExpiredError)
		) {
			await authService.deleteRefreshToken(foundToken.token);
			return next(new Error('RefreshTokenExpiredError'));
		}

		// Type guard if user doesn't exist. All tokens associated with a user will
		// be deleted alongside with the user so this isn't really necessary.
		// But, I'll leave this here in case I need to handle some edge case if it
		// happens
		if (!foundToken.User) {
			return next();
		}

		// since the possibility of err being a TokenExpiredError is handled earlier
		// passing it to next is safe. Since TokenExpiredError is used to handle
		// expired access tokens, if it's returned as is to the error handler
		// it will call a refresh.
		if (err) return next(err);

		const accessToken = issueAccessToken(foundToken.User.username);

		res.status(200).json({
			newToken: accessToken,
			user: {
				id: foundToken.User.id,
				firstName: foundToken.User.firstName,
				lastName: foundToken.User.lastName,
				username: foundToken.User.username,
				following: foundToken.User.following.map((user) => user.id),
			},
		});
	});
}

async function logout(req: Request, res: Response) {
	if (!req.cookies.jwt) {
		res.sendStatus(200);
	}

	await authService.deleteRefreshToken(req.cookies.jwt);

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
};
