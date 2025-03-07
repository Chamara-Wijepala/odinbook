import { describe, test, expect, expectTypeOf, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { userData, jwtRegex } from '../common';
import type { Response } from 'supertest';

describe('when passed invalid login details', () => {
	test('should return 404 and error when passed invalid username', async () => {
		const response = await request(app)
			.post('/auth/login')
			.send({ username: 'foo' });

		expect(response.statusCode).toBe(404);
		expectTypeOf(response.body).toExtend<{
			username: string;
			password: string;
		}>();
	});

	test('should return 401 and error when passed invalid password', async () => {
		const response = await request(app)
			.post('/auth/login')
			.send({ username: userData.username, password: 'foo' });

		expect(response.statusCode).toBe(401);
		expectTypeOf(response.body).toExtend<{
			username: string;
			password: string;
		}>();
	});
});

describe('when passed valid login details', () => {
	let response: Response;

	beforeEach(async () => {
		response = await request(app)
			.post('/auth/login')
			.send({ username: userData.username, password: userData.password });
	});

	test('should return 200 http status', () => {
		expect(response.statusCode).toBe(200);
	});

	test('should return an http-only cookie', () => {
		expect(response.headers['set-cookie'][0]).toMatch('HttpOnly');
	});

	test('should return jwt with the http-only cookie', () => {
		const jwt = response.headers['set-cookie'][0]
			.split(';')[0]
			.replace('jwt=', '');

		expect(jwt).toMatch(jwtRegex);
	});

	test('should return a jwt access token', () => {
		expect(response.body.accessToken).toMatch(jwtRegex);
	});

	test('should return user details', () => {
		expectTypeOf(response.body.user).toExtend<{
			id: string;
			firstName: string;
			lastName: string;
			username: string;
			following: string[];
		}>();
	});
});
