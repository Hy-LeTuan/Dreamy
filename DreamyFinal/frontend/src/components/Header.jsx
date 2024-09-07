import React from "react";
import HeaderLink from "./HeaderLink";
import HeaderButton from "./HeaderButton";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Header() {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	return (
		<div className="bg-primary flex flex-row justify-between items-center w-full px-16 py-2">
			<div className="flex flex-row items-center justify-center gap-4">
				<Link to={"/"} className="group">
					<img
						src="/src/assets/icons/dreamer-icon.svg"
						alt="dreamer icon"
						className="transition-transform duration-300 group-hover:scale-110 w-12 h-12"
					/>
				</Link>
				<div className="border-r-2 border-white h-8"></div>
				<Link to={"/"} className="group">
					<h5 className="transition-transform duration-300 font-medium text-white group-hover:scale-110">
						Dreamy
					</h5>
				</Link>
			</div>
			<div className="flex flex-row items-center justify-center gap-10">
				<HeaderButton>
					<h5 className="font-medium">
						<HeaderLink
							content={"Overview"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h5>
				</HeaderButton>
				<HeaderButton>
					<h5 className="font-medium">
						<HeaderLink
							content={"Record"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h5>
				</HeaderButton>
				<HeaderButton>
					<h5 className="font-medium">
						<HeaderLink
							content={"Transcribe"}
							color={"white"}
							highlightColor={null}
							href={"/"}
						/>
					</h5>
				</HeaderButton>
				<HeaderButton
					className={"bg-accent"}
					hoverBackgroundColor={"hover:bg-accent/80"}>
					<h5 className="font-medium">
						{isLoggedIn ? (
							<HeaderLink
								content={"Logout"}
								color={"white"}
								highlightColor={null}
								href={"/logout"}
							/>
						) : (
							<HeaderLink
								content={"Login"}
								color={"white"}
								highlightColor={null}
								href={"/login"}
							/>
						)}
					</h5>
				</HeaderButton>
			</div>
		</div>
	);
}

export default Header;
