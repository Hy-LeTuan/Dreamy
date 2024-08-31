import React from "react";
import { Button } from "@headlessui/react";

function HeaderButton({
	children,
	className = null,
	hoverBackgroundColor = null,
}) {
	return (
		<Button
			className={`transition-all duration-300 inline-flex items-center gap-2 rounded-md py-1 px-4 focus:outline-none ${
				hoverBackgroundColor
					? hoverBackgroundColor
					: "data-[hover]:bg-accent/15"
			} data-[focus]:outline-1 data-[focus]:outline-white ${className}`}>
			{children}
		</Button>
	);
}

export default HeaderButton;
