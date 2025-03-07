import prisma from '../db/prisma';
import { userData, hash } from './common';

export async function setup() {
	console.log('Global setup: Initializing database...');

	await prisma.user.create({
		data: { ...userData, password: hash },
	});
}

export async function teardown() {
	console.log('Global teardown: Cleaning up database...');

	await prisma.user.deleteMany({});
	await prisma.$disconnect();
}
