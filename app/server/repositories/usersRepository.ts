import prisma from '../db/prisma';

async function create(
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

async function findByUsername(username: string) {
	return await prisma.user.findUnique({ where: { username } });
}

async function getLoginData(username: string) {
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

async function getProfileData(username: string) {
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
			avatar: { select: { id: true, url: true } },
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

async function followUser(currentUserId: string, userId: string) {
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

async function unfollowUser(currentUserId: string, userId: string) {
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

// avatars
async function createAvatar(id: string, url: string, userId: string) {
	return await prisma.avatar.create({
		data: { id, url, userId },
		select: { id: true, url: true },
	});
}

async function findAvatar(userId: string) {
	return await prisma.avatar.findUnique({
		where: { userId },
	});
}

async function updateAvatar(id: string, url: string) {
	return await prisma.avatar.update({
		where: { id },
		data: { url },
		select: { id: true, url: true },
	});
}

async function deleteAvatar(id: string, userId: string) {
	return await prisma.avatar.delete({
		where: { id, userId },
	});
}

export default {
	create,
	findByUsername,
	getLoginData,
	getProfileData,
	updateTokenVersion,
	followUser,
	unfollowUser,
	createAvatar,
	findAvatar,
	updateAvatar,
	deleteAvatar,
};
