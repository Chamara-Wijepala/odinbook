import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const { TokenExpiredError, JsonWebTokenError } = jwt;

function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof TokenExpiredError) {
		res.status(401).json({
			refresh: true,
		});
		return;
	}
	if (err instanceof JsonWebTokenError) {
		res.status(401).json({
			toast: {
				type: 'error',
				message:
					'There was an issue when trying to verify your session. Please log in again.',
			},
		});
		return;
	}
	// The message property of the base Error is used instead of a name as a hacky
	// workaround for creating custom errors.
	if (err instanceof Error) {
		if (err.message === 'RefreshTokenExpiredError') {
			res
				.clearCookie('jwt', {
					httpOnly: true,
					sameSite: 'none',
					secure: true,
					path: '/auth',
				})
				.status(401)
				.json({
					expiredRefreshToken: true,
				});
			return;
		}
		if (
			err.message === 'MissingHeaderError' ||
			err.message === 'MissingBearerTokenError'
		) {
			res.status(401).json({
				toast: {
					type: 'error',
					message:
						'There was an issue when trying to verify your session. Please log in again',
				},
			});
			return;
		}
	}

	console.error(err);
	res.status(500).json({
		toast: {
			type: 'error',
			message: 'There was an unexpected server error. Please try again later.',
		},
	});
}

export default errorHandler;
