import commentsRepository from '../repositories/commentsRepository';

async function create(content: string, postId: string, authorId: string) {
	return await commentsRepository.create(content, postId, authorId);
}

export default {
	create,
};
