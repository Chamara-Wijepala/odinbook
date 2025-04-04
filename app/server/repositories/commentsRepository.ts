import prisma from '../db/prisma';

async function create(
	content: string,
	postId: string,
	authorId: string,
	replyToId: number | null
) {
	return await prisma.comment.create({
		data: { content, postId, authorId, replyToId },
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

async function getComments(
	postId: string,
	cursor: number | undefined,
	replyToId: number | undefined
) {
	return await prisma.comment.findMany({
		where: { postId, replyToId },
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			replyToId: true,
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
		take: 5,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
	});
}

async function getSingleThread(postId: string, commentId: number) {
	return await prisma.comment.findUnique({
		where: { postId, id: commentId },
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			replyToId: true,
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
			replies: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					content: true,
					replyToId: true,
					author: {
						select: {
							firstName: true,
							lastName: true,
							username: true,
						},
					},
				},
				take: 5,
				skip: 0,
				cursor: undefined,
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
	return await prisma.comment.update({
		where: { id },
		data: {
			content: null,
			authorId: null,
		},
	});
}

export default {
	create,
	findAuthorByCommentId,
	getComments,
	getSingleThread,
	update,
	deleteComment,
};
