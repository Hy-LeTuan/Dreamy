import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Field, Label, Input, Description, Button } from "@headlessui/react";
import Section from "../components/Section";
import AuthPageHeader from "../components/AuthPageHeader";
import axiosInstance from "../utils/axiosInstance";
import AuthFormInputField from "../components/AuthFormInputField";
import ButtonFormComponent from "../components/ButtonFormComponent";
import useAuthStore from "../store/authStore";
import { login } from "../utils/auth";
import {
	safeguardFromSpecialChars,
	safeguardFromWrongEmailFormat,
} from "../utils/safeguard.js";
import { delayExecution } from "../utils/utils.js";

function Register() {
	// navigator
	const navigate = useNavigate();

	// progress management state
	const [progressIndex, setProgressIndex] = useState(0);

	// get logged in state from store
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	// initialize loading state
	const [isLoading, setIsLoading] = useState(false);

	// initialize error state and error message
	const [isError, setIsError] = useState({
		username: false,
		email: false,
		secondary_email: false,
		phone: false,
		password: false,
	});

	const [errorMessage, setErrorMessage] = useState({
		username: "",
		email: "",
		secondary_email: "",
		phone: "",
		password: "",
	});

	// input state to collect inputs
	const [userRegisterInput, setUserRegisterInput] = useState({
		username: null,
		email: null,
		secondary_email: null,
		phone: null,
		password: null,
		confirm_password: null,
	});

	// event for register input change
	const onRegisterInputChange = (e) => {
		const name = e.currentTarget.name;
		const value = e.currentTarget.value;

		// safeguard and set state for all input field
		if (name == "username") {
			if (safeguardFromSpecialChars(value)) {
				setIsError({
					...isError,
					username: true,
				});
				setErrorMessage({
					...errorMessage,
					username: "Username cannot contain special symbols",
				});
			} else {
				setIsError({
					...isError,
					username: false,
				});
			}
		} else if (name == "email") {
			if (safeguardFromWrongEmailFormat(value)) {
				setIsError({
					...isError,
					email: true,
				});
				setErrorMessage({
					...errorMessage,
					email: "Email format seems incorrect",
				});
			} else {
				setIsError({
					...isError,
					email: false,
				});
			}
		} else if (name == "secondary_email") {
			if (value == "") {
				setIsError({
					...isError,
					secondary_email: false,
				});
			} else {
				if (safeguardFromWrongEmailFormat(value)) {
					setIsError({
						...isError,
						secondary_email: true,
					});
					setErrorMessage({
						...errorMessage,
						secondary_email: "Email format seems incorrect",
					});
				} else {
					setIsError({
						...isError,
						secondary_email: false,
					});
				}
			}
		}

		setUserRegisterInput({
			...userRegisterInput,
			[name]: value,
		});

		console.log(userRegisterInput);
	};

	// event for progressing on the progress bar
	const onProgressButtonClick = () => {
		if (progressIndex < 2) {
			setProgressIndex((prev) => prev + 1);
		}
	};

	const onReturnButtonClick = () => {
		if (progressIndex > 0) {
			setProgressIndex((prev) => prev - 1);
		}
	};

	// event for register submit button pressed
	const onRegisterInputSubmit = async (e) => {
		e.preventDefault();

		// check for any remaining errors before submitting form
		Object.entries(isError).forEach(([key, value]) => {
			if (value == true) return;
		});

		// check for non empty fields
		if (userRegisterInput.username == "" || !userRegisterInput.username) {
			setIsError({
				...isError,
				username: true,
			});
			setErrorMessage({
				...errorMessage,
				username: "Username cannot be empty",
			});
		}

		if (userRegisterInput.email == "" || !userRegisterInput.email) {
			setIsError({
				...isError,
				email: true,
			});
			setErrorMessage({
				...errorMessage,
				email: "Email cannot be empty",
			});
		}

		// check for matching password
		if (userRegisterInput.password !== userRegisterInput.confirm_password) {
			setIsError({
				...isError,
				password: true,
			});
			setErrorMessage({
				...errorMessage,
				password: "Password confirmation does not match",
			});
		}

		// set secondary email to email
		if (
			userRegisterInput.secondary_email == "" ||
			!userRegisterInput.secondary_email
		) {
			userRegisterInput.secondary_email = userRegisterInput.email;
		}

		// create and send form
		const registerFormData = new FormData();

		Object.entries(userRegisterInput).forEach(([key, value]) => {
			if (key == "confirm_password") {
				console.log("confirm password encountered");
			} else {
				registerFormData.append(key, value);
			}
		});

		try {
			setIsLoading(true);

			const registerResponse = await axiosInstance.post(
				"users/register",
				registerFormData
			);
		} catch (e) {
			console.log(e);
			setIsLoading(false);
			setIsError({
				...isError,
				email: true,
			});
			setErrorMessage({
				...errorMessage,
				email: "Something went wrong, please wait and try again",
			});
			return;
		}

		// login after successfully creating an account
		try {
			const loginResponse = await login({
				username: userRegisterInput.username,
				password: userRegisterInput.password,
			});

			if (loginResponse.status == "success") {
				setIsLoading(false);

				Object.entries(isError).forEach(([key, value]) => {
					isError[key] = false;
				});

				delayExecution(() => {
					navigate("/");
				}, 500);
			}
		} catch (e) {
			setIsLoading(false);
			setIsError({
				...isError,
				username: true,
			});
			setErrorMessage({
				...errorMessage,
				username: "Username and password does not match",
			});
			console.log(e.message);
		}
	};

	return (
		<>
			<AuthPageHeader />
			<Section
				color={"secondary"}
				py_override={true}
				className={"py-16 w-full h-dvh"}>
				<div className="px-24 gap-24 h-full grid grid-cols-2 items-start">
					<div className="col-span-1 flex flex-col items-start justify-start px-12 py-10 gap-6">
						<h2 className="font-medium text-center">
							Welcome Onboard
						</h2>
						<p className="text-neutral-500 text-base">
							Our goal is to help you pass every exam and ace
							every test. Login now to never miss any information
							again and let's get back to learning
						</p>
					</div>
					<div className="col-span-1 h-[560px] bg-white flex flex-col items-start justify-between pt-10 pb-4 px-12 gap-10 rounded-xl">
						<div className="w-full flex flex-col items-start justify-start gap-8">
							<h2 className="font-medium text-accent">
								Register Information
							</h2>
							<div className="flex flex-col gap-8 w-full">
								{progressIndex == 0 && (
									<>
										<AuthFormInputField
											name={"email"}
											type={"text"}
											label={"Main Email"}
											placeholder={"Your email"}
											errorMessage={errorMessage.email}
											isError={isError.email}
											onChangeFunction={
												onRegisterInputChange
											}
											value={userRegisterInput.email}
											className={"animate-fadeIn"}
										/>
										<AuthFormInputField
											name={"secondary_email"}
											type={"text"}
											label={"Secondary Email"}
											placeholder={"Your backup email"}
											errorMessage={
												errorMessage.secondary_email
											}
											isError={isError.secondary_email}
											onChangeFunction={
												onRegisterInputChange
											}
											value={
												userRegisterInput.secondary_email
											}
											className={"animate-fadeIn"}
										/>
										<div className="animate-fadeIn">
											<span className="text-neutral-500 italic">
												Already have an account?{" "}
											</span>
											<Link
												to={"/register"}
												className="italic">
												<span className=" underline-offset-4 text-accent hover:underline">
													Login{" "}
												</span>
												<span className="text-neutral-500">
													&gt;
												</span>
											</Link>
										</div>
									</>
								)}
								{progressIndex == 1 && (
									<>
										<AuthFormInputField
											name={"username"}
											type={"text"}
											label={"Username"}
											placeholder={"Your username"}
											errorMessage={errorMessage.username}
											isError={isError.username}
											onChangeFunction={
												onRegisterInputChange
											}
											value={userRegisterInput.username}
											className={"animate-fadeIn"}
										/>
										<AuthFormInputField
											name={"phone"}
											type={"text"}
											label={"Phone Number"}
											placeholder={"Your mobile number"}
											errorMessage={errorMessage.phone}
											isError={isError.phone}
											onChangeFunction={
												onRegisterInputChange
											}
											value={userRegisterInput.phone}
											className={"animate-fadeIn"}
										/>
									</>
								)}
								{progressIndex == 2 && (
									<>
										<AuthFormInputField
											name={"password"}
											type={"password"}
											label={"Password"}
											placeholder={"Your password"}
											errorMessage={errorMessage.password}
											isError={isError.password}
											onChangeFunction={
												onRegisterInputChange
											}
											value={userRegisterInput.password}
											className={"animate-fadeIn"}
										/>
										<AuthFormInputField
											name={"confirm_password"}
											type={"password"}
											label={"Confirm Password"}
											placeholder={
												"Type your password again"
											}
											errorMessage={null}
											isError={null}
											onChangeFunction={
												onRegisterInputChange
											}
											value={
												userRegisterInput.confirm_password
											}
											className={"animate-fadeIn"}
										/>
									</>
								)}
							</div>
						</div>
						<footer className="flex flex-col gap-12 w-full">
							<div className="flex flex-row justify-between w-full">
								<Button
									type="button"
									onClick={onReturnButtonClick}
									className={
										"transition-transform px-4 py-2 bg-neutral-300 rounded-lg hover:scale-105"
									}>
									<h6 className="text-white font-medium">
										Return
									</h6>
								</Button>{" "}
								{progressIndex == 2 ? (
									<ButtonFormComponent
										oldWidth={"w-40"}
										newWidth={"hover:w-44"}
										className={"bg-accent"}
										onClickFunction={onRegisterInputSubmit}>
										<h6 className="text-white font-medium">
											Register Now!
										</h6>
										{isLoading ? (
											<img
												src="/src/assets/icons/loading-circle.svg"
												alt="loading circle icon"
												className={`absolute w-4 h-4 transition-all left-36 animate-spin`}
											/>
										) : isLoggedIn ? (
											<img
												src="/src/assets/icons/checkmark.svg"
												alt="checkmark icon"
												className="absolute w-4 h-4 transition-all left-36 animate-ping"
											/>
										) : (
											<img
												src="/src/assets/icons/right-arrow-icon.svg"
												alt="right arrow"
												className="top-1/2 left-28 -translate-y-1/2 transition-transform duration-200 absolute w-7 h-7 opacity-0 delay-0 group-hover:delay-75 group-hover:translate-x-7 group-hover:opacity-100"
											/>
										)}
									</ButtonFormComponent>
								) : (
									<Button
										type="button"
										onClick={onProgressButtonClick}
										className={
											"transition-transform px-6 py-2 bg-accent rounded-lg hover:scale-105"
										}>
										<h6 className="text-white font-medium">
											Continue
										</h6>
									</Button>
								)}
							</div>
							<div className="flex flex-col gap-4">
								<hr className="border-[0.25px] border-netral-100/50" />
								<div className="w-full flex flex-row gap-8 justify-center items-center">
									<p className="text-base text-neutral-500">
										Steps {progressIndex + 1} of 3
									</p>
									<div className="flex flex-row gap-7 justify-center items-center">
										<div
											className={`w-3 h-3 rounded-full  ${
												progressIndex == 0
													? "bg-accent animate-pulse"
													: "bg-neutral-200"
											}`}></div>
										<div
											className={`w-3 h-3 rounded-full ${
												progressIndex == 1
													? "bg-accent animate-pulse"
													: "bg-neutral-200"
											}`}></div>
										<div
											className={`w-3 h-3 rounded-full ${
												progressIndex == 2
													? "bg-accent animate-pulse"
													: "bg-neutral-200"
											}`}></div>
									</div>
								</div>
							</div>
						</footer>
					</div>
				</div>
			</Section>
		</>
	);
}

export default Register;
