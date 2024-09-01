import React from "react";

function DynamicBodyCard({ header, hiddenBody, className, children }) {
	return (
		<div
			className={`flex flex-col items-center justify-center relative ${className}`}>
			{children}
			<header>{header}</header>
			<div className="absolute opacity-0">{hiddenBody}</div>
		</div>
	);
}

export default DynamicBodyCard;
