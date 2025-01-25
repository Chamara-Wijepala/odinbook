import { DecodedToken } from './types';

declare global {
	namespace Express {
		export interface Request {
			user?: DecodedToken;
		}
	}
}

export {};
