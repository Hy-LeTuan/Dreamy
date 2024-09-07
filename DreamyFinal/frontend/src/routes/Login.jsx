import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import { Field, Label, Input, Description, Button } from "@headlessui/react";
import { login } from "../utils/auth.js";

function Login() {
	const navigate = useNavigate();

	const [userLoginInput, setUserLoginInput] = useState({
		username: null,
		password: null,
	});

	const onLoginInputChange = (e) => {
		setUserLoginInput({
			...userLoginInput,
			[e.currentTarget.name]: e.currentTarget.value,
		});
	};

	const onLoginInputSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await login({
				username: userLoginInput.username,
				password: userLoginInput.password,
			});

			if (response.status == "success") navigate("/");
		} catch (e) {
			console.log(e.message);
		}
	};

	return (
		<>
			<div className="w-full px-16 py-2 flex flex-row justify-start items-center bg-secondary">
				<Link to={"/"} className="group">
					<img
						src="/src/assets/icons/dreamer-icon.svg"
						alt="dreamer icon"
						className="transition-transform duration-300 group-hover:scale-110 w-12 h-12"
					/>
				</Link>
			</div>
			<Section
				color={"secondary"}
				py_override={true}
				className={"py-20 w-full h-screen"}>
				<div className="px-24 gap-28 grid grid-cols-2 items-stretch">
					<div className="col-span-1 flex flex-col items-start justify-start px-12 py-10 gap-6">
						<h2 className="font-medium text-center">
							Welcome Back
						</h2>
						<p className="text-neutral-500 text-base">
							Our goal is to help you pass every exam and ace
							every test. Login now to never miss any information
							again and let's get back to learning
						</p>
					</div>
					<div className="col-span-1 bg-white flex flex-col items-start justify-between py-10 px-12 gap-12 rounded-xl">
						<h2 className="font-medium text-accent">
							Login Information
						</h2>
						<div className="flex flex-col gap-8">
							<Field className={"flex flex-col gap-2 w-full"}>
								<Label>
									<p className="text-base text-neutral-500">
										Name
									</p>
								</Label>
								<Input
									className={
										"transition-all block py-3 px-3 w-full bg-white !border-black/5 border-2 rounded-lg focus:outline-none data-[hover]:!bg-gray-400/10 data-[focus]:!bg-white data-[focus]:!border-blue-500"
									}
									name="username"
									type="text"
									placeholder="Your username"
									onChange={(e) => onLoginInputChange(e)}
								/>
							</Field>
							<Field className={"flex flex-col gap-2 w-full"}>
								<Label>
									<p className="text-base text-neutral-500">
										Password
									</p>
								</Label>
								<Input
									className={
										"transition-all block py-3 px-3 w-full bg-white !border-black/5 border-2 rounded-lg focus:outline-none data-[hover]:!bg-gray-400/10 data-[focus]:!bg-white data-[focus]:!border-blue-500"
									}
									name="password"
									type="password"
									placeholder="Your password"
									onChange={(e) => onLoginInputChange(e)}
								/>
							</Field>
						</div>
						<Button
							type="submit"
							onClick={(e) => onLoginInputSubmit(e)}
							className={
								"transition-transform px-3 py-2 bg-accent rounded-lg hover:scale-105"
							}>
							<h6 className="text-white font-medium">
								Login Now!
							</h6>
						</Button>
					</div>
				</div>
			</Section>
		</>
	);
}

export default Login;
