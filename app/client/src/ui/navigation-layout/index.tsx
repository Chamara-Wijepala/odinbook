import { useRef, useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router';
import { IoMenu, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import useAuthStore from '../../stores/auth';
import useNewPostStore from '../../stores/new-post';
import CreatePost from '../../components/create-post';
import Modal from '../../components/modal';
import useLogout from '../../hooks/useLogout';
import useTheme from '../../hooks/useTheme';

export default function NavigationLayout() {
	const [isOpen, setIsOpen] = useState(false);
	const logout = useLogout();
	const { theme, toggleTheme } = useTheme();
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(
		null
	);
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const newPostCreated = useNewPostStore((state) => state.newPostCreated);
	const user = useAuthStore((state) => state.user);

	function toggleSidebar() {
		setIsOpen(!isOpen);
	}

	function toggleModal() {
		if (!modalRef.current) return;

		modalRef.current.hasAttribute('open')
			? modalRef.current.close()
			: modalRef.current.showModal();
	}

	// close modal when new post is created
	useEffect(() => {
		if (newPostCreated && modalRef.current?.hasAttribute('open')) {
			modalRef.current.close();
		}
	}, [newPostCreated]);

	return (
		<div className="relative">
			{/* toggle sidebar button */}
			<button
				onClick={toggleSidebar}
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

			{/* darkens background when sidebar is open */}
			<div
				className={`fixed inset-0 lg:hidden pointer-events-none bg-black transition-opacity duration-300 ${
					isOpen ? 'opacity-25' : 'opacity-0'
				}`}
			></div>

			<Modal toggleModal={toggleModal} ref={modalRef}>
				{modalContent}
			</Modal>

			{/* main part of layout */}
			<div className="grid lg:grid-cols-[300px_1fr_300px] min-h-[100svh] max-w-7xl mx-auto">
				<header
					className={`fixed lg:sticky top-0 bottom-0 z-40 flex flex-col max-h-[100vh] w-[300px] bg-white dark:bg-slate-950 p-4 pt-16 lg:p-8 transition-all ${
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
							to={`/users/${user?.username}`}
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

					<button
						onClick={() => {
							toggleModal();
							setModalContent(
								<div className="w-[600px] max-w-full h-fit">
									<CreatePost />
								</div>
							);
						}}
						className="p-3 lg:p-4 mt-4 lg:mt-6 rounded-full text-lg font-medium bg-sky-400 hover:bg-sky-300 w-full"
					>
						Post
					</button>

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

				<div className="lg:border-x-[1px] border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 w-full">
					<Outlet />
				</div>

				{/* used as the third column, which centers the main part of the page */}
				<div className="hidden lg:block"></div>
			</div>
		</div>
	);
}
