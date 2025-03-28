import likesRepository from '../repositories/likesRepository';

async function likePost(userId: string, username: string, postId: string) {
	const like = await likesRepository.findLike(postId, userId);

	if (like) {
		return {
			status: 409,
		};
	}

	await likesRepository.likePost(postId, userId);

	return { status: 200 };
}

async function unlikePost(userId: string, username: string, postId: string) {
	const like = await likesRepository.findLike(postId, userId);

	if (!like) {
		return {
			status: 409,
		};
	}

	await likesRepository.unlikePost(postId, userId);

	return { status: 204 };
}

export default {
	likePost,
	unlikePost,
};
