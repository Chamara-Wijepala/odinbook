import prisma from '../db/prisma';

async function findLike(postId: string, userId: string) {
	return await prisma.postLike.findUnique({
		where: {
			postId_userId: { postId, userId },
		},
	});
}

async function likePost(postId: string, userId: string) {
	return await prisma.postLike.create({
		data: { postId, userId },
	});
}

async function unlikePost(postId: string, userId: string) {
	return await prisma.postLike.delete({
		where: {
			postId_userId: { postId, userId },
		},
	});
}

export default {
	findLike,
	likePost,
	unlikePost,
};
