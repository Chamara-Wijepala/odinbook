import { z } from 'zod';

export const CreateUserSchema = z
	.object({
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters long.')
			.max(20, 'First name must be at most 20 characters long.'),
		lastName: z
			.string()
			.min(2, 'Last name must be at least 2 characters long.')
			.max(20, 'Last name must be at most 20 characters long.'),
		username: z
			.string()
			.min(5, 'Username must be at least 5 characters long.')
			.max(20, 'Username must be at most 20 characters long.'),
		password: z.string().min(8, 'Password must contain at least 8 characters.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
export type CreateUser = z.infer<typeof CreateUserSchema>;
