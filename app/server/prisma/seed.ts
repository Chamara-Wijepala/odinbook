import bcrypt from 'bcryptjs';
import prisma from '../db/prisma';

async function main() {
	const hash = await bcrypt.hash('helloworld', 10);
	const user = await prisma.user.create({
		data: {
			firstName: 'John',
			lastName: 'Doe',
			username: 'johnDoe1',
			password: hash,
		},
	});

	const post = await prisma.post.create({
		data: {
			content: 'Hello, World!',
			authorId: user.id,
		},
	});

	const comment = await prisma.comment.create({
		data: {
			content: 'Comment on Hello, World!',
			postId: post.id,
			authorId: user.id,
			replyToId: null,
		},
	});

	let commentId = comment.id;
	for (let i = 1; i < 10; i++) {
		const reply = await prisma.comment.create({
			data: {
				content: `Reply ${i}`,
				postId: post.id,
				authorId: user.id,
				replyToId: commentId,
			},
		});
		commentId = reply.id;
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
