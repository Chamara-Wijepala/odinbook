import { vi, describe, expect, test, beforeAll } from 'vitest';
import type { Request, Response } from 'express';
import verifyJWT from '.';
import { issueAccessToken } from '../../utils/issueJWT';
import { userData, getUserId } from '../../integration/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const mockNext = vi.fn();
const mockRes = {} as Response;

const userId = await getUserId(userData.username);

describe('when passed no authorization header', () => {
	const mockReq = { headers: {} };

	test('should throw MissingHeaderError', async () => {
		await expect(
			verifyJWT(mockReq as Request, mockRes, mockNext)
		).rejects.toThrow('MissingHeaderError');
	});
});

describe('when passed a missing bearer token', () => {
	const mockReq = { headers: { authorization: 'Bearer ' } };

	test('should throw MissingBearerTokenError', async () => {
		await expect(
			verifyJWT(mockReq as Request, mockRes, mockNext)
		).rejects.toThrow('MissingBearerTokenError');
	});
});

describe('when passed an invalid jwt as bearer', () => {
	const mockReq = { headers: { authorization: 'Bearer invalid-token' } };

	test('should call next function with "jwt malformed" JsonWebTokenError', () => {
		verifyJWT(mockReq as Request, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalledWith(expect.any(JsonWebTokenError));
		expect(mockNext).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'jwt malformed' })
		);
	});
});

describe('when passed a valid token', () => {
	describe('if the token is expired', () => {
		test('should call next function with "jwt expired" TokenExpiredError', () => {
			const token = issueAccessToken('id', 'username', 1, -10);
			const mockReq = { headers: { authorization: `Bearer ${token}` } };

			verifyJWT(mockReq as Request, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(mockNext).toHaveBeenCalledWith(expect.any(TokenExpiredError));
			expect(mockNext).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'jwt expired' })
			);
		});
	});

	describe('if the token is not expired', () => {
		const token = issueAccessToken(userId!, userData.username, 1, 60);
		const mockReq = { headers: { authorization: `Bearer ${token}` } };

		beforeAll(async () => {
			await verifyJWT(mockReq as Request, mockRes, mockNext);
		});

		test('should add decoded payload to req.user', () => {
			expect(mockReq).toMatchObject({
				user: {
					id: userId,
					username: userData.username,
					tokenVersion: 1,
					iat: expect.any(Number),
					exp: expect.any(Number),
				},
				headers: { authorization: `Bearer ${token}` },
			});
		});

		test('should call next function', () => {
			expect(mockNext).toHaveBeenCalled();
		});
	});
});
