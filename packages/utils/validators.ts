import { CreateUserSchema } from '@odinbook/zod';
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
