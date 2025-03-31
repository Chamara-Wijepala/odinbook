import { validateComment } from '@odinbook/utils';
import commentsService from '../services/commentsService';
import type { Request, Response, NextFunction } from 'express';

async function create(req: Request, res: Response, next: NextFunction) {
	const validation = validateComment(req.body.content);

	if (!validation.success) {
		res.status(400).json(validation.error);
		return;
	}

	try {
		const comment = await commentsService.create(
			req.body.content,
			req.params.postId,
			req.user.id
		);
		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
}

async function getComments(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await commentsService.getComments(req.params.postId);

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
		const { status, error } = await commentsService.update(
			req.user.id,
			postId,
			commentId,
			content
		);

		if (error) {
			res.status(status).json(error.toast);
			return;
		}

		res.sendStatus(status);
	} catch (error) {
		next(error);
	}
}

export default {
	create,
	getComments,
	update,
};
