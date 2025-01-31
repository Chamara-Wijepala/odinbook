import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateCreateUser } from '@odinbook/utils';
import prisma from '../db/prisma';
import { issueAccessToken, issueRefreshToken } from '../utils/issueJWT';
import type { Request, Response, NextFunction } from 'express';
import type { CreateUserErrors } from '@odinbook/types';

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

	const duplicateUsername = await prisma.user.findUnique({
		where: {
			username: body.username,
		},
	});

	if (duplicateUsername) {
		const errors: CreateUserErrors = {
			username: ['This username already exists.'],
		};
		res.status(409).json(errors);
		return;
	}

	bcrypt.hash(body.password, 10, async (err, hash) => {
		if (err) return next(err);

		await prisma.user.create({
			data: {
				firstName: body.firstName,
				lastName: body.lastName,
				username: body.username,
				password: hash,
			},
		});

		return res.sendStatus(200);
	});
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
	const user = await prisma.user.findUnique({
		where: {
			username: req.body.username,
		},
	});

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

		await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				userId: user.id,
			},
		});

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			// expiresIn is supposed to be used as a seconds value but maxAge expects
			// the value to be in milliseconds
			maxAge: expiresIn * 1000,
			sameSite: 'none',
			secure: true,
			path: '/auth/refresh',
		});
		return res.status(200).json({ accessToken });
	});
}

async function refresh(req: Request, res: Response, next: NextFunction) {
	if (!req.cookies || !req.cookies.jwt) {
		return next(new Error('RefreshTokenExpiredError'));
	}

	const refreshToken: string = req.cookies.jwt;

	jwt.verify(refreshToken, PUB_KEY, async (err: unknown) => {
		// err is a TokenExpiredError from jsonwebtoken, which is already used to
		// handle expired access tokens. If it's returned as is to the error handler
		// it will call a refresh.
		if (err) {
			return next(new Error('RefreshTokenExpiredError'));
		}

		const foundToken = await prisma.refreshToken.findUnique({
			where: {
				token: refreshToken,
			},
			select: {
				token: true,
				revoked: true,
				User: {
					select: {
						username: true,
					},
				},
			},
		});

		if (!foundToken) {
			return next(new Error('RefreshTokenExpiredError'));
		}

		if (foundToken.revoked) {
			return next(new Error('RefreshTokenExpiredError'));
		}

		// Type guard if user doesn't exist. All tokens associated with a user will
		// be deleted alongside with the user so this isn't really necessary.
		// But, I'll leave this here in case I need to handle some edge case if it
		// happens
		if (!foundToken.User) {
			return next();
		}

		const accessToken = issueAccessToken(foundToken.User.username);

		res.status(200).json({ newToken: accessToken });
	});
}

export default {
	createUser,
	loginUser,
	refresh,
};
