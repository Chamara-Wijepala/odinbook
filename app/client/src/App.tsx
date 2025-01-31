import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Home from './pages/home';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
import navigationService from './services/navigation';

function App() {
	const navigate = useNavigate();

	useEffect(() => {
		navigationService.setNavigate(navigate);
	}, [navigate]);

	return (
		<div className="min-h-[100svh]">
			<Routes>
				<Route index element={<Home />} />

				<Route path="auth">
					<Route path="register" element={<Register />} />
					<Route path="login" element={<Login />} />
				</Route>
			</Routes>
			<ToastContainer />
		</div>
	);
}

export default App;
