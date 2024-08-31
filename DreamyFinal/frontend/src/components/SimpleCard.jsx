import React from "react";

function SimpleCard({ className, children }) {
	return (
		<div
			className={`flex flex-col items-center justify-center px-16 py-8 gap-16 border-2 border-indigo-500 rounded-md bg-white/20 backdrop-blur-sm shadow-black/30 shadow-md ${className}`}>
			{children}
		</div>
	);
}

export default SimpleCard;
