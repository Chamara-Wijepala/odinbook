import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import prisma from '../../db/prisma';
import { userData, getAccessToken, getCookieWithRefreshToken } from '../common';

const localUser = {
	firstName: 'logout',
	lastName: 'tester',
	username: 'logout-tester',
	password: 'helloworld',
};
let accessToken: string;

beforeAll(async () => {
	const user = await prisma.user.create({ data: localUser });
	accessToken = getAccessToken(user.id, user.username);
});

afterAll(async () => {
	await prisma.user.deleteMany({ where: { username: localUser.username } });
});

describe('POST /logout', () => {
	describe('when no cookie is passed', () => {
		test('should return a 200 http status', async () => {
			const response = await request(app).post('/auth/logout');

			expect(response.statusCode).toBe(200);
		});
	});

	describe('when a valid cookie is passed', () => {
		test('should return a 200 https status', async () => {
			const response = await request(app)
				.post('/auth/logout')
				.set('Cookie', [getCookieWithRefreshToken(userData.username)]);

			expect(response.statusCode).toBe(200);
		});

		test('should clear the cookie', async () => {
			const response = await request(app)
				.post('/auth/logout')
				.set('Cookie', [getCookieWithRefreshToken(userData.username)]);

			expect(response.headers['set-cookie'][0]).toContain('jwt=;');
		});
	});
});

describe('POST /logout-all', () => {
	describe('when no cookie is passed', () => {
		test('should return a 200 http status', async () => {
			const response = await request(app)
				.post('/auth/logout-all')
				.set('authorization', `Bearer ${accessToken}`);

			expect(response.statusCode).toBe(200);
		});
	});

	describe('when a valid cookie is passed', () => {
		// must be first because the other tests will update the token version
		test('should update the token version', async () => {
			await request(app)
				.post('/auth/logout-all')
				.set('Cookie', [getCookieWithRefreshToken(userData.username)])
				.set('authorization', `Bearer ${accessToken}`);

			const user = await prisma.user.findUnique({
				where: { username: localUser.username },
				select: { tokenVersion: true },
			});

			expect(user).toBeDefined();
			expect(user?.tokenVersion).toBe(2);
		});

		test('should return a 200 https status', async () => {
			const response = await request(app)
				.post('/auth/logout-all')
				.set('Cookie', [getCookieWithRefreshToken(userData.username)])
				.set('authorization', `Bearer ${accessToken}`);

			expect(response.statusCode).toBe(200);
		});

		test('should clear the cookie', async () => {
			const response = await request(app)
				.post('/auth/logout-all')
				.set('Cookie', [getCookieWithRefreshToken(userData.username)])
				.set('authorization', `Bearer ${accessToken}`);

			expect(response.headers['set-cookie'][0]).toContain('jwt=;');
		});
	});
});
