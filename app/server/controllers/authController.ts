import bcrypt from 'bcryptjs';
import prisma from '../db/prisma';
import { CreateUserSchema } from '@odinbook/zod';
import type { Request, Response, NextFunction } from 'express';
import type { CreateUserErrors } from '@odinbook/types';

async function createUser(req: Request, res: Response, next: NextFunction) {
	const { body } = req;
	const validation = CreateUserSchema.safeParse(body);

	if (!validation.success) {
		let errors: CreateUserErrors = {};
		validation.error.issues.forEach((issue) => {
			// issue.path will always be an array with a single element in this case
			const name = issue.path[0] as keyof CreateUserErrors;
			if (!errors[name]) errors[name] = [];
			errors[name] = [...errors[name], issue.message];
		});
		res.status(400).json({ errors });
		return;
	}

	const duplicateUsername = await prisma.user.findUnique({
		where: {
			username: body.username,
		},
	});

	if (duplicateUsername) {
		res.status(409).json({
			success: false,
			errors: { username: ['This username already exists.'] },
		});
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

export default {
	createUser,
};
