import React from "react";
import { useState } from "react";

function DynamicBodyCard({ header, hiddenBody, className, children }) {
	const onMouseEnterCard = (e) => {
		e.currentTarget.setAttribute("data-hover", "");
	};

	const onMouseLeaveCard = (e) => {
		e.currentTarget.removeAttribute("data-hover");
	};
	return (
		<div
			onMouseEnter={(e) => onMouseEnterCard(e)}
			onMouseLeave={(e) => onMouseLeaveCard(e)}
			className={`flex flex-col items-center justify-center relative group ${className}`}>
			{children}
			<header className="transition-transform group-data-[hover]:-translate-y-72 delay-150 group-data-[hover]:delay-0 duration-300">
				{header}
			</header>
			<div className="transition-all absolute bottom-0 left-0 opacity-0 px-8 duration-300 group-data-[hover]:delay-150 group-data-[hover]:-translate-y-12 group-data-[hover]:opacity-100 ">
				{hiddenBody}
			</div>
		</div>
	);
}

export default DynamicBodyCard;
