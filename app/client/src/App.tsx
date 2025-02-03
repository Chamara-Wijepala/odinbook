import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Home from './pages/home';
import Explore from './pages/explore';
import Profile from './pages/profile';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
import NavigationLayout from './ui/navigation-layout';
import navigationService from './services/navigation';

function App() {
	const navigate = useNavigate();

	useEffect(() => {
		navigationService.setNavigate(navigate);
	}, [navigate]);

	return (
		<div className="min-h-[100svh]">
			<Routes>
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />

				<Route element={<NavigationLayout />}>
					<Route index element={<Home />} />
					<Route path="explore" element={<Explore />} />
					<Route path="profile" element={<Profile />} />
				</Route>
			</Routes>
			<ToastContainer />
		</div>
	);
}

export default App;
