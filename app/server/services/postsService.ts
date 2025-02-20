import prisma from '../db/prisma';

async function createPost(content: string, authorId: string) {
	return await prisma.post.create({
		data: {
			content,
			authorId,
		},
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			likedBy: {
				select: {
					userId: true,
				},
			},
		},
	});
}

async function getPostAuthor(postId: string) {
	const post = await prisma.post.findUnique({
		where: {
			id: postId,
		},
		select: {
			author: {
				select: {
					username: true,
				},
			},
		},
	});

	if (!post) return null;

	return post.author;
}

async function getHomePage(username: string) {
	return await prisma.post.findMany({
		where: {
			author: {
				followedBy: {
					some: {
						username,
					},
				},
			},
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			likedBy: {
				select: {
					userId: true,
				},
			},
			author: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
}

async function getExplorePage() {
	return await prisma.post.findMany({
		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			likedBy: {
				select: {
					userId: true,
				},
			},
			author: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
}

async function getPostPage(id: string) {
	return await prisma.post.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			likedBy: {
				select: {
					userId: true,
				},
			},
			author: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
	});
}

async function getUserPosts(authorId: string) {
	return await prisma.post.findMany({
		where: {
			authorId,
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			updatedAt: true,
			likedBy: {
				select: {
					userId: true,
				},
			},
			author: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					username: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
}

async function updatePost(postId: string, content: string) {
	return await prisma.post.update({
		where: {
			id: postId,
		},
		data: {
			content,
		},
	});
}

async function deletePost(postId: string) {
	await prisma.post.delete({
		where: {
			id: postId,
		},
	});
}

export default {
	createPost,
	getPostAuthor,
	getHomePage,
	getExplorePage,
	getPostPage,
	getUserPosts,
	updatePost,
	deletePost,
};
