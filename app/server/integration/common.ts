import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { issueAccessToken, issueRefreshToken } from '../utils/issueJWT';
import prisma from '../db/prisma';

export const userData = {
	firstName: 'John',
	lastName: 'Doe',
	username: 'JohnDoe1990',
	password: 'helloworld',
};

export const hash = bcrypt.hashSync(userData.password, 10);

export const janeDoe = {
	firstName: 'Jane',
	lastName: 'Doe',
	username: 'JaneDoe2000',
	password: 'helloworld',
};

export const janesHash = bcrypt.hashSync(janeDoe.password, 10);

export const jwtRegex =
	/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;

export function getAccessToken(id: string, username: string) {
	return issueAccessToken(id, username, '5m');
}

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

export async function getUserId(username: string) {
	const user = await prisma.user.findUnique({
		where: { username },
		select: { id: true },
	});

	if (!user) return null;

	return user.id;
}

export async function getFirstPostId() {
	const post = await prisma.post.findFirst({ select: { id: true } });

	if (!post) return null;

	return post.id;
}
