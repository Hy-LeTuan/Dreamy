import React from "react";
import "./header.css";

function Header() {
	return (
		<div className="bg-primary flex flex-row justify-between items-center w-full">
			<div>
				<img
					src="/src/assets/icons/dreamer-icon.svg"
					alt="dreamer icon"
					className="w-5 h-5"
				/>
			</div>
			<div></div>
		</div>
	);
}

export default Header;
