import React from "react";
import { Link } from "react-router-dom";

function AuthPageHeader() {
	return (
		<div className="w-full px-16 py-2 flex flex-row justify-start items-center bg-secondary">
			<Link to={"/"} className="group">
				<img
					src="/src/assets/icons/dreamer-icon.svg"
					alt="dreamer icon"
					className="transition-transform duration-300 group-hover:scale-110 w-12 h-12"
				/>
			</Link>
		</div>
	);
}

export default AuthPageHeader;
