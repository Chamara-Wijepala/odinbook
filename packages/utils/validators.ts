import { CreateUserSchema, PostSchema, CommentSchema } from '@odinbook/zod';
import type { CreateUser } from '@odinbook/zod';
import type { CreateUserErrors } from '@odinbook/types';

export function validateCreateUser(body: CreateUser) {
	const validation = CreateUserSchema.safeParse(body);

	if (!validation.success) {
		let errors: CreateUserErrors = {};
		validation.error.issues.forEach((issue) => {
			// issue.path will always be an array with a single element in this case
			const name = issue.path[0] as keyof CreateUserErrors;
			if (!errors[name]) errors[name] = [];
			errors[name] = [...errors[name], issue.message];
		});
		return { success: false, errors };
	}

	return { success: true, errors: null };
}

export function validatePost(content: string) {
	const validation = PostSchema.safeParse(content);

	if (!validation.success) {
		// There will only be one error at a time
		return { success: false, error: validation.error.issues[0].message };
	}

	return { success: true, error: null };
}

export function validateComment(content: string) {
	const validation = CommentSchema.safeParse(content);

	if (!validation.success) {
		// There will only be one error at a time
		return { success: false, error: validation.error.issues[0].message };
	}

	return { success: true, error: null };
}
