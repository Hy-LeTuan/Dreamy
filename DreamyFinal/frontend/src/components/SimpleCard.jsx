import React from "react";

function SimpleCard({ className, children }) {
	const onMouseEnterCard = (e) => {
		console.log("mouse enter card");
		e.currentTarget.setAttribute("data-hover", "");
	};

	const onMouseExitCard = (e) => {
		e.currentTarget.removeAttribute("data-hover");
	};

	return (
		<div
			onMouseEnter={(e) => onMouseEnterCard(e)}
			onMouseLeave={(e) => onMouseExitCard(e)}
			className={`transition-all duartion-300 flex flex-col items-center justify-center px-16 py-8 gap-16 border-2 border-indigo-400 rounded-md bg-white/20 backdrop-blur-sm shadow-black/30 shadow-md data-[hover]:backdrop-blur-md data-[hover]:border-accent data-[hover]:scale-110 ${className}`}>
			{children}
		</div>
	);
}

export default SimpleCard;
