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
		};
	}

	await commentsRepository.update(postId, Number(commentId), content);

	return { status: 200, error: null };
}

async function deleteComment(commentId: number, currentUserId: string) {
	const comment = await commentsRepository.findAuthorByCommentId(commentId);

	if (!comment) {
		return { status: 204, error: null };
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
		};
	}

	await commentsRepository.deleteComment(commentId);

	return { status: 204, error: null };
}

export default {
	create,
	getComments,
	getSingleThread,
	update,
	deleteComment,
};
