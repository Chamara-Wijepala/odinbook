import { useState, useEffect } from 'react';
import api from '../api';

export default function useData<T>(url: string) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<unknown | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const response = await api.get(url);
				setData(response.data);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [url]);

	return {
		isLoading,
		data,
		error,
	};
}
