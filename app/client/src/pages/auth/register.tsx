import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import useAuthStore from '../../stores/auth';
import useTheme from '../../hooks/useTheme';
import { validateCreateUser } from '@odinbook/utils';
import api from '../../api';
import { AxiosError } from 'axios'; // importing as type doesn't allow using it as a value
import type { CreateUserErrors } from '@odinbook/types';

export default function Register() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		username: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<CreateUserErrors | null>(null);
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const validation = validateCreateUser(formData);

		if (!validation.success) {
			setErrors(validation.errors);
			return;
		}

		setErrors(null);

		try {
			await api.post('/auth/register', formData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const response = await api.post(
				'/auth/login',
				{
					username: formData.username,
					password: formData.password,
				},
				{ headers: { 'Content-Type': 'application/json' } }
			);

			setToken(response.data.accessToken);
			navigate('/');
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrors(error.response?.data.errors);
			}
		}
	}

	return (
		<div className="min-h-[100svh] p-4 flex flex-col gap-4 justify-center items-center relative bg-gradient-to-br from-sky-400 to-pink-400 dark:from-sky-800 dark:to-pink-800">
			<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg max-w-xl p-8 md:p-12 flex-grow-0">
				<h2 className="text-xl md:text-3xl font-bold">Register</h2>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 md:gap-6  my-4 md:my-6"
				>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex flex-col">
							<label
								htmlFor="first-name"
								className="text-slate-500 dark:text-slate-300"
							>
								First name:
							</label>
							<input
								type="text"
								name="firstName"
								id="first-name"
								value={formData.firstName}
								required
								onChange={handleChange}
								className="py-2 px-4 border-[1px] border-slate-200 rounded-lg w-full bg-transparent"
							/>
							<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
								{errors?.firstName?.map((error, index) => (
									<li key={`firstName-${index}`}>{error}</li>
								))}
							</ul>
						</div>

						<div className="flex flex-col">
							<label
								htmlFor="last-name"
								className="text-slate-500 dark:text-slate-300"
							>
								Last name:
							</label>
							<input
								type="text"
								name="lastName"
								id="last-name"
								value={formData.lastName}
								required
								onChange={handleChange}
								className="py-2 px-4 border-[1px] border-slate-200 rounded-lg w-full bg-transparent"
							/>
							<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
								{errors?.lastName?.map((error, index) => (
									<li key={`lastName-${index}`}>{error}</li>
								))}
							</ul>
						</div>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="username"
							className="text-slate-500 dark:text-slate-300"
						>
							Username:
						</label>
						<input
							type="text"
							name="username"
							id="username"
							value={formData.username}
							required
							onChange={handleChange}
							className="py-2 px-4 border-[1px] border-slate-200 rounded-lg bg-transparent"
						/>
						<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
							{!errors?.username && (
								<>
									<li className="text-slate-500 dark:text-slate-300">
										Must be at least 5 characters.
									</li>
									<li className="text-slate-500 dark:text-slate-300">
										Can contain only letters, numbers, dots, hyphens and
										underscores.
									</li>
									<li className="text-slate-500 dark:text-slate-300">
										Must start and end with a letter or number.
									</li>
								</>
							)}
							{errors?.username?.map((error, index) => (
								<li key={`username-${index}`}>{error}</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="password"
							className="text-slate-500 dark:text-slate-300"
						>
							Password:
						</label>
						<input
							type="password"
							name="password"
							id="password"
							value={formData.password}
							required
							onChange={handleChange}
							className="py-2 px-4 border-[1px] border-slate-200 rounded-lg bg-transparent"
						/>
						<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
							{!errors?.password && (
								<li className="text-slate-500 dark:text-slate-300">
									Must be at least 8 characters
								</li>
							)}
							{errors?.password?.map((error, index) => (
								<li key={`password-${index}`}>{error}</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="confirm-password"
							className="text-slate-500 dark:text-slate-300"
						>
							Confirm password:
						</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirm-password"
							value={formData.confirmPassword}
							required
							onChange={handleChange}
							className="py-2 px-4 border-[1px] border-slate-200 rounded-lg bg-transparent"
						/>
						<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
							{errors?.confirmPassword?.map((error, index) => (
								<li key={`confirmPassword-${index}`}>{error}</li>
							))}
						</ul>
					</div>

					<button
						type="submit"
						className="bg-sky-400 hover:bg-sky-300 transition-colors duration-250 p-2 md:p-4 rounded-lg"
					>
						Submit
					</button>
				</form>

				<p className="text-center">
					Already have an account?{' '}
					<Link
						to="/login"
						className="text-sky-600 hover:text-sky-400 transition-colors duration-250"
					>
						Login
					</Link>
				</p>
			</div>

			<button
				onClick={toggleTheme}
				className="bg-white dark:bg-slate-800 p-4 rounded-full md:absolute md:left-4 bottom-4 left-1/2"
			>
				{theme === 'light' ? (
					<MdOutlineDarkMode className="w-8 h-8" />
				) : (
					<MdOutlineLightMode className="w-8 h-8" />
				)}
			</button>
		</div>
	);
}
