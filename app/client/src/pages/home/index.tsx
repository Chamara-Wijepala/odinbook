import { useEffect, useState } from 'react';
import useAuthStore from '../../stores/auth';
import api from '../../api';

type User = {
	username: string;
};

export default function Home() {
	const token = useAuthStore((state) => state.token);
	const [user, setUser] = useState<null | User>(null);

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
		<>{user ? <h2>Welcome! {user.username}</h2> : <div>Loading...</div>}</>
	);
}
