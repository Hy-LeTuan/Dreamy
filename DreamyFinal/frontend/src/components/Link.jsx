import React from "react";

function Link({ content, color, highlightColor = "blue", href = null }) {
	let textColor = "";
	let textHighlightColor = "";

	switch (color) {
		case "white":
			textColor = "text-white";
			break;
		case "black":
			textColor = "text-black";
			break;
		case "primaryr":
			textColor = "text-primary";
			break;
		case "secondary":
			textColor = "text-secondary";
			break;
		case "accent":
			textColor = "text-accent";
			break;
	}

	switch (highlightColor) {
		case null:
			textHighlightColor = null;
			break;
		case "white":
			textHighlightColor = "hover:text-white";
			break;
		case "black":
			textColor = "text-black";
			break;
		case "primaryr":
			textHighlightColor = "hover:text-primary";
			break;
		case "secondary":
			textHighlightColor = "hover:text-secondary";
			break;
		case "accent":
			textHighlightColor = "hover:text-accent";
			break;
		case "blue":
			textHighlightColor = "hover:text-blue-400";
			break;
	}

	return (
		<a
			href={`${href ? href : null}`}
			className={`${textColor} ${textHighlightColor}`}>
			{content}
		</a>
	);
}

export default Link;
