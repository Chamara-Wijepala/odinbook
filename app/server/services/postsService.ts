import usersRepository from '../repositories/usersRepository';
import postsRepository from '../repositories/postsRepository';

async function create(username: string, content: string) {
	const currentUser = await usersRepository.findByUsername(username);

	// Type guard. The only way user might not exist is if user is deleted on one
	// device while authenticated on another device. This is an edge case, which
	// is better handled in the verifyJWT middleware than here if needed.
	if (!currentUser) {
		return {
			status: 404,
			data: null,
		};
	}

	const post = await postsRepository.create(content, currentUser.id);

	const newPost = {
		...post,
		likedBy: post.likedBy.map((like) => like.userId),
	};

	return {
		status: 200,
		data: newPost,
	};
}

async function getPosts(
	username: string,
	userId: string | undefined,
	page: string | undefined,
	cursor: string
) {
	let posts;

	if (userId) {
		posts = await postsRepository.getUserPosts(userId, cursor);
	}

	if (page) {
		switch (page) {
			case 'home':
				posts = await postsRepository.getHomePage(username, cursor);
				break;
			case 'explore':
				posts = await postsRepository.getExplorePage(cursor);
				break;
			default:
				break;
		}
	}

	if (!posts) return { status: 400, data: null };

	const results = posts?.map((post) => {
		return {
			...post,
			likedBy: post.likedBy.map((like) => like.userId),
		};
	});

	let nextCursor: Date | null;
	if (posts.length < 5) {
		nextCursor = null;
	} else {
		nextCursor = posts[posts.length - 1].createdAt;
	}

	return {
		status: 200,
		data: {
			nextCursor,
			posts: results,
		},
	};
}

async function getPostPage(id: string) {
	const post = await postsRepository.getPostPage(id);

	if (!post) {
		return {
			status: 404,
			error: {
				toast: {
					type: 'error,',
					message: "We couldn't find the post you're looking for.",
				},
			},
			data: null,
		};
	}

	const data = {
		...post,
		likedBy: post.likedBy.map((like) => like.userId),
	};

	return {
		status: 200,
		error: null,
		data,
	};
}

async function update(username: string, postId: string, content: string) {
	const post = await postsRepository.findAuthorByPostId(postId);

	if (!post) {
		return {
			status: 404,
			error: {
				toast: { type: 'error', message: "Couldn't find the post to update." },
			},
			data: null,
		};
	}
	if (post.author.username !== username) {
		return {
			status: 403,
			error: {
				toast: {
					type: 'error',
					message: 'You do not have permission to edit this post.',
				},
			},
			data: null,
		};
	}

	await postsRepository.update(postId, content);

	return {
		status: 200,
		error: null,
		data: { toast: { type: 'success', message: 'Post updated!' } },
	};
}

async function deletePost(username: string, postId: string) {
	const post = await postsRepository.findAuthorByPostId(postId);

	if (!post) {
		return {
			status: 404,
			error: {
				toast: {
					type: 'error',
					message:
						"Couldn't find post to delete. It might have already been deleted.",
				},
			},
		};
	}
	if (post.author.username !== username) {
		return {
			status: 403,
			error: {
				toast: {
					type: 'error',
					message: 'You do not have permission to delete this post.',
				},
			},
		};
	}

	await postsRepository.deletePost(postId);

	return { status: 204, error: null };
}

export default {
	create,
	getPosts,
	getPostPage,
	update,
	deletePost,
};
