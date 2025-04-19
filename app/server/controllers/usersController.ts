import usersService from '../services/usersService';
import { Request, Response, NextFunction } from 'express';

async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
	const { file } = req;

	if (!file) {
		res.status(400).json({
			type: 'error',
			message: 'There was an error while uploading the image',
		});
		return;
	}

	try {
		const data = await usersService.uploadAvatar(req.user.id, file);

		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
}

async function getUserProfile(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await usersService.getUserProfile(req.params.username);

		if (!data) {
			res.sendStatus(404);
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

async function deleteAvatar(req: Request, res: Response, next: NextFunction) {
	try {
		const status = await usersService.deleteAvatar(
			req.query.avatarId as string,
			req.user.id
		);

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

export default {
	uploadAvatar,
	getUserProfile,
	followUser,
	unfollowUser,
	deleteAvatar,
};
