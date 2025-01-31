import { toast } from 'react-toastify';

export default function coloredNotification(error: {
	type: string;
	message: string;
}) {
	if (error.type === 'warn') {
		toast.warn(error.message, {
			theme: 'colored',
		});
	}
	if (error.type === 'error') {
		toast.error(error.message, {
			theme: 'colored',
		});
	}
}
