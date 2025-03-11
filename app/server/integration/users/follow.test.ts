import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { janeDoe, getAccessToken, getUserId } from '../common';
import type { Response } from 'supertest';

const accessToken = getAccessToken();
let userId: string | null = null;

beforeAll(async () => {
	userId = await getUserId(janeDoe.username);
});

describe('PATCH /:id/follow', () => {
	let response: Response;
	beforeAll(async () => {
		response = await request(app)
			.patch(`/users/${userId}/follow`)
			.set('authorization', `Bearer ${accessToken}`);
	});

	test('should return a 200 http status', () => {
		expect(response.statusCode).toBe(200);
	});
});

describe('PATCH /:id/unfollow', () => {
	let response: Response;
	beforeAll(async () => {
		response = await request(app)
			.patch(`/users/${userId}/unfollow`)
			.set('authorization', `Bearer ${accessToken}`);
	});

	test('should return a 200 http status', () => {
		expect(response.statusCode).toBe(200);
	});
});
