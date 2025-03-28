import usersService from '../services/usersService';
import { Request, Response, NextFunction } from 'express';

async function getUserProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const { status, error, data } = await usersService.getUserProfile(
			req.params.username
		);

		if (error) {
			res.status(status).json(error);
			return;
		}

		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
}

async function followUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { status } = await usersService.followUser(
			req.user.id,
			req.params.id
		);

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

async function unfollowUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { status } = await usersService.unfollowUser(
			req.user.id,
			req.params.id
		);

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

export default {
	getUserProfile,
	followUser,
	unfollowUser,
};
