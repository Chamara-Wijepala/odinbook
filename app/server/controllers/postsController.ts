import type { Request, Response } from 'express';
import prisma from '../db/prisma';

async function createPost(req: Request, res: Response) {
	const { content } = req.body;

	if (!content || content.length < 1) {
		res.status(400).json({ error: 'Post content missing.' });
		return;
	}
	if (content.length > 500) {
		res.status(400).json({ error: 'Post exceeds maximum character limit.' });
		return;
	}

	const user = await prisma.user.findUnique({
		where: {
			username: req.user.username,
		},
		select: {
			id: true,
		},
	});

	// Type guard. The only way user might not exist is if user is deleted on one
	// device while authenticated on another device. This is an edge case, which
	// is better handled in the verifyJWT middleware than here if needed.
	if (!user) return;

	await prisma.post.create({
		data: {
			content: req.body.content,
			authorId: user.id,
		},
	});

	res.sendStatus(200);
}

export default {
	createPost,
};
