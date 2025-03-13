import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import {
	getAccessToken,
	userData,
	janeDoe,
	getUserId,
	getFirstPostId,
} from '../common';
import type { Response } from 'supertest';

const johnsToken = getAccessToken();
const janesToken = getAccessToken(janeDoe.username);
let johnsId: string;
let janesId: string;

// utils
async function getPosts(query: string, token: string) {
	return request(app)
		.get(`/posts/?${query}`)
		.set('authorization', `Bearer ${token}`);
}

async function expectJsonBody(response: Response) {
	expect(response.headers['content-type']).toContain('json');
	expect(response.body).toBeDefined();
}

async function expectNullCursor(response: Response) {
	expect(response.body.nextCursor).toBeNull();
}

async function expectDateAsCursor(response: Response) {
	const cursorDate = new Date(response.body.nextCursor);
	const now = new Date();

	expect(cursorDate instanceof Date).toBeTruthy();
	expect(cursorDate.getFullYear()).toBe(now.getFullYear());
	expect(cursorDate.getMonth()).toBe(now.getMonth());
	expect(cursorDate.getDate()).toBe(now.getDate());
}

async function expectEmptyArray(response: Response) {
	expect(response.body.posts).toHaveLength(0);
}

async function expectArrayOfLength(response: Response, length: number) {
	expect(response.body.posts).toHaveLength(length);
}

// setup and teardown
beforeAll(async () => {
	johnsId = (await getUserId(userData.username)) as string;
	janesId = (await getUserId(janeDoe.username)) as string;

	// follow John Doe as Jane Doe
	await request(app)
		.patch(`/users/${johnsId}/follow`)
		.set('authorization', `Bearer ${janesToken}`);
});

afterAll(async () => {
	// unfollow John Doe as Jane Doe
	await request(app)
		.patch(`/users/${johnsId}/unfollow`)
		.set('authorization', `Bearer ${janesToken}`);
});

describe('GET /', () => {
	describe('common feed', () => {
		// only the explore feed is tested here, but all feeds are handled the same
		// way in the backend, so these tests should work the same for all of them.
		describe('when getting paginated posts', () => {
			let firstResponse: Response;
			beforeAll(async () => {
				firstResponse = await getPosts(`page=explore&cursor=`, johnsToken);
			});

			describe('when getting first 5 paginated posts', () => {
				test('should return a 200 http status', () => {
					expect(firstResponse.statusCode).toBe(200);
				});

				test('should return a response.body as json', () => {
					expectJsonBody(firstResponse);
				});

				test('should return a date as the next cursor', () => {
					expectDateAsCursor(firstResponse);
				});

				test('should return an array with a length of 5', () => {
					expectArrayOfLength(firstResponse, 5);
				});
			});

			describe('when getting the remaining post', () => {
				let secondResponse: Response;
				beforeAll(async () => {
					secondResponse = await getPosts(
						`page=explore&cursor=${firstResponse.body.nextCursor}`,
						johnsToken
					);
				});

				test('should return a 200 http status', () => {
					expect(firstResponse.statusCode).toBe(200);
				});

				test('should return a response.body as json', () => {
					expectJsonBody(secondResponse);
				});

				test('should return null as the next cursor', () => {
					expectNullCursor(secondResponse);
				});

				test('should return an array with a length of 1', () => {
					expectArrayOfLength(secondResponse, 1);
				});
			});
		});
	});

	describe('home feed', () => {
		describe("when getting home feed of a user who doesn't follow anyone", () => {
			let response: Response;
			beforeAll(async () => {
				response = await getPosts('page=home&cursor=', johnsToken);
			});

			test('should return a 200 http status', () => {
				expect(response.statusCode).toBe(200);
			});

			test('should return a response.body as json', () => {
				expectJsonBody(response);
			});

			test('should return null as the next cursor', () => {
				expectNullCursor(response);
			});

			test('should return an empty array as posts', () => {
				expectEmptyArray(response);
			});
		});

		describe("when getting home feed of a user who's following another user", () => {
			let response: Response;
			beforeAll(async () => {
				response = await getPosts('page=home&cursor=', janesToken);
			});

			test('should return a 200 http status', () => {
				expect(response.statusCode).toBe(200);
			});

			test('should return a response.body as json', () => {
				expectJsonBody(response);
			});

			test('should return a date as the next cursor', () => {
				expectDateAsCursor(response);
			});

			test('should return an array with a length of 5', () => {
				expectArrayOfLength(response, 5);
			});
		});
	});

	describe('profile feed', () => {
		describe('when getting posts from a user without any posts', () => {
			let response: Response;
			beforeAll(async () => {
				response = await getPosts(`userId=${janesId}&cursor=`, johnsToken);
			});

			test('should return a 200 http status', () => {
				expect(response.statusCode).toBe(200);
			});

			test('should return a response.body as json', () => {
				expectJsonBody(response);
			});

			test('should return null as the next cursor', () => {
				expectNullCursor(response);
			});

			test('should return an empty array as posts', () => {
				expectEmptyArray(response);
			});
		});
	});
});

describe('GET /:id', () => {
	describe('when passed an invalid id', () => {
		let response: Response;
		beforeAll(async () => {
			response = await request(app)
				.get('/posts/invalid-id')
				.set('authorization', `Bearer ${johnsToken}`);
		});

		test('should return a 404 http status', () => {
			expect(response.statusCode).toBe(404);
		});

		test('should return a response.body as json', () => {
			expectJsonBody(response);
		});

		test('should return a toast message', () => {
			expect(response.body.toast).toMatchObject({
				type: expect.any(String),
				message: expect.any(String),
			});
		});
	});

	describe('when passed a valid id', () => {
		let response: Response;
		beforeAll(async () => {
			const postId = await getFirstPostId();

			response = await request(app)
				.get(`/posts/${postId}`)
				.set('authorization', `Bearer ${johnsToken}`);
		});

		test('should return a 200 http status', () => {
			expect(response.statusCode).toBe(200);
		});

		test('should return a response.body as json', () => {
			expectJsonBody(response);
		});
	});
});
