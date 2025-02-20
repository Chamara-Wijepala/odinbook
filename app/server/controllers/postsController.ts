import postsService from '../services/postsService';
import usersService from '../services/usersService';
import likesService from '../services/likesService';
import type { Request, Response } from 'express';

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

	const userId = await usersService.getUserId(req.user.username);

	// Type guard. The only way user might not exist is if user is deleted on one
	// device while authenticated on another device. This is an edge case, which
	// is better handled in the verifyJWT middleware than here if needed.
	if (!userId) return;

	const post = await postsService.createPost(req.body.content, userId);

	res.status(200).json({
		newPost: {
			id: post.id,
			content: req.body.content,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
			likedBy: post.likedBy.map((like) => like.userId),
		},
	});
}

async function likePost(req: Request, res: Response) {
	const postId = req.params.id;

	const userId = await usersService.getUserId(req.user.username);

	if (!userId) return;

	const isLiked = await likesService.isPostLiked(postId, userId);

	if (isLiked) {
		res.sendStatus(409);
		return;
	}

	await likesService.likePost(postId, userId);

	res.sendStatus(200);
}

async function getPost(req: Request, res: Response) {
	const post = await postsService.getPostPage(req.params.id);

	if (!post) {
		res.status(404).json({
			toast: {
				type: 'error',
				message: "We couldn't find the post you're looking for.",
			},
		});
		return;
	}

	const result = {
		...post,
		likedBy: post.likedBy.map((like) => like.userId),
	};

	res.status(200).json(result);
}

async function getPosts(req: Request, res: Response) {
	const { page, userId } = req.query;
	let posts;

	if (userId) {
		posts = await postsService.getUserPosts(userId as string);

		const results = posts?.map((post) => {
			return {
				...post,
				likedBy: post.likedBy.map((like) => like.userId),
			};
		});

		res.status(200).json(results);
		return;
	}

	switch (page) {
		case 'home':
			posts = await postsService.getHomePage(req.user.username);
			break;
		case 'explore':
			posts = await postsService.getExplorePage();
			break;
	}

	const results = posts?.map((post) => {
		return {
			...post,
			likedBy: post.likedBy.map((like) => like.userId),
		};
	});

	res.status(200).json(results);
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

	const author = await postsService.getPostAuthor(postId);

	if (!author) {
		res.status(404).json({
			toast: { type: 'error', message: "Couldn't find the post to update." },
		});
		return;
	}
	if (author.username !== req.user.username) {
		res.status(403).json({
			toast: {
				type: 'error',
				message: 'You do not have permission to edit this post.',
			},
		});
		return;
	}

	await postsService.updatePost(postId, content);

	res
		.status(200)
		.json({ toast: { type: 'success', message: 'Post updated!' } });
}

async function deletePost(req: Request, res: Response) {
	const postId = req.params.id;

	const author = await postsService.getPostAuthor(postId);

	if (!author) {
		res.status(404).json({
			toast: {
				type: 'error',
				message:
					"Couldn't find post to delete. It might have already been deleted.",
			},
		});
		return;
	}

	if (author.username !== req.user.username) {
		res.status(403).json({
			toast: {
				type: 'error',
				message: 'You do not have permission to delete this post.',
			},
		});
		return;
	}

	await postsService.deletePost(postId);

	res.sendStatus(204);
}

async function unlikePost(req: Request, res: Response) {
	const postId = req.params.id;

	const userId = await usersService.getUserId(req.user.username);

	if (!userId) return;

	const isLiked = await likesService.isPostLiked(postId, userId);

	if (!isLiked) {
		res.sendStatus(409);
		return;
	}

	await likesService.unlikePost(postId, userId);

	res.sendStatus(204);
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
