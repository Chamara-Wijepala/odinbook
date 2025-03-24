import postsService from '../services/postsService';
import likesService from '../services/likesService';
import type { NextFunction, Request, Response } from 'express';

async function createPost(req: Request, res: Response, next: NextFunction) {
	const { content } = req.body;

	if (!content || content.length < 1) {
		res.status(400).json({ error: 'Post content missing.' });
		return;
	}
	if (content.length > 500) {
		res.status(400).json({ error: 'Post exceeds maximum character limit.' });
		return;
	}

	try {
		const { status, data } = await postsService.create(
			req.user.username,
			content
		);

		if (!data) {
			res.sendStatus(status);
			return;
		}

		res.status(status).json(data);
	} catch (error) {
		next(error);
	}
}

async function likePost(req: Request, res: Response, next: NextFunction) {
	try {
		const { status } = await likesService.likePost(
			req.user.username,
			req.params.id
		);

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

async function getPost(req: Request, res: Response, next: NextFunction) {
	try {
		const { status, error, data } = await postsService.getPostPage(
			req.params.id
		);

		if (error) {
			res.status(status).json(error);
			return;
		}

		res.status(status).json(data);
	} catch (error) {
		next(error);
	}
}

async function getPosts(req: Request, res: Response, next: NextFunction) {
	const { page, userId, cursor } = req.query;

	try {
		const { status, data } = await postsService.getPosts(
			req.user.username,
			userId as string | undefined,
			page as string | undefined,
			cursor as string
		);

		if (!data) {
			res.sendStatus(status);
			return;
		}

		res.status(status).json(data);
	} catch (error) {
		next(error);
	}
}

async function updatePost(req: Request, res: Response, next: NextFunction) {
	const { content } = req.body;

	if (content.length < 1) {
		res.status(400).json({ error: 'Post is empty.' });
		return;
	}
	if (content.length > 500) {
		res.status(400).json({ error: 'Post exceeds maximum character limit.' });
		return;
	}

	try {
		const { status, error, data } = await postsService.update(
			req.user.username,
			req.params.id,
			content
		);

		if (error) {
			res.status(status).json(error);
			return;
		}

		res.status(status).json(data);
	} catch (error) {
		next(error);
	}
}

async function deletePost(req: Request, res: Response, next: NextFunction) {
	try {
		const { status, error } = await postsService.deletePost(
			req.user.username,
			req.params.id
		);

		if (error) {
			res.status(status).json(error);
			return;
		}

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

async function unlikePost(req: Request, res: Response, next: NextFunction) {
	try {
		const { status } = await likesService.unlikePost(
			req.user.username,
			req.params.id
		);

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

export default {
	createPost,
	likePost,
	getPost,
	getPosts,
	updatePost,
	deletePost,
	unlikePost,
};
