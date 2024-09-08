import React from "react";
import { Button } from "@headlessui/react";

function ButtonFormComponent({
	oldWidth,
	newWidth,
	onClickFunction,
	className,
	children,
}) {
	return (
		<Button
			type="submit"
			onClick={(e) => onClickFunction(e)}
			className={`group relative transition-width duration-200 flex flex-row justify-start items-center px-4 py-2 rounded-lg ${oldWidth} ${newWidth} delay-75 hover:delay-0 ${className}`}>
			{children}
		</Button>
	);
}

export default ButtonFormComponent;
