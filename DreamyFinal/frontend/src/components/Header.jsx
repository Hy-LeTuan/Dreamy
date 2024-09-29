import React from "react";
import HeaderLink from "./HeaderLink";
import HeaderButton from "./HeaderButton";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Button } from "@headlessui/react";

function Header() {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	return (
		<div className="bg-transparent flex flex-row justify-between items-center w-full px-16 py-3">
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
					<h6 className="transition-transform duration-300 font-medium text-white group-hover:scale-110">
						Dreamy
					</h6>
				</Link>
			</div>
			<div className="flex flex-row items-center justify-center gap-10">
				{isLoggedIn ? (
					<>
						<HeaderButton>
							<h6 className="font-medium">
								<HeaderLink
									content={"Overview"}
									color={"white"}
									highlightColor={null}
									href={"/"}
								/>
							</h6>
						</HeaderButton>
						<HeaderButton>
							<h6 className="font-medium">
								<HeaderLink
									content={"Record"}
									color={"white"}
									highlightColor={null}
									href={"/"}
								/>
							</h6>
						</HeaderButton>
						<HeaderButton>
							<h6 className="font-medium">
								<HeaderLink
									content={"Transcribe"}
									color={"white"}
									highlightColor={null}
									href={"/"}
								/>
							</h6>
						</HeaderButton>
						<HeaderButton
							className={"bg-accent"}
							hoverBackgroundColor={"hover:bg-accent/80"}>
							<h6 className="font-medium">
								<HeaderLink
									content={"Logout"}
									color={"white"}
									highlightColor={null}
									href={"/logout"}
								/>
							</h6>
						</HeaderButton>
					</>
				) : (
					<>
						<Button className="transition-colors duration-300 ease-in-out hover:bg-accent hover:text-white rounded-full px-5 py-1 border-accent border-[1px] bg-transparent shadow-md">
							<h6 className="font-medium">
								<Link to={"/login"}>Log In</Link>
							</h6>
						</Button>
						<Button className="transition-width group rounded-full px-5 py-1 bg-accent flex flex-row justify-center items-center shadow-md">
							<h6 className="font-medium text-white">
								<Link>Get Started</Link>
							</h6>
							<div className="flex flex-row items-center group-hover:animate-bounceIn w-0 h-0 group-hover:w-auto group-hover:opacity-1">
								<img
									src="/src/assets/icons/right-arrow-icon.svg"
									alt="right arrow icon"
									className="w-8 h-8"
								/>
							</div>
						</Button>
					</>
				)}
			</div>
		</div>
	);
}

export default Header;
