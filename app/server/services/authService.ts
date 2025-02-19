import prisma from '../db/prisma';

async function createRefreshToken(token: string, userId: string) {
	return await prisma.refreshToken.create({
		data: {
			token,
			userId,
		},
	});
}

async function getRefreshToken(token: string) {
	return await prisma.refreshToken.findUnique({
		where: {
			token,
		},
		select: {
			token: true,
			revoked: true,
			User: {
				select: {
					id: true,
					username: true,
					following: true,
				},
			},
		},
	});
}

async function deleteRefreshToken(token: string) {
	return await prisma.refreshToken.delete({
		where: {
			token,
		},
	});
}

export default {
	createRefreshToken,
	getRefreshToken,
	deleteRefreshToken,
};
