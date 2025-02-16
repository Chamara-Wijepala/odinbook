import { Request, Response } from 'express';
import prisma from '../db/prisma';

async function followUser(req: Request, res: Response) {
	const currentUser = await prisma.user.findUnique({
		where: {
			username: req.user.username,
		},
		select: {
			id: true,
		},
	});

	// Only case where currentUser might not exist is if user is deleted from the
	// database while they're is already logged in with a valid access token.
	if (!currentUser) return;

	// If user tries to follow themselves. No real need to handle because the
	// button will be disabled on the client.
	if (currentUser.id === req.params.id) return;

	await prisma.user.update({
		where: {
			id: req.params.id,
		},
		data: {
			followedBy: {
				connect: { id: currentUser.id },
			},
		},
	});

	res.sendStatus(200);
}

async function unfollowUser(req: Request, res: Response) {
	const currentUser = await prisma.user.findUnique({
		where: {
			username: req.user.username,
		},
		select: {
			id: true,
		},
	});

	// Only case where currentUser might not exist is if user is deleted from the
	// database while they're is already logged in with a valid access token.
	if (!currentUser) return;

	// If user tries to unfollow themselves. No real need to handle because the
	// button will be disabled on the client.
	if (currentUser.id === req.params.id) return;

	await prisma.user.update({
		where: {
			id: req.params.id,
		},
		data: {
			followedBy: {
				disconnect: { id: currentUser.id },
			},
		},
	});

	res.sendStatus(200);
}

export default {
	followUser,
	unfollowUser,
};
