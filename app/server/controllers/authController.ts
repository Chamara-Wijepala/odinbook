import { validateCreateUser } from '@odinbook/utils';
import authService from '../services/authService';
import type { Request, Response, NextFunction } from 'express';

async function createUser(req: Request, res: Response, next: NextFunction) {
	const { body } = req;
	const validation = validateCreateUser(body);

	if (!validation.success) {
		res.status(400).json({ errors: validation.errors });
		return;
	}

	try {
		const { status, errors } = await authService.register(validation.data);

		if (errors) {
			res.status(status).json(errors);
			return;
		}

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { status, errors, data } = await authService.login(
			req.body.username,
			req.body.password
		);

		if (errors) {
			res.status(status).json(errors);
			return;
		}

		res.cookie('jwt', data.refreshToken, {
			httpOnly: true,
			// expiresIn is supposed to be used as a seconds value but maxAge expects
			// the value to be in milliseconds
			maxAge: data.expiresIn * 1000,
			sameSite: 'none',
			secure: true,
			path: '/auth',
		});
		res.status(status).json({ accessToken: data.accessToken, user: data.user });
	} catch (error) {
		next(error);
	}
}

async function refresh(req: Request, res: Response, next: NextFunction) {
	if (!req.cookies || !req.cookies.jwt) {
		return next(new Error('RefreshTokenExpiredError'));
	}

	try {
		const { status, error, data } = await authService.refresh(req.cookies.jwt);

		if (error) {
			next(error);
		}

		res.status(status!).json(data);
	} catch (err) {
		if (err) return next(err);
	}
}

async function logout(req: Request, res: Response) {
	if (!req.cookies.jwt) {
		res.sendStatus(200);
		return;
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

async function logoutFromAllDevices(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.cookies.jwt) {
		res.sendStatus(200);
		return;
	}

	try {
		await authService.updateTokenVersion(req.user.username);

		res
			.clearCookie('jwt', {
				httpOnly: true,
				sameSite: 'none',
				secure: true,
				path: '/auth',
			})
			.sendStatus(200);
	} catch (error) {
		next(error);
	}
}

export default {
	createUser,
	loginUser,
	refresh,
	logout,
	logoutFromAllDevices,
};
