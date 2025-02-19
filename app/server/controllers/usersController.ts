import usersService from '../services/usersService';
import { Request, Response } from 'express';

async function getUserProfile(req: Request, res: Response) {
	const user = await usersService.getUserProfile(req.params.username);

	if (!user) {
		res.status(404).json({
			toast: {
				type: 'error',
				message: "Couldn't find the user you're looking for.",
			},
		});
		return;
	}

	res.status(200).json(user);
}

async function followUser(req: Request, res: Response) {
	const currentUser = await usersService.getUserId(req.user.username);

	// Only case where currentUser might not exist is if user is deleted from the
	// database while they're is already logged in with a valid access token.
	if (!currentUser) return;

	// If user tries to follow themselves. No real need to handle because the
	// button will be disabled on the client.
	if (currentUser.id === req.params.id) return;

	await usersService.followUser(req.params.id, currentUser.id);

	res.sendStatus(200);
}

async function unfollowUser(req: Request, res: Response) {
	const currentUser = await usersService.getUserId(req.user.username);

	// Only case where currentUser might not exist is if user is deleted from the
	// database while they're is already logged in with a valid access token.
	if (!currentUser) return;

	// If user tries to unfollow themselves. No real need to handle because the
	// button will be disabled on the client.
	if (currentUser.id === req.params.id) return;

	await usersService.unfollowUser(req.params.id, currentUser.id);

	res.sendStatus(200);
}

export default {
	getUserProfile,
	followUser,
	unfollowUser,
};
