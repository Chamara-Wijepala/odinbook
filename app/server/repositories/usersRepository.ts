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

export default {
	create,
	findByUsername,
	getLoginData,
	getProfileData,
	updateTokenVersion,
	followUser,
	unfollowUser,
};
