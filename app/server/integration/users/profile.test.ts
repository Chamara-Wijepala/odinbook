import { describe, test, expect, expectTypeOf, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { userData, getUserId, getAccessToken } from '../common';
import type { Response } from 'supertest';

let accessToken: string;

beforeAll(async () => {
	const id = await getUserId(userData.username);
	accessToken = getAccessToken(id!, userData.username);
});

describe('GET /:username', () => {
	describe('when passed an invalid username parameter', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.get('/users/invalid-username')
				.set('authorization', `Bearer ${accessToken}`);
		});

		test('should return a 404 http status', () => {
			expect(response.statusCode).toBe(404);
		});

		test('should return a toast error', () => {
			expect(response.body.toast).toBeDefined();
			expectTypeOf(response.body.toast).toExtend<{
				type: string;
				message: string;
			}>();
		});
	});

	describe('when passed a valid username parameter', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.get(`/users/${userData.username}`)
				.set('authorization', `Bearer ${accessToken}`);
		});

		test('should return a 200 http status', async () => {
			expect(response.statusCode).toBe(200);
		});

		test('should return a request body', () => {
			expect(response.body).toBeDefined();
		});

		test.skip('should return a user object in request body', () => {
			/*
      Testing this would require creating a schema or verifier specifically for
      this endpoint's return value. That might be too much work for a test that
      can be simply tested by logging the request body to the console.
      */
		});
	});
});
