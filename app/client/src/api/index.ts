import axios from 'axios';

export default axios.create({
	baseURL:
		import.meta.env.MODE === 'production'
			? import.meta.env.SERVER_BASEURL
			: 'http://localhost:3000',
});
