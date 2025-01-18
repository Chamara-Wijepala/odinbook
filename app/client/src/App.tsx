import { Routes, Route } from 'react-router';
import Register from './pages/register';

function App() {
	return (
		<div className="min-h-[100svh]">
			<Routes>
				<Route path="auth">
					<Route path="register" element={<Register />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
