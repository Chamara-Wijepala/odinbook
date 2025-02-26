import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { IoCloseOutline, IoMenu } from 'react-icons/io5';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import useAuthStore from '../../stores/auth';
import useNewPostStore from '../../stores/new-post';
import useTheme from '../../hooks/useTheme';
import Dialog from './dialog';
import CreatePost from '../../components/create-post';
import Modal from '../../components/modal';

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const user = useAuthStore((state) => state.user);
	const newPostCreated = useNewPostStore((state) => state.newPostCreated);

	function toggleNavbar() {
		setIsOpen(!isOpen);
	}

	// close modal when new post is created
	useEffect(() => {
		if (newPostCreated && isModalOpen) {
			setIsModalOpen(false);
		}
	}, [newPostCreated]);

	return (
		<>
			{/* toggle navbar button */}
			<button
				onClick={toggleNavbar}
				className="sticky top-2 pl-2 z-50 max-w-8 max-h-8 lg:hidden"
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
				className={`fixed lg:sticky top-0 bottom-0 z-50 flex flex-col max-h-[100vh] w-[300px] bg-white dark:bg-slate-950 p-4 pt-16 lg:p-8 transition-all ${
					isOpen ? '' : '-translate-x-full lg:-translate-x-0'
				}`}
			>
				<nav className="flex flex-col gap-4 lg:gap-6">
					<NavLink
						to="/"
						onClick={toggleNavbar}
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
						onClick={toggleNavbar}
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
						to={`/users/${user?.username}`}
						onClick={toggleNavbar}
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

				<button
					onClick={() => setIsModalOpen(!isModalOpen)}
					className="p-3 lg:p-4 mt-4 lg:mt-6 rounded-full text-lg font-medium bg-sky-400 hover:bg-sky-300 w-full"
				>
					Post
				</button>

				<div className="mt-auto flex gap-4">
					<Dialog />

					<button onClick={toggleTheme}>
						{theme === 'light' ? (
							<MdOutlineDarkMode className="w-8 h-8" />
						) : (
							<MdOutlineLightMode className="w-8 h-8" />
						)}
					</button>
				</div>
			</header>

			<Modal isOpen={isModalOpen}>
				<div className="w-[600px] max-w-full h-fit">
					<CreatePost />
				</div>
			</Modal>

			{/* darkens background when navbar is open */}
			<div
				onClick={toggleNavbar}
				className={`fixed inset-0 z-40 lg:hidden bg-black transition-opacity duration-300 ${
					isOpen
						? 'opacity-25 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}`}
			></div>
		</>
	);
}
