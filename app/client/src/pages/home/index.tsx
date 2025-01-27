import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAuthStore from '../../stores/auth';
import api from '../../api';
import { AxiosError } from 'axios';

type User = {
	username: string;
};

export default function Home() {
	const token = useAuthStore((state) => state.token);
	const [user, setUser] = useState<null | User>(null);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				const response = await api.get('/', {
					headers: { authorization: `Bearer ${token}` },
					withCredentials: false,
				});
				setUser(response.data.user);
			} catch (error) {
				if (error instanceof AxiosError) {
					const { type, message } = error.response?.data;
					if (type === 'warn') {
						toast.warn(message, {
							theme: 'colored',
						});
					}
					if (type === 'error') {
						toast.error(message, {
							theme: 'colored',
						});
					}
					navigate('/auth/login');
				}
			}
		})();
	}, []);

	return (
		<>{user ? <h2>Welcome! {user.username}</h2> : <div>Loading...</div>}</>
	);
}
