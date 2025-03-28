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

export default {
	create,
};
