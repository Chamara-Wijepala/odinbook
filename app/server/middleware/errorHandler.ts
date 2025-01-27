import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof TokenExpiredError) {
		res.status(401).json({
			type: 'warn',
			message: 'Your session has expired. Please log in again.',
		});
		return;
	}
	if (err instanceof JsonWebTokenError) {
		res.status(401).json({
			type: 'error',
			message:
				'There was an issue when trying to verify your session. Please log in again.',
		});
		return;
	}

	next(err);
}

export default errorHandler;
