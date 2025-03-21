import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import usersRepository from '../repositories/usersRepository';
import { issueAccessToken, issueRefreshToken } from '../utils/issueJWT';
import type { CreateUserErrors } from '@odinbook/types';
import type { UserToken } from '../types';

const PUB_KEY = {
	key: fs.readFileSync(
		path.join(__dirname, '..', 'keys/id_rsa_pub.pem'),
		'utf-8'
	),
	passphrase: process.env.KEY_PASSPHRASE,
};

async function register({
	firstName,
	lastName,
	username,
	password,
}: {
	firstName: string;
	lastName: string;
	username: string;
	password: string;
}) {
	const duplicate = await usersRepository.findByUsername(username);

	if (duplicate) {
		const result: {
			status: number;
			errors: CreateUserErrors;
		} = {
			status: 409,
			errors: { username: ['This username already exists.'] },
		};
		return result;
	}

	const hash = await bcrypt.hash(password, 10);

	await usersRepository.create(firstName, lastName, username, hash);

	return {
		status: 200,
		errors: null,
	};
}

async function login(username: string, password: string) {
	const user = await usersRepository.getLoginData(username);

	if (!user) {
		return {
			status: 404,
			errors: { username: 'The username is incorrect.', password: '' },
			data: null,
		};
	}

	const isValid = await bcrypt.compare(password, user.password);

	if (!isValid) {
		return {
			status: 401,
			errors: { username: '', password: 'The password is incorrect.' },
			data: null,
		};
	}

	const expiresIn =
		process.env.NODE_ENV === 'production' ? 24 * 60 * 60 : 60 * 60;
	const accessToken = issueAccessToken(user.username, '15m');
	const refreshToken = issueRefreshToken(
		user.username,
		user.tokenVersion,
		expiresIn
	);

	return {
		status: 200,
		errors: null,
		data: {
			expiresIn,
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				following: user.following.map((user) => user.id),
			},
		},
	};
}

async function refresh(refreshToken: string) {
	try {
		const decoded = jwt.verify(refreshToken, PUB_KEY) as UserToken;

		const currentUser = await usersRepository.getLoginData(decoded.username);

		// Type guard. User will always exist.
		if (!currentUser) {
			return { status: null, error: null, data: null };
		}

		// Received refresh token is an older version
		if (currentUser.tokenVersion !== decoded.tokenVersion) {
			return {
				status: null,
				error: new Error('RefreshTokenExpiredError'),
				data: null,
			};
		}

		const accessToken = issueAccessToken(currentUser.username, '15m');

		return {
			status: 200,
			error: null,
			data: {
				newToken: accessToken,
				user: {
					id: currentUser.id,
					firstName: currentUser.firstName,
					lastName: currentUser.lastName,
					username: currentUser.username,
					following: currentUser.following.map((user) => user.id),
				},
			},
		};
	} catch (error) {
		// Refresh token is expired. Since TokenExpiredError is used to handle
		// expired access tokens, if it's returned as is to the error handler
		// it will call a refresh.
		if (error instanceof TokenExpiredError) {
			return {
				status: null,
				error: new Error('RefreshTokenExpiredError'),
				data: null,
			};
		}

		// Unexpected error. Will be passed to error handler middleware.
		throw error;
	}
}

async function updateTokenVersion(username: string) {
	await usersRepository.updateTokenVersion(username);
}

export default {
	register,
	login,
	refresh,
	updateTokenVersion,
};
