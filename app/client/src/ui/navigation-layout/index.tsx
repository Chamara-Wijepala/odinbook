import { useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import { IoMenu, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import useLogout from '../../hooks/useLogout';
import useTheme from '../../hooks/useTheme';

export default function NavigationLayout() {
	const [isOpen, setIsOpen] = useState(false);
	const logout = useLogout();
	const { theme, toggleTheme } = useTheme();

	function toggleSidebar() {
		setIsOpen(!isOpen);
	}

	return (
		<div className="flex min-h-[100svh] max-w-5xl mx-auto relative pt-12 lg:pt-0">
			<button
				onClick={toggleSidebar}
				className="absolute top-2 left-2 z-50 lg:hidden"
			>
				{isOpen ? (
					<>
						<IoCloseOutline className="w-8 h-8" />
						<span className="sr-only">Close sidebar</span>
					</>
				) : (
					<>
						<IoMenu className="w-8 h-8" />
						<span className="sr-only">Open sidebar</span>
					</>
				)}
			</button>

			<header
				className={`fixed top-0 bottom-0 z-40 flex flex-col w-[300px] lg:relative bg-white dark:bg-slate-950 p-4 pt-16 lg:p-8 transition-all ${
					isOpen ? '' : '-translate-x-full lg:-translate-x-0'
				}`}
			>
				<nav className="flex flex-col gap-4 lg:gap-6">
					<NavLink
						to="/"
						onClick={toggleSidebar}
						className={({ isActive }) =>
							`p-3 lg:p-4 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-center text-lg font-medium transition-colors ${
								isActive
									? 'bg-slate-300 hover:bg-slate-300 dark:bg-slate-900 hover:dark:bg-slate-900'
									: ''
							}`
						}
					>
						Home
					</NavLink>
					<NavLink
						to="/explore"
						onClick={toggleSidebar}
						className={({ isActive }) =>
							`p-3 lg:p-4 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-center text-lg font-medium transition-colors ${
								isActive
									? 'bg-slate-300 hover:bg-slate-300 dark:bg-slate-900 hover:dark:bg-slate-900'
									: ''
							}`
						}
					>
						Explore
					</NavLink>
					<NavLink
						to="/profile"
						onClick={toggleSidebar}
						className={({ isActive }) =>
							`p-3 lg:p-4 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-center text-lg font-medium transition-colors ${
								isActive
									? 'bg-slate-300 hover:bg-slate-300 dark:bg-slate-900 hover:dark:bg-slate-900'
									: ''
							}`
						}
					>
						Profile
					</NavLink>
				</nav>

				<div className="mt-auto flex gap-4">
					<button onClick={logout}>
						<IoLogOutOutline className="w-8 h-8" />
						<span className="sr-only">Log out</span>
					</button>

					<button onClick={toggleTheme}>
						{theme === 'light' ? (
							<MdOutlineDarkMode className="w-8 h-8" />
						) : (
							<MdOutlineLightMode className="w-8 h-8" />
						)}
					</button>
				</div>
			</header>

			{/* darkens background when sidebar is open */}
			<div
				className={`fixed inset-0 lg:hidden bg-black transition-opacity duration-300 ${
					isOpen ? 'opacity-25' : 'opacity-0'
				}`}
			></div>

			<Outlet />
		</div>
	);
}
