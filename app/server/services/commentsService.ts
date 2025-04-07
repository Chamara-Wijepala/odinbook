import commentsRepository from '../repositories/commentsRepository';
import { CommentType } from '@odinbook/types';

async function create(
	content: string,
	postId: string,
	authorId: string,
	commentId: string | undefined
) {
	const id = commentId ? Number(commentId) : null;
	return await commentsRepository.create(content, postId, authorId, id);
}

async function getComments(postId: string, cursor: string, commentId: string) {
	const c = cursor === 'undefined' ? undefined : Number(cursor);
	const replyToId = commentId === 'undefined' ? undefined : Number(commentId);
	const comments: CommentType[] = await commentsRepository.getComments(
		postId,
		c,
		replyToId
	);

	let nextCursor: number | null;
	if (comments.length < 5) {
		nextCursor = null;
	} else {
		nextCursor = comments[comments.length - 1].id;
	}

	return { nextCursor, comments };
}

async function getSingleThread(postId: string, commentId: string) {
	const thread = await commentsRepository.getSingleThread(
		postId,
		Number(commentId)
	);

	return { nextCursor: null, comments: thread };
}

async function update(
	userId: string,
	postId: string,
	commentId: string,
	content: string
) {
	const comment = await commentsRepository.findAuthorByCommentId(
		Number(commentId)
	);

	// user is trying to update a deleted comment
	if (!comment) {
		return {
			status: 404,
			error: {
				toast: {
					type: 'error',
					message: "The comment you are trying to update doesn't exist.",
				},
			},
			data: null,
		};
	}

	// user is trying to update a comment by a another user or a deleted user
	if (!comment.author || comment.author.id !== userId) {
		return {
			status: 403,
			error: {
				toast: {
					type: 'error',
					message: 'You do not have permission to edit this post.',
				},
			},
			data: null,
		};
	}

	const updatedComment = await commentsRepository.update(
		postId,
		Number(commentId),
		content
	);

	return { status: 200, error: null, data: updatedComment };
}

async function deleteComment(commentId: number, currentUserId: string) {
	const comment = await commentsRepository.findAuthorByCommentId(commentId);

	if (!comment) {
		return { status: 204, error: null, data: null };
	}

	// user is trying to delete a comment by a another user or a deleted user
	if (!comment.author || comment.author.id !== currentUserId) {
		return {
			status: 403,
			error: {
				toast: {
					type: 'error',
					message: 'You do not have permission to delete this post.',
				},
			},
			data: null,
		};
	}

	const data = await commentsRepository.deleteComment(commentId);

	// cannot send data with a 204
	return { status: 200, error: null, data };
}

async function like(commentId: number, userId: string) {
	const isLiked = await commentsRepository.findLike(commentId, userId);

	if (isLiked) {
		await commentsRepository.unlike(commentId, userId);
		return 204;
	} else {
		await commentsRepository.like(commentId, userId);
		return 200;
	}
}

export default {
	create,
	getComments,
	getSingleThread,
	update,
	deleteComment,
	like,
};
