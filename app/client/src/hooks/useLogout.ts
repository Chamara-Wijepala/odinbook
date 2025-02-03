import { useNavigate } from 'react-router';
import useAuthStore from '../stores/auth';
import api from '../api';

export default function useLogout() {
	const clearToken = useAuthStore((state) => state.clearToken);
	const navigate = useNavigate();

	async function logout() {
		try {
			await api.post('/auth/logout');
			clearToken();
			navigate('/login');
		} catch (error) {
			console.log(error);
		}
	}

	return logout;
}
