import React from "react";

function Section({ color, py_override = false, className = null, children }) {
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
			break;
		case "gradient":
			sectionColor = "bg-gradient-image";
			break;
		case "secondary-green":
			sectionColor = "bg-secondary-green";
			break;
		case "none":
			sectionColor = "bg-transparent";
			break;
	}
	return (
		<section
			className={`w-full ${py_override ? "" : "py-28"}  bg-contain
            n bg-no-repeat ${sectionColor} ${className}`}>
			{children}
		</section>
	);
}

export default Section;
