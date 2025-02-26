import prisma from '../db/prisma';

async function createUser(
	firstName: string,
	lastName: string,
	username: string,
	hash: string
) {
	return await prisma.user.create({
		data: {
			firstName: firstName,
			lastName: lastName,
			username: username,
			password: hash,
		},
	});
}

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

async function getUserAuthDetails(username: string) {
	return await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			username: true,
			password: true,
			tokenVersion: true,
			following: {
				select: {
					id: true,
				},
			},
		},
	});
}

async function updateTokenVersion(username: string) {
	return await prisma.user.update({
		where: {
			username,
		},
		data: {
			tokenVersion: {
				increment: 1,
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
	createUser,
	getUserId,
	getUserProfile,
	getUserAuthDetails,
	updateTokenVersion,
	followUser,
	unfollowUser,
};
