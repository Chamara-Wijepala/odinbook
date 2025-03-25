import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import useTheme from '../../hooks/useTheme';
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
	const setUser = useAuthStore((state) => state.setUser);
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();

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
			const { accessToken, user } = response.data;

			setToken(accessToken);
			setUser(user);
			navigate('/');
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrors(error.response?.data);
			}
		}
	}

	return (
		<div className="min-h-[100svh] p-4 flex flex-col gap-4 justify-center items-center relative bg-gradient-to-br from-sky-400 to-pink-400 dark:from-sky-800 dark:to-pink-800">
			<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg max-w-md p-8 md:p-12 flex-grow-0">
				<h2 className="text-xl md:text-3xl font-bold font-norse tracking-wider">
					Log In
				</h2>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 md:gap-6 my-4 md:my-6"
				>
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
							className="py-4 px-6 border-[1px] border-slate-200 rounded-lg bg-transparent"
						/>
						{errors.username !== '' && (
							<ul className="list-disc pl-4 mt-1 text-sm text-rose-500">
								<li>{errors.username}</li>
							</ul>
						)}
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
							className="py-4 px-6 border-[1px] border-slate-200 rounded-lg bg-transparent"
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
