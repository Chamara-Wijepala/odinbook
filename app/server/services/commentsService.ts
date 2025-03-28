import commentsRepository from '../repositories/commentsRepository';
import { CommentType } from '@odinbook/types';

async function create(content: string, postId: string, authorId: string) {
	return await commentsRepository.create(content, postId, authorId);
}

async function getComments(postId: string) {
	const comments: CommentType[] = await commentsRepository.getComments(postId);

	return { comments };
}

export default {
	create,
	getComments,
};
