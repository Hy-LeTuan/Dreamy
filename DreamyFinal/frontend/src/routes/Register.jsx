import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import { Field, Label, Input, Description, Button } from "@headlessui/react";
import axiosInstance from "../utils/axiosInstance";
import { login } from "../utils/auth";

function Register() {
	const [userRegisterInput, setUserRegisterInput] = useState({
		username: null,
		email: null,
		phone: null,
		password: null,
	});

	const onRegisterInputChange = (e) => {
		const name = e.currentTarget.name;
		setUserRegisterInput({
			...userRegisterInput,
			[name]: e.target.value,
		});

		console.log(userRegisterInput);
	};

	const onRegisterInputSubmit = async (e) => {
		e.preventDefault();

		const registerFormData = new FormData();

		Object.entries(userRegisterInput).forEach(([key, value]) => {
			registerFormData.append(key, value);
		});

		try {
			const response = await axiosInstance.post(
				"users/register",
				registerFormData
			);
		} catch (e) {
			console.log(e);
		}

		// login after successfully creating an account
		try {
			const response = await login({
				username: userRegisterInput.username,
				password: userRegisterInput.password,
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
					<h1 className="text-center">Register</h1>
					<div className="mt-24 mx-auto w-3/4 bg-secondary flex flex-col items-start justify-center px-6 py-3 gap-6">
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
								onChange={(e) => onRegisterInputChange(e)}
							/>
						</Field>
						<Field className={"flex flex-col gap-3"}>
							<Label>
								<h4>Email</h4>
							</Label>
							<Description>
								<h4>Enter your work email</h4>
							</Description>
							<Input
								className={"py-3 px-3"}
								name="email"
								type="text"
								onChange={(e) => onRegisterInputChange(e)}
							/>
						</Field>
						<Field className={"flex flex-col gap-3"}>
							<Label>
								<h4>Phone</h4>
							</Label>
							<Description>
								<h4>Enter your mobile phone number</h4>
							</Description>
							<Input
								className={"py-3 px-3"}
								name="phone"
								type="text"
								onChange={(e) => onRegisterInputChange(e)}
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
								onChange={(e) => onRegisterInputChange(e)}
							/>
						</Field>
						<Button
							type="submit"
							onClick={(e) => onRegisterInputSubmit(e)}
							className={
								"transition-transform px-3 py-2 bg-accent rounded-lg hover:scale-105"
							}>
							<h4 className="text-white font-medium">
								Register Now!
							</h4>
						</Button>
					</div>
				</div>
			</Section>
			<Footer />
		</>
	);
}

export default Register;
