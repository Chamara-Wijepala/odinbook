import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { issueRefreshToken } from '../utils/issueJWT';

export const userData = {
	firstName: 'John',
	lastName: 'Doe',
	username: 'JohnDoe1990',
	password: 'helloworld',
};

export const hash = bcrypt.hashSync(userData.password, 10);

export const jwtRegex =
	/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;

export function getCookieWithRefreshToken(
	username: string,
	version: number = 1,
	expire: boolean = false
) {
	const expiresIn = expire ? -10 : 60;
	const refreshToken = issueRefreshToken(username, version, expiresIn);

	return cookie.serialize('jwt', refreshToken, {
		httpOnly: true,
		maxAge: 1000,
		sameSite: 'none',
		secure: true,
		path: '/auth',
	});
}

export function getCookieWithoutRefreshToken() {
	return cookie.serialize('foo', 'bar');
}
