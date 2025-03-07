import {
	describe,
	test,
	expect,
	expectTypeOf,
	beforeEach,
	afterEach,
} from 'vitest';
import request from 'supertest';
import app from '../../app';
import prisma from '../../db/prisma';
import type { CreateUserErrors } from '@odinbook/types';
import type { CreateUser } from '@odinbook/zod';

describe('when passed invalid data', () => {
	const invalidTestCases = [
		{
			name: 'empty object',
			payload: {},
		},
		{
			name: 'missing password',
			payload: { email: 'test@example.com' },
		},
		{
			name: 'invalid email format',
			payload: { email: 'not-an-email', password: 'password123' },
		},
		// Add more test cases as needed. But writing extensive tests would be
		// equivalent to writing unit tests, which shouldn't be done here.
	];

	test.each(invalidTestCases)(
		'should handle $name correctly',
		async ({ payload }) => {
			const response = await request(app).post('/auth/register').send(payload);

			expect(response.statusCode).toBe(400);
			expectTypeOf(response.body.errors).toExtend<CreateUserErrors>();
		}
	);
});

describe('when passed valid data', () => {
	const userData: CreateUser = {
		firstName: 'Jane',
		lastName: 'Doe',
		username: 'JaneDoe1990',
		password: 'helloworld',
		confirmPassword: 'helloworld',
	};

	beforeEach(async () => {
		await prisma.user.deleteMany({
			where: { username: userData.username },
		});
	});

	afterEach(async () => {
		await prisma.user.deleteMany({
			where: { username: userData.username },
		});
	});

	test('should return 200 http status for first-time registration', async () => {
		const response = await request(app).post('/auth/register').send(userData);
		expect(response.statusCode).toBe(200);
	});

	test('should return 409 http status and errors when username already exists', async () => {
		await request(app).post('/auth/register').send(userData);
		const response = await request(app).post('/auth/register').send(userData);

		expect(response.statusCode).toBe(409);
		expectTypeOf(response.body.errors).toExtend<CreateUserErrors>();
	});
});
