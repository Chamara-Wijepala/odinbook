import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { userData, janeDoe, getAccessToken, getUserId } from '../common';
import type { Response } from 'supertest';

let johnsId: string | null = null;
let janesId: string | null = null;
let accessToken: string;

beforeAll(async () => {
	johnsId = await getUserId(userData.username);
	janesId = await getUserId(janeDoe.username);

	accessToken = getAccessToken(johnsId!, userData.username);
});

describe('PATCH /:id/follow', () => {
	let response: Response;
	beforeAll(async () => {
		response = await request(app)
			.patch(`/users/${janesId}/follow`)
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
			.patch(`/users/${janesId}/unfollow`)
			.set('authorization', `Bearer ${accessToken}`);
	});

	test('should return a 200 http status', () => {
		expect(response.statusCode).toBe(200);
	});
});
