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

export default {
	create,
};
