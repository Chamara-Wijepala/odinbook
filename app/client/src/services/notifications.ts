import { toast } from 'react-toastify';

export default function coloredNotification(notification: {
	type: string;
	message: string;
}) {
	if (notification.type === 'warn') {
		toast.warn(notification.message, {
			theme: 'colored',
		});
	}
	if (notification.type === 'error') {
		toast.error(notification.message, {
			theme: 'colored',
		});
	}
	if (notification.type === 'success') {
		toast.success(notification.message, {
			theme: 'colored',
		});
	}
}
