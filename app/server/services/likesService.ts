import prisma from '../db/prisma';

async function isPostLiked(postId: string, userId: string) {
	const alreadyLiked = await prisma.postLike.findUnique({
		where: {
			postId_userId: { postId, userId },
		},
	});

	return alreadyLiked ? true : false;
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
	likePost,
	isPostLiked,
	unlikePost,
};
