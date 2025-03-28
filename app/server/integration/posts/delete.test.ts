import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import prisma from '../../db/prisma';
import { userData, janeDoe, getAccessToken, getUserId } from '../common';
import type { Response } from 'supertest';

let johnsToken: string;
let janesToken: string;
let postId: string | null;

function expectToastMessage(response: Response) {
	expect(response.body.toast).toBeDefined();
	expect(response.body.toast).toMatchObject({
		type: expect.any(String),
		message: expect.any(String),
	});
}

beforeAll(async () => {
	const johnsId = await getUserId(userData.username);
	const janesId = await getUserId(janeDoe.username);

	johnsToken = getAccessToken(johnsId!, userData.username);
	janesToken = getAccessToken(janesId!, janeDoe.username);

	const post = await prisma.post.create({
		data: {
			content: 'Post to be deleted',
			authorId: johnsId!,
		},
		select: {
			id: true,
		},
	});

	postId = post.id;
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
