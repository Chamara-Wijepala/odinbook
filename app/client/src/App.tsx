import { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Home from './pages/home';
import Explore from './pages/explore';
import Profile from './pages/profile';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
import PostPage from './pages/post';
import NotFound from './pages/not-found';
import NavigationLayout from './ui/navigation-layout';
import PageLoader from './ui/page-loader';
import navigationService from './services/navigation';

function App() {
	const navigate = useNavigate();

	useEffect(() => {
		navigationService.setNavigate(navigate);
	}, [navigate]);

	return (
		<div className="min-h-[100svh] dark:bg-slate-950 dark:text-white transition-colors">
			<Routes>
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />

				<Route element={<PageLoader />}>
					<Route element={<NavigationLayout />}>
						<Route element={<ScrollToTop />}>
							<Route index element={<Home />} />
							<Route path="explore" element={<Explore />} />
							<Route path="users/:username" element={<Profile />} />
						</Route>

						{/*
						These pages will be rendered with the navigation layout but won't
						have a navlink associated with them
						*/}
						<Route path="post/:postId" element={<PostPage />} />
						<Route
							path="post/:postId/thread/:commentId"
							element={<PostPage />}
						/>
					</Route>
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
			<ToastContainer />
		</div>
	);
}

// Switching pages while scrolled down keeps the scroll position, this causes
// issues with loading posts.
function ScrollToTop() {
	const location = useLocation();

	useLayoutEffect(() => {
		document.documentElement.scrollTo(0, 0);
	}, [location.pathname]);

	return <Outlet />;
}

export default App;
