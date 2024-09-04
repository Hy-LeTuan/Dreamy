import React from "react";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import { Field, Label, Input, Description, Button } from "@headlessui/react";
import { login } from "../utils/auth.js";

function Login() {
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
		} catch (e) {
			console.log(e.message);
		}
	};

	return (
		<>
			<Header />
			<Section color={"white"}>
				<div className="w-full">
					<h1 className="text-center">Login</h1>
					<div className="mt-24 mx-auto w-3/4 bg-secondary flex flex-col items-start justify-center py-3 px-6 gap-6">
						<Field className={"flex flex-col gap-3"}>
							<Label>
								<h4>Username</h4>
							</Label>
							<Description>
								<h4>Use your unique username</h4>
							</Description>
							<Input
								className={"py-3 px-3"}
								name="username"
								type="text"
								onChange={(e) => onLoginInputChange(e)}
							/>
						</Field>
						<Field className={"flex flex-col gap-3"}>
							<Label>
								<h4>Password</h4>
							</Label>
							<Description>
								<h4>Enter your password</h4>
							</Description>
							<Input
								className={"py-3 px-3"}
								name="password"
								type="password"
								onChange={(e) => onLoginInputChange(e)}
							/>
						</Field>
						<Button
							type="submit"
							onClick={(e) => onLoginInputSubmit(e)}
							className={
								"transition-transform px-3 py-2 bg-accent rounded-lg hover:scale-105"
							}>
							<h4 className="text-white font-medium">
								Login Now!
							</h4>
						</Button>
					</div>
				</div>
			</Section>
			<Footer />
		</>
	);
}

export default Login;
