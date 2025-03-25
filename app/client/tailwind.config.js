/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'arial', 'sans-serif'],
				norse: ['Norse', 'arial', 'sans-serif'],
			},
		},
	},
	plugins: [],
	darkMode: 'selector',
};
