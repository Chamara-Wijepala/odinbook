import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { janeDoe, getAccessToken, getFirstPostId } from '../common';
import type { Response } from 'supertest';

const johnsToken = getAccessToken();
const janesToken = getAccessToken(janeDoe.username);
let postId: string | null;

async function updatePost(
	query: string,
	payload?: { content: string },
	token: string = johnsToken
) {
	return await request(app)
		.patch(query)
		.set('authorization', `Bearer ${token}`)
		.send(payload);
}

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

describe.each([
	{ name: 'empty content', payload: { content: '' } },
	{ name: 'content too long', payload: { content: 'a'.repeat(501) } },
])('should handle $name correctly', async ({ payload }) => {
	const response = await updatePost(`/posts/${postId}`, payload);

	test('should return a 400 http status', () => {
		expect(response.statusCode).toBe(400);
	});

	test('should return an error message', () => {
		expect(response.body).toBeDefined();
		expect(response.body.error).toBeTypeOf('string');
	});
});

describe('when passed an invalid post id', () => {
	let response: Response;
	beforeAll(async () => {
		response = await updatePost('/posts/invalid-post-id', {
			content: 'Hello, World!',
		});
	});

	test('should return a 404 http status', () => {
		expect(response.statusCode).toBe(404);
	});

	test('should return a toast message', () => {
		expectToastMessage(response);
	});
});

describe("when trying to update another user's post", () => {
	let response: Response;
	beforeAll(async () => {
		response = await updatePost(
			`/posts/${postId}`,
			{ content: 'Goodbye, World!' },
			janesToken
		);
	});

	test('should return a 403 http status', () => {
		expect(response.statusCode).toBe(403);
	});

	test('should return a toast message', () => {
		expectToastMessage(response);
	});
});

describe('when a user updates their own post', () => {
	let response: Response;
	beforeAll(async () => {
		response = await updatePost(`/posts/${postId}`, {
			content: 'Goodbye, World!',
		});
	});

	test('should return a 200 http status', () => {
		expect(response.statusCode).toBe(200);
	});

	test('should return a toast message', () => {
		expectToastMessage(response);
	});
});
