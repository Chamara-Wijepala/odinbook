import { validateComment } from '@odinbook/utils';
import commentsService from '../services/commentsService';
import type { Request, Response, NextFunction } from 'express';

async function create(req: Request, res: Response, next: NextFunction) {
	const commentId: string | undefined = req.params.commentId;

	const validation = validateComment(req.body.content);

	if (!validation.success) {
		res.status(400).json(validation.error);
		return;
	}

	try {
		const comment = await commentsService.create(
			req.body.content,
			req.params.postId,
			req.user.id,
			commentId
		);
		res.status(200).json({ comment });
	} catch (error) {
		next(error);
	}
}

async function getComments(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await commentsService.getComments(
			req.params.postId,
			req.query.cursor as string,
			req.params.commentId as string
		);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
}

async function getSingleThread(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const result = await commentsService.getSingleThread(
			req.params.postId,
			req.params.commentId
		);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
}

async function update(req: Request, res: Response, next: NextFunction) {
	const { postId, commentId } = req.params;
	const { content } = req.body;

	const validation = validateComment(content);

	if (!validation.success) {
		res.status(400).json(validation.error);
		return;
	}

	try {
		const { status, error, data } = await commentsService.update(
			req.user.id,
			postId,
			commentId,
			content
		);

		if (error) {
			res.status(status).json(error);
			return;
		}

		res.status(status).json({ comment: data });
	} catch (error) {
		next(error);
	}
}

async function deleteComment(req: Request, res: Response, next: NextFunction) {
	try {
		const { status, error, data } = await commentsService.deleteComment(
			Number(req.params.commentId as string),
			req.user.id
		);

		if (error) {
			res.status(status).json(error);
			return;
		}

		res.status(status).json({ comment: data });
	} catch (error) {
		next(error);
	}
}

export default {
	create,
	getComments,
	getSingleThread,
	update,
	deleteComment,
};
