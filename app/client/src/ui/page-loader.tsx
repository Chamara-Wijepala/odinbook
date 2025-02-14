import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import CircleLoader from 'react-spinners/CircleLoader';
import useAuthStore from '../stores/auth';

export default function PageLoader() {
	const token = useAuthStore((state) => state.token);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (token) {
			setIsLoading(false);
		} else {
			setIsLoading(true);
		}
	}, [token]);

	return (
		<div className="relative">
			<div
				className={`fixed inset-0 z-[999] flex items-center justify-center bg-white dark:bg-slate-950 ${
					isLoading ? 'block' : 'hidden'
				}`}
			>
				<CircleLoader color="#38bdf8" />
			</div>

			<Outlet />
		</div>
	);
}
