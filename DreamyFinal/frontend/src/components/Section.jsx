import React from "react";

function Section({ color, children }) {
	let sectionColor;
	switch (color) {
		case "white":
			sectionColor = "bg-white";
			break;
		case "black":
			sectionColor = "bg-black";
			break;
		case "primary":
			sectionColor = "bg-primary";
			break;
		case "secondary":
			sectionColor = "bg-secondary";
			break;
		case "mountain":
			sectionColor = "bg-mountain-image";
	}
	return (
		<section
			className={`w-full py-28 bg-cover bg-no-repeat ${sectionColor}`}>
			{children}
		</section>
	);
}

export default Section;
