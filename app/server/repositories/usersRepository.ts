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

export default {
	create,
	findByUsername,
	getLoginData,
	updateTokenVersion,
};
