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
				alert: "#F64740",
			},
			fontFamily: {
				header: ['"Raleway"', "sans-serif"],
				body: ['"Roboto"', "sans-serif"],
			},
			backgroundImage: {
				"mountain-image": "url('/src/assets/images/mountain.png')",
				"gradient-image":
					"url('src/assets/images/bg/gradient-background.jpg')",
			},
			transitionProperty: {
				width: "width",
			},
			animation: {
				fadeIn: "fadeIn 0.4s ease-in-out",
				bounceIn: "bounceIn 0.7s ease-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: 0, transform: "translateY(-25px)" },
					"100%": { opacity: 1, transform: "none" },
				},
				bounceIn: {
					"0%": { width: 0, opacity: 0 },
					"25%": { width: "24px", opacity: 0.5 },
					"50%": { width: "38px", opacity: 0.75 },
					"75%": { width: "32px", opacity: 0.8 },
					"100%": { width: "auto", opacity: 1 },
				},
			},
		},
	},
	plugins: [],
};
