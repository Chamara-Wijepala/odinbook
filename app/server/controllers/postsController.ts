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
			firstName: true,
			lastName: true,
		},
	});

	// Type guard. The only way user might not exist is if user is deleted on one
	// device while authenticated on another device. This is an edge case, which
	// is better handled in the verifyJWT middleware than here if needed.
	if (!user) return;

	const post = await prisma.post.create({
		data: {
			content: req.body.content,
			authorId: user.id,
		},
		select: {
			id: true,
		},
	});

	res.status(200).json({
		newPost: {
			id: post.id,
			content: req.body.content,
			author: {
				firstName: user.firstName,
				lastName: user.lastName,
				username: req.user.username,
			},
		},
	});
}

async function updatePost(req: Request, res: Response) {
	const { postId, content } = req.body;

	if (!postId || !content) {
		res.send(400).json({
			toast: { type: 'error', message: 'The post id or content is missing.' },
		});
		return;
	}
	if (content.length > 500) {
		res.status(400).json({ error: 'Post exceeds maximum character limit.' });
		return;
	}

	// get post along with author's username
	const post = await prisma.post.findUnique({
		where: {
			id: postId,
		},
		select: {
			author: {
				select: {
					username: true,
				},
			},
		},
	});

	if (!post) {
		res.status(404).json({
			toast: { type: 'error', message: "Couldn't find the post to update." },
		});
		return;
	}
	if (post.author.username !== req.user.username) {
		res.status(403).json({
			toast: {
				type: 'error',
				message: 'You do not have permission to edit this post.',
			},
		});
		return;
	}

	await prisma.post.update({
		where: {
			id: postId,
		},
		data: {
			content,
		},
	});

	res
		.status(200)
		.json({ toast: { type: 'success', message: 'Post updated!' } });
}

async function deletePost(req: Request, res: Response) {
	const postId = req.params.id;

	const post = await prisma.post.findUnique({
		where: {
			id: postId,
		},
		select: {
			author: {
				select: {
					username: true,
				},
			},
		},
	});

	if (!post) {
		res.status(404).json({
			toast: {
				type: 'error',
				message:
					"Couldn't find post to delete. It might have already been deleted.",
			},
		});
		return;
	}

	if (post.author.username !== req.user.username) {
		res.status(403).json({
			toast: {
				type: 'error',
				message: 'You do not have permission to delete this post.',
			},
		});
		return;
	}

	await prisma.post.delete({
		where: {
			id: postId,
		},
	});

	res.sendStatus(204);
}

async function getExplorePage(req: Request, res: Response) {
	const posts = await prisma.post.findMany({
		select: {
			id: true,
			content: true,
			author: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.status(200).json(posts);
}

async function getHomePage(req: Request, res: Response) {
	const posts = await prisma.post.findMany({
		where: {
			author: {
				followedBy: {
					some: {
						username: req.user.username,
					},
				},
			},
		},
		select: {
			id: true,
			content: true,
			author: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.status(200).json(posts);
}

export default {
	createPost,
	updatePost,
	deletePost,
	getExplorePage,
	getHomePage,
};
