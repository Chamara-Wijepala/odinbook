import axios, { AxiosError } from 'axios';
import useAuthStore from '../stores/auth';
import navigation from '../services/navigation';
import coloredNotification from '../services/notifications';

const baseURL =
	import.meta.env.MODE === 'production'
		? import.meta.env.SERVER_BASEURL
		: 'http://localhost:3000';

const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

api.interceptors.request.use(async (config) => {
	// no auth needed for these endpoints
	if (config.url === '/auth/register' || config.url === '/auth/login') {
		return config;
	}

	const token = useAuthStore.getState().token;

	// since access tokens are stored in memory and removed when the tab is
	// refreshed, there might still be a valid refresh token stored in cookies
	if (!token) {
		const controller = new AbortController();

		try {
			const response = await axios.get(`${baseURL}/auth/refresh`, {
				withCredentials: true,
			});
			const { newToken, user } = response.data;
			const setToken = useAuthStore.getState().setToken;
			const setUser = useAuthStore.getState().setUser;

			setToken(newToken);
			setUser(user);
			config.headers['authorization'] = `Bearer ${newToken}`;
			return config;
		} catch (error) {
			if (error instanceof AxiosError) {
				const { toast } = error.response?.data;

				coloredNotification(toast);
				navigation.navigate && navigation.navigate('/login');
				controller.abort();
			}

			return {
				...config,
				signal: controller.signal,
			};
		}
	}

	// attach access token to each request
	config.headers['authorization'] = `Bearer ${token}`;

	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		// handle unexpected server errors
		if (error.response.status === 500) {
			const data = error.response.data;

			if (data.toast) {
				coloredNotification(data.toast);
				navigation.navigate && navigation.navigate('/');
			}

			return Promise.reject(error);
		}

		if (error.response.status !== 401) {
			return Promise.reject(error);
		}

		// handle auth errors
		const data = error.response?.data;
		const originalRequest = error.config;

		if (data.toast) {
			coloredNotification(data.toast);
			navigation.navigate && navigation.navigate('/login');
			return;
		}

		// refresh access token
		if (data.refresh && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const response = await axios.get(`${baseURL}/auth/refresh`, {
					withCredentials: true,
				});
				const { newToken, user } = response.data;
				const setToken = useAuthStore.getState().setToken;
				const setUser = useAuthStore.getState().setUser;

				setToken(newToken);
				setUser(user);
				api.defaults.headers.common['authorization'] = `Bearer ${newToken}`;
				return api(originalRequest);
			} catch (error) {
				if (error instanceof AxiosError) {
					const { toast } = error.response?.data;

					coloredNotification(toast);
					navigation.navigate && navigation.navigate('/login');
					return;
				}

				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
