import bcrypt from 'bcryptjs';
import { validateCreateUser } from '@odinbook/utils';
import prisma from '../db/prisma';
import { issueAccessToken, issueRefreshToken } from '../utils/issueJWT';
import type { Request, Response, NextFunction } from 'express';
import type { CreateUserErrors } from '@odinbook/types';

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
			maxAge: expiresIn,
			sameSite: 'none',
			secure: process.env.NODE_ENV === 'production',
		});
		return res.status(200).json({ accessToken });
	});
}

export default {
	createUser,
	loginUser,
};
