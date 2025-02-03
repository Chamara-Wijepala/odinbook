import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAuthStore from '../../stores/auth';
import api from '../../api';
import { AxiosError } from 'axios'; // importing as type doesn't allow using it as a value

export default function Login() {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});
	const [errors, setErrors] = useState({
		username: '',
		password: '',
	});
	const setToken = useAuthStore((state) => state.setToken);
	const navigate = useNavigate();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setErrors({ username: '', password: '' });

		try {
			const response = await api.post('/auth/login', formData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			setToken(response.data.accessToken);
			navigate('/');
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrors(error.response?.data);
			}
		}
	}

	return (
		<div className="min-h-[100svh] px-4 flex justify-center items-center bg-gradient-to-br from-sky-400 to-pink-400">
			<div className="bg-white shadow-md rounded-lg max-w-md p-8 md:p-12 flex-grow">
				<h2 className="text-xl md:text-3xl font-bold">Log In</h2>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 md:gap-6 my-4 md:my-6"
				>
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
							className="py-4 px-6 border-[1px] border-slate-200 rounded-lg"
						/>
						{errors.username !== '' && (
							<ul className="list-disc pl-4 mt-1 text-sm text-rose-500">
								<li>{errors.username}</li>
							</ul>
						)}
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
							className="py-4 px-6 border-[1px] border-slate-200 rounded-lg"
						/>
						{errors.password !== '' && (
							<ul className="list-disc pl-4 mt-1 text-sm text-rose-500">
								<li>{errors.password}</li>
							</ul>
						)}
					</div>

					<button
						type="submit"
						className="bg-sky-400 hover:bg-sky-300 transition-colors duration-250 p-2 md:p-4 rounded-lg"
					>
						Log In
					</button>
				</form>

				<p className="text-center">
					Don't have an account?{' '}
					<Link
						to="/register"
						className="text-sky-600 hover:text-sky-400 transition-colors duration-250"
					>
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
