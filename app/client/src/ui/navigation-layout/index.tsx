import { Outlet } from 'react-router';
import Navbar from '../navbar';

export default function NavigationLayout() {
	return (
		<div className="lg:grid lg:grid-cols-[300px_1fr_300px] min-h-[100svh] max-w-7xl mx-auto">
			<Navbar />

			{/* the top padding is so that the toggle navbar button doesn't overlap */}
			<div className="pt-12 lg:pt-0 lg:border-x-[1px] border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 w-full min-h-[100svh] lg:h-auto">
				<Outlet />
			</div>

			{/* used as the third column, which centers the main part of the page */}
			<div className="hidden lg:block"></div>
		</div>
	);
}
