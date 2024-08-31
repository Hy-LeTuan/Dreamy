import React from "react";

function Link({ content, color, highlightColor = "blue", href = null }) {
	const textColor = "";
	const textHighlightColor = "";

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
			textHighlightColor = "text-white";
			break;
		case "black":
			textColor = "text-black";
			break;
		case "primaryr":
			textHighlightColor = "text-primary";
			break;
		case "secondary":
			textHighlightColor = "text-secondary";
			break;
		case "accent":
			textHighlightColor = "text-accent";
			break;
		case "blue":
			textHighlightColor = "text-blue-400";
			break;
	}

	return (
		<a
			href={`${href ? href : null}`}
			className={`font-body ${textColor} ${
				textHighlightColor ? "hover:" + textHighlightColor : ""
			}`}>
			{content}
		</a>
	);
}

export default Link;
