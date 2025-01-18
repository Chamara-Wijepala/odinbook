import { useState } from 'react';
import api from '../../api';
import { AxiosError } from 'axios';
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

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setErrors(null);

		try {
			const response = await api.post('/auth/register', formData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			console.log(response);
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrors(error.response?.data.errors);
			}
		}
	}

	return (
		<div className="min-h-[100svh] px-4 flex justify-center items-center bg-gradient-to-br from-sky-400 to-pink-400">
			<div className="bg-white shadow-md rounded-lg max-w-xl p-8 md:p-12 flex-grow">
				<h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">Register</h2>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex flex-col">
							<label htmlFor="first-name" className="text-slate-500">
								First name:
							</label>
							<input
								type="text"
								name="firstName"
								id="first-name"
								value={formData.firstName}
								required
								onChange={handleChange}
								className="py-2 px-4 border-[1px] border-slate-200 rounded-lg w-full"
							/>
							<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
								{errors?.firstName?.map((error, index) => (
									<li key={`firstName-${index}`}>{error}</li>
								))}
							</ul>
						</div>

						<div className="flex flex-col">
							<label htmlFor="last-name" className="text-slate-500">
								Last name:
							</label>
							<input
								type="text"
								name="lastName"
								id="last-name"
								value={formData.lastName}
								required
								onChange={handleChange}
								className="py-2 px-4 border-[1px] border-slate-200 rounded-lg w-full"
							/>
							<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
								{errors?.lastName?.map((error, index) => (
									<li key={`lastName-${index}`}>{error}</li>
								))}
							</ul>
						</div>
					</div>

					<div className="flex flex-col">
						<label htmlFor="username" className="text-slate-500">
							Username:
						</label>
						<input
							type="text"
							name="username"
							id="username"
							value={formData.username}
							required
							onChange={handleChange}
							className="py-2 px-4 border-[1px] border-slate-200 rounded-lg"
						/>
						<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
							{!errors?.username && (
								<li className="text-slate-500">
									Must be at least 5 characters
								</li>
							)}
							{errors?.username?.map((error, index) => (
								<li key={`username-${index}`}>{error}</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col">
						<label htmlFor="password" className="text-slate-500">
							Password:
						</label>
						<input
							type="password"
							name="password"
							id="password"
							value={formData.password}
							required
							onChange={handleChange}
							className="py-2 px-4 border-[1px] border-slate-200 rounded-lg"
						/>
						<ul className="flex flex-col gap-2 mt-1 list-disc pl-4 text-sm text-rose-500">
							{!errors?.password && (
								<li className="text-slate-500">
									Must be at least 8 characters
								</li>
							)}
							{errors?.password?.map((error, index) => (
								<li key={`password-${index}`}>{error}</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col">
						<label htmlFor="confirm-password" className="text-slate-500">
							Confirm password:
						</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirm-password"
							value={formData.confirmPassword}
							required
							onChange={handleChange}
							className="py-2 px-4 border-[1px] border-slate-200 rounded-lg"
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
			</div>
		</div>
	);
}
