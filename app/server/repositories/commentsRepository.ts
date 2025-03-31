import prisma from '../db/prisma';

async function create(content: string, postId: string, authorId: string) {
	return await prisma.comment.create({
		data: { content, postId, authorId },
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
	});
}

async function findAuthorByCommentId(commentId: number) {
	return await prisma.comment.findUnique({
		where: { id: commentId },
		select: { author: true },
	});
}

async function getComments(postId: string) {
	return await prisma.comment.findMany({
		where: { postId, replyToId: null },
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
	});
}

async function update(postId: string, commentId: number, content: string) {
	return await prisma.comment.update({
		where: { postId, id: commentId },
		data: { content },
	});
}

async function deleteComment(id: number) {
	return await prisma.comment.delete({
		where: { id },
	});
}

export default {
	create,
	findAuthorByCommentId,
	getComments,
	update,
	deleteComment,
};
