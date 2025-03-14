import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { janeDoe, getAccessToken, getFirstPostId } from '../common';
import type { Response } from 'supertest';

const johnsToken = getAccessToken();
const janesToken = getAccessToken(janeDoe.username);
let postId: string | null;

function expectToastMessage(response: Response) {
	expect(response.body.toast).toBeDefined();
	expect(response.body.toast).toMatchObject({
		type: expect.any(String),
		message: expect.any(String),
	});
}

beforeAll(async () => {
	postId = await getFirstPostId();
});

describe('when passed an invalid post id', () => {
	let response: Response;
	beforeAll(async () => {
		response = await request(app)
			.delete('/posts/invalid-post-id')
			.set('authorization', `Bearer ${johnsToken}`);
	});

	test('should return a 404 http status', () => {
		expect(response.statusCode).toBe(404);
	});

	test('should return a toast message', () => {
		expectToastMessage(response);
	});
});

describe("when trying to delete another user's post", () => {
	let response: Response;
	beforeAll(async () => {
		response = await request(app)
			.delete(`/posts/${postId}`)
			.set('authorization', `Bearer ${janesToken}`);
	});

	test('should return a 403 http status', () => {
		expect(response.statusCode).toBe(403);
	});

	test('should return a toast message', () => {
		expectToastMessage(response);
	});
});

describe('when a user deletes their own post', () => {
	let response: Response;
	beforeAll(async () => {
		response = await request(app)
			.delete(`/posts/${postId}`)
			.set('authorization', `Bearer ${johnsToken}`);
	});

	test('should return a 204 http status', () => {
		expect(response.statusCode).toBe(204);
	});
});
