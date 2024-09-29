import React from "react";
import { Input, Button } from "@headlessui/react";
import { LiaFacebook, LiaLinkedin } from "react-icons/lia";
import { HiOutlineMail } from "react-icons/hi";

function Footer() {
	return (
		<div className="bg-primary w-full px-16 py-8">
			<div className="flex flex-row justify-between items-start gap-20">
				<div className="">
					<div className="flex flex-col">
						<div className="flex flex-row items-center justify-center">
							<img
								src="/src/assets/icons/dreamer-icon.svg"
								alt="Dreamy Icon"
								className="w-10 h-10"
							/>
							<h3 className="font-medium text-black">Dreamy</h3>
						</div>
						<div className="flex-col">
							<div className="">
								<p>Subscribe for feature updates and blogs!</p>
							</div>
							<div className="flex flex-row">
								<Input />
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row justify-center items-center">
					<HiOutlineMail className="w-10 h-10" />
					<LiaLinkedin className="w-10 h-10" />
					<LiaFacebook className="w-10 h-10" />
				</div>
				<div className="flex flex-row justify-center items-start gap-16">
					<div className="flex flex-col justify-center items-center gap-1">
						<h5 className="font-medium">Product</h5>
						<div>
							<p>Features</p>
						</div>
						<div>
							<p>Pricing</p>
						</div>
						<div>
							<p>Support Center</p>
						</div>
					</div>
					<div className="flex flex-col justify-center items-center gap-1">
						<h5 className="font-medium">Company</h5>
						<div>
							<p>About us</p>
						</div>
						<div>
							<p>Contact us</p>
						</div>
					</div>
					<div></div>
				</div>
			</div>
			<hr className="text-black w-full mx-auto my-16" />
		</div>
	);
}

export default Footer;
