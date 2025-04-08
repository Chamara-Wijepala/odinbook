import { z } from 'zod';

function escapeHTML(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export const CreateUserSchema = z
	.object({
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters long.')
			.max(20, 'First name must be at most 20 characters long.')
			.transform((val) => escapeHTML(val)),

		lastName: z
			.string()
			.min(2, 'Last name must be at least 2 characters long.')
			.max(20, 'Last name must be at most 20 characters long.')
			.transform((val) => escapeHTML(val)),

		username: z
			.string()
			.min(5, 'Username must be at least 5 characters long.')
			.max(20, 'Username must be at most 20 characters long.')
			.regex(
				/^[a-zA-Z0-9][a-zA-Z0-9-._]+[a-zA-Z0-9]$/,
				'Username can only contain letters, numbers, dots, hyphens and underscores. It must start and end with a letter or number.'
			)
			.refine(
				(username) =>
					!username.includes('..') &&
					!username.includes('--') &&
					!username.includes('__'),
				'Username cannot contain consecutive dots, hyphens, or underscores.'
			)
			.transform((val) => escapeHTML(val)),

		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long.')
			.transform((val) => escapeHTML(val)),

		confirmPassword: z
			.string()
			.min(8, 'Confirm password must be at least 8 characters long.')
			.transform((val) => escapeHTML(val)),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const PostSchema = z
	.string()
	.trim()
	.min(1, 'Post content missing.')
	.max(500, 'Post exceeds maximum character limit.')
	.transform((val) => escapeHTML(val));

export const CommentSchema = z
	.string()
	.trim()
	.min(1, 'Comment content missing.')
	.max(250, 'Comment exceeds maximum character limit.')
	.transform((val) => escapeHTML(val));
