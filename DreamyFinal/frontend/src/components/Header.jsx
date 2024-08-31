import React from "react";
import Link from "./Link";
import HeaderButton from "./HeaderButton";

function Header() {
	return (
		<div className="bg-primary flex flex-row justify-between items-center w-full px-16 py-2">
			<div className="flex flex-row items-center justify-center gap-4">
				<a href="/">
					<img
						src="/src/assets/icons/dreamer-icon.svg"
						alt="dreamer icon"
						className="w-16 h-16"
					/>
				</a>
			</div>
			<div className="flex flex-row items-center justify-center gap-10">
				<HeaderButton>
					<h4 className="font-medium">
						<Link
							content={"Overview"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h4>
				</HeaderButton>
				<HeaderButton>
					<h4 className="font-medium">
						<Link
							content={"Record"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h4>
				</HeaderButton>
				<HeaderButton>
					<h4 className="font-medium">
						<Link
							content={"Transcribe"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h4>
				</HeaderButton>
				<HeaderButton
					className={"bg-accent"}
					hoverBackgroundColor={"hover:bg-accent/80"}>
					<h4 className="font-medium">
						<Link
							content={"Login"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h4>
				</HeaderButton>
			</div>
		</div>
	);
}

export default Header;
