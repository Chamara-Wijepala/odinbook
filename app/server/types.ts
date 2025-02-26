export interface UserToken {
	username: string;
	tokenVersion?: number;
	iat: number;
	exp: number;
}
