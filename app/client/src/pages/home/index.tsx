import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useAuthStore from '../../stores/auth';
import api from '../../api';

type User = {
	username: string;
};

export default function Home() {
	const token = useAuthStore((state) => state.token);
	const clearToken = useAuthStore((state) => state.clearToken);
	const [user, setUser] = useState<null | User>(null);
	const navigate = useNavigate();

	async function logOut() {
		try {
			await api.post('/auth/logout');
			clearToken();
			navigate('/login');
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		(async () => {
			try {
				const response = await api.get('/', {
					headers: { authorization: `Bearer ${token}` },
				});
				setUser(response.data.user);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	return (
		<>
			{user ? (
				<>
					<h2>Welcome! {user.username}</h2>
					<button onClick={logOut}>Log Out</button>
				</>
			) : (
				<div>Loading...</div>
			)}
		</>
	);
}
