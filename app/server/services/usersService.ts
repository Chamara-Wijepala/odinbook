import usersRepository from '../repositories/usersRepository';

async function getUserProfile(username: string) {
	const data = await usersRepository.getProfileData(username);

	if (!data) {
		return {
			status: 404,
			error: {
				toast: {
					type: 'error',
					message: "Couldn't find the user you're looking for.",
				},
			},
			data: null,
		};
	}

	return {
		status: 200,
		error: null,
		data,
	};
}

async function followUser(currentUserId: string, id: string) {
	// If user tries to follow themself.
	if (currentUserId === id) return { status: 400 };

	await usersRepository.followUser(currentUserId, id);

	return { status: 200 };
}

async function unfollowUser(currentUserId: string, id: string) {
	// If user tries to unfollow themself.
	if (currentUserId === id) return { status: 400 };

	await usersRepository.unfollowUser(currentUserId, id);

	return { status: 200 };
}

export default {
	getUserProfile,
	followUser,
	unfollowUser,
};
