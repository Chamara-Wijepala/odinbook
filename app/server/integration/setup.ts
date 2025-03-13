import prisma from '../db/prisma';
import { userData, hash, janeDoe, janesHash } from './common';

export async function setup() {
	console.log('Global setup: Initializing database...');

	await prisma.user.create({
		data: { ...janeDoe, password: janesHash },
	});
	const john = await prisma.user.create({
		data: { ...userData, password: hash },
		select: { id: true },
	});

	// can't use createMany because createdAt must be unique
	for (let i = 0; i < 6; i++) {
		await prisma.post.create({
			data: { content: `Post no. ${i + 1}`, authorId: john.id },
		});
	}
}

export async function teardown() {
	console.log('Global teardown: Cleaning up database...');

	await prisma.user.deleteMany({});
	await prisma.$disconnect();
}
