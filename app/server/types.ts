export interface UserToken {
	id?: string;
	username: string;
	tokenVersion?: number;
	iat: number;
	exp: number;
}
