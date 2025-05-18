import bcrypt from 'bcryptjs';
import prisma from '../db/prisma';

async function main() {
	const user = await prisma.user.findUnique({
		where: { username: 'JohnDoe1' },
	});

	if (user) return;

	const hash = await bcrypt.hash('helloworld', 10);
	await prisma.user.create({
		data: {
			firstName: 'John',
			lastName: 'Doe',
			username: 'JohnDoe1',
			password: hash,
		},
	});
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
