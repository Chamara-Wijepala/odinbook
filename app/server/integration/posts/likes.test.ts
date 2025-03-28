import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { userData, getUserId, getAccessToken, getFirstPostId } from '../common';
import type { Response } from 'supertest';

let postId: string | null;
let token: string;

beforeAll(async () => {
	const id = await getUserId(userData.username);

	token = getAccessToken(id!, userData.username);
	postId = await getFirstPostId();
});

describe('POST /:id/like', () => {
	describe('when a user likes a post', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.post(`/posts/${postId}/like`)
				.set('authorization', `Bearer ${token}`);
		});

		test('should return a 200 http status', () => {
			expect(response.statusCode).toBe(200);
		});
	});

	describe('when a user likes a post they have already liked', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.post(`/posts/${postId}/like`)
				.set('authorization', `Bearer ${token}`);
		});

		test('should return a 409 http status', () => {
			expect(response.statusCode).toBe(409);
		});
	});
});

describe('DELETE /:id/like', () => {
	describe('when a user unlikes a post', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.delete(`/posts/${postId}/like`)
				.set('authorization', `Bearer ${token}`);
		});

		test('should return a 204 http status', () => {
			expect(response.statusCode).toBe(204);
		});
	});

	describe("when a user unlikes a post they haven't liked", () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.delete(`/posts/${postId}/like`)
				.set('authorization', `Bearer ${token}`);
		});

		test('should return a 409 http status', () => {
			expect(response.statusCode).toBe(409);
		});
	});
});
