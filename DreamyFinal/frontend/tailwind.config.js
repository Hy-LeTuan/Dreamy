/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#B0DAFF",
				secondary: "#DAF5FF",
				"secondary-green": "#BDE0A4",
				accent: "#6150C9",
			},
			fontFamily: {
				header: ['"Raleway"', "sans-serif"],
				body: ['"Roboto"', "sans-serif"],
			},
			backgroundImage: {
				"mountain-image": "url('/src/assets/images/mountain.png')",
			},
		},
	},
	plugins: [],
};
