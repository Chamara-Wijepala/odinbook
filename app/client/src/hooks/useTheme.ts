import { useEffect, useState } from 'react';

const useTheme = () => {
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) return savedTheme;
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	});

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	}

	useEffect(() => {
		theme === 'dark'
			? window.document.documentElement.classList.add('dark')
			: window.document.documentElement.classList.remove('dark');
	}, [theme]);

	return { theme, toggleTheme };
};

export default useTheme;
