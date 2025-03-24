import prisma from '../db/prisma';
import usersRepository from '../repositories/usersRepository';

async function getUserId(username: string) {
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
		},
	});

	if (!user) return null;

	return user.id;
}

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

async function followUser(username: string, id: string) {
	const currentUser = await usersRepository.findByUsername(username);

	// Type guard. User will always exist.
	if (!currentUser) return { status: 404 };

	// If user tries to follow themself.
	if (currentUser.id === id) return { status: 400 };

	await usersRepository.followUser(currentUser.id, id);

	return { status: 200 };
}

async function unfollowUser(username: string, id: string) {
	const currentUser = await usersRepository.findByUsername(username);

	// Type guard. User will always exist.
	if (!currentUser) return { status: 404 };

	// If user tries to unfollow themself.
	if (currentUser.id === id) return { status: 400 };

	await usersRepository.unfollowUser(currentUser.id, id);

	return { status: 200 };
}

export default {
	getUserId,
	getUserProfile,
	followUser,
	unfollowUser,
};
