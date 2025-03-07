import { describe, test, expect, expectTypeOf, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import {
	userData,
	jwtRegex,
	getCookieWithRefreshToken,
	getCookieWithoutRefreshToken,
} from '../common';
import type { Response } from 'supertest';

describe('when passed an invalid cookie', () => {
	const invalidTestCases = [
		{
			name: 'a missing cookie',
			cookie: '',
		},
		{
			name: 'a cookie without a jwt',
			cookie: getCookieWithoutRefreshToken(),
		},
		{
			name: 'a cookie with an expired jwt',
			cookie: getCookieWithRefreshToken(userData.username, 1, true),
		},
		{
			name: 'a cookie with an old jwt version',
			cookie: getCookieWithRefreshToken(userData.username, 2),
		},
	];

	test.each(invalidTestCases)(
		'should handle $name correctly',
		async ({ cookie }) => {
			const response = await request(app)
				.post('/auth/refresh')
				.set('Cookie', [cookie]);

			expect(response.statusCode).toBe(401);
			expectTypeOf(response.body.toast).toExtend<{
				type: string;
				message: string;
			}>();
		}
	);
});

describe('when a cookie with a valid token is passed', () => {
	let response: Response;

	beforeEach(async () => {
		response = await request(app)
			.get('/auth/refresh')
			.set('Cookie', [getCookieWithRefreshToken(userData.username)]);
	});

	test('should return 200 http status', () => {
		expect(response.statusCode).toBe(200);
	});

	test('should return a new jwt access token', () => {
		expect(response.body.newToken).toMatch(jwtRegex);
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
