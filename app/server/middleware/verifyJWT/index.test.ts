import { vi, describe, expect, test } from 'vitest';
import type { Request, Response } from 'express';
import verifyJWT from '.';
import { issueAccessToken } from '../../utils/issueJWT';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const mockNext = vi.fn();
const mockRes = {} as Response;

describe('when passed no authorization header', () => {
	const mockReq = { headers: {} };

	test('should throw MissingHeaderError', () => {
		expect(() => verifyJWT(mockReq as Request, mockRes, mockNext)).toThrow(
			'MissingHeaderError'
		);
	});
});

describe('when passed a missing bearer token', () => {
	const mockReq = { headers: { authorization: 'Bearer ' } };

	test('should throw MissingBearerTokenError', () => {
		expect(() => verifyJWT(mockReq as Request, mockRes, mockNext)).toThrow(
			'MissingBearerTokenError'
		);
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
			const token = issueAccessToken('username', -10);
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
		const token = issueAccessToken('username', 60);
		const mockReq = { headers: { authorization: `Bearer ${token}` } };

		verifyJWT(mockReq as Request, mockRes, mockNext);

		test('should add decoded payload to req.user', () => {
			expect(mockReq).toMatchObject({ user: { username: 'username' } });
		});

		test('should call next function', () => {
			expect(mockNext).toHaveBeenCalled();
		});
	});
});
