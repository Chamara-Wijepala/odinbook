import usersRepository from '../repositories/usersRepository';
import likesRepository from '../repositories/likesRepository';

async function likePost(username: string, postId: string) {
	const user = await usersRepository.findByUsername(username);

	// type guard. user will always exist.
	if (!user) return { status: 404 };

	const like = await likesRepository.findLike(postId, user.id);

	if (like) {
		return {
			status: 409,
		};
	}

	await likesRepository.likePost(postId, user.id);

	return { status: 200 };
}

async function unlikePost(username: string, postId: string) {
	const user = await usersRepository.findByUsername(username);

	// type guard. user will always exist.
	if (!user) return { status: 404 };

	const like = await likesRepository.findLike(postId, user.id);

	if (!like) {
		return {
			status: 409,
		};
	}

	await likesRepository.unlikePost(postId, user.id);

	return { status: 204 };
}

export default {
	likePost,
	unlikePost,
};
