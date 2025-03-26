import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import prisma from '../../db/prisma';
import { getAccessToken } from '../common';
import type { Response } from 'supertest';

const accessToken = getAccessToken();
let postId: string;

afterAll(async () => {
	await prisma.post.delete({
		where: { id: postId },
	});
});

describe('POST /', () => {
	describe('when passed an empty content string', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.post('/posts/')
				.set('authorization', `Bearer ${accessToken}`)
				.send({ content: '' });
		});

		test('should return a 400 http status', () => {
			expect(response.statusCode).toBe(400);
		});

		test('should return an error in json', () => {
			expect(response.headers['content-type']).toContain('json');
			expect(response.body).toMatchObject({ error: 'Post content missing.' });
		});
	});

	describe("when passed a content string that's too long", () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.post('/posts/')
				.set('authorization', `Bearer ${accessToken}`)
				.send({ content: 'a'.repeat(501) });
		});

		test('should return a 400 http status', () => {
			expect(response.statusCode).toBe(400);
		});

		test('should return an error message in json', () => {
			expect(response.headers['content-type']).toContain('json');
			expect(response.body).toMatchObject({
				error: 'Post exceeds maximum character limit.',
			});
		});
	});

	describe('when passed a content string of a correct length', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.post('/posts/')
				.set('authorization', `Bearer ${accessToken}`)
				.send({ content: 'Hello, World!' });

			postId = response.body.id;
		});

		test('should return a 200 http status', () => {
			expect(response.statusCode).toBe(200);
		});

		test('should return the newly created post in json', () => {
			expect(response.headers['content-type']).toContain('json');
			expect(response.body).toBeDefined();
			// could test for the returned data format, but logging to the console
			// would be easier.
		});
	});
});
