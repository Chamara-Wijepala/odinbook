import prisma from '../db/prisma';

async function getUserId(username: string) {
	return await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
		},
	});
}

async function getUserProfile(username: string) {
	return await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			username: true,
			createdAt: true,
			_count: {
				select: {
					posts: true,
					followedBy: true,
					following: true,
				},
			},
		},
	});
}

async function followUser(userId: string, currentUserId: string) {
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			followedBy: {
				connect: { id: currentUserId },
			},
		},
	});
}

async function unfollowUser(userId: string, currentUserId: string) {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			followedBy: {
				disconnect: { id: currentUserId },
			},
		},
	});
}

export default {
	getUserId,
	getUserProfile,
	followUser,
	unfollowUser,
};
