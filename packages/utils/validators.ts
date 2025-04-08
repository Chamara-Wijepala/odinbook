import { CreateUserSchema, PostSchema, CommentSchema } from '@odinbook/zod';
import type { CreateUser } from '@odinbook/zod';
import type { CreateUserErrors } from '@odinbook/types';

type CreateUserResult =
	| { success: true; errors: null; data: CreateUser }
	| { success: false; errors: CreateUserErrors; data: null };

// both validatePost and validateComment have the same return type
type UserContentResult =
	| { success: true; error: null; data: string }
	| { success: false; error: string; data: null };

export function validateCreateUser(body: CreateUser): CreateUserResult {
	const validation = CreateUserSchema.safeParse(body);

	if (!validation.success) {
		let errors: CreateUserErrors = {};
		validation.error.issues.forEach((issue) => {
			// issue.path will always be an array with a single element in this case
			const name = issue.path[0] as keyof CreateUserErrors;
			if (!errors[name]) errors[name] = [];
			errors[name] = [...errors[name], issue.message];
		});
		return { success: false, errors, data: null };
	}

	return { success: true, errors: null, data: validation.data };
}

export function validatePost(content: string): UserContentResult {
	const validation = PostSchema.safeParse(content);

	if (!validation.success) {
		// There will only be one error at a time
		return {
			success: false,
			error: validation.error.issues[0].message,
			data: null,
		};
	}

	return { success: true, error: null, data: validation.data };
}

export function validateComment(content: string): UserContentResult {
	const validation = CommentSchema.safeParse(content);

	if (!validation.success) {
		// There will only be one error at a time
		return {
			success: false,
			error: validation.error.issues[0].message,
			data: null,
		};
	}

	return { success: true, error: null, data: validation.data };
}
