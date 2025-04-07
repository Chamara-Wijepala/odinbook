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
			replyToId: true,
			_count: {
				select: { replies: true },
			},
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
			likes: {
				select: { userId: true },
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
			_count: {
				select: { replies: true },
			},
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
			likes: {
				select: { userId: true },
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
			_count: {
				select: { replies: true },
			},
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
			likes: {
				select: { userId: true },
			},
			replies: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					content: true,
					replyToId: true,
					_count: {
						select: { replies: true },
					},
					author: {
						select: {
							firstName: true,
							lastName: true,
							username: true,
						},
					},
					likes: {
						select: { userId: true },
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
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			replyToId: true,
			_count: {
				select: { replies: true },
			},
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
			likes: {
				select: { userId: true },
			},
		},
	});
}

async function deleteComment(id: number) {
	return await prisma.comment.update({
		where: { id },
		data: {
			content: null,
			authorId: null,
		},
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			replyToId: true,
			_count: {
				select: { replies: true },
			},
			author: {
				select: {
					firstName: true,
					lastName: true,
					username: true,
				},
			},
			likes: {
				select: { userId: true },
			},
		},
	});
}

// likes
async function like(commentId: number, userId: string) {
	return await prisma.commentLike.create({
		data: { commentId, userId },
	});
}

async function findLike(commentId: number, userId: string) {
	return await prisma.commentLike.findUnique({
		where: { commentId_userId: { commentId, userId } },
	});
}

async function unlike(commentId: number, userId: string) {
	return await prisma.commentLike.delete({
		where: { commentId_userId: { commentId, userId } },
	});
}

export default {
	create,
	findAuthorByCommentId,
	getComments,
	getSingleThread,
	update,
	deleteComment,
	like,
	findLike,
	unlike,
};
