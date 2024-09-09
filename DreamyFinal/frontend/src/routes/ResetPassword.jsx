import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import AuthPageHeader from "../components/AuthPageHeader";
import Section from "../components/Section";
import AuthFormInputField from "../components/AuthFormInputField";
import {
	safeguardFromSpecialChars,
	safeguardFromWrongEmailFormat,
} from "../utils/safeguard";
import axiosInstance from "../utils/axiosInstance";

function ResetPassword() {
	// navigator
	const navigate = useNavigate();

	// progress management state
	const tabsNumber = 2;
	const [progressIndex, setProgressIndex] = useState(0);

	// define event for continue and return button
	const handleNext = () => {
		setProgressIndex((prevIndex) => {
			if (prevIndex < tabsNumber - 1) return prevIndex + 1;
			else return prevIndex;
		});
	};

	const handlePrevious = () => {
		setProgressIndex((prevIndex) => {
			if (prevIndex > 0) return prevIndex - 1;
			else return prevIndex;
		});
	};

	// initialize loading state
	const [isLoading, setIsLoading] = useState(false);

	// initialize error state and error message
	const [isError, setIsError] = useState({
		username: false,
		email: false,
	});

	const [errorMessage, setErrorMessage] = useState({
		username: "",
		email: "",
	});

	// initialize input state to collect inputs
	const [userResetInput, setUserResetInput] = useState({
		username: "",
		email: "",
	});

	// define event for collecting input from fields
	const onResetInputChange = (e) => {
		const name = e.currentTarget.name;
		const value = e.currentTarget.value;

		// safeguard and set state for all input field
		if (name == "username") {
			if (value == "") {
				setIsError({
					...isError,
					username: false,
				});
			} else if (safeguardFromSpecialChars(value)) {
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
			if (value == "") {
				setIsError({
					...isError,
					email: false,
				});
			} else if (safeguardFromWrongEmailFormat(value)) {
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
		}

		setUserResetInput({
			...userResetInput,
			[name]: value,
		});

		console.log(userResetInput);
	};

	// define event to send OTP
	const onSendOTPButtonClick = async () => {
		// check for remaining errors
		Object.entries(isError).forEach(([key, value]) => {
			if (value == true) return;
		});

		// check for empty fields
		if (userResetInput.username == "" || !userResetInput.username) {
			setIsError({
				...isError,
				username: true,
			});
			setErrorMessage({
				...errorMessage,
				username: "Username cannot be empty",
			});
			return;
		} else if (userResetInput.email == "" || !userResetInput.email) {
			setIsError({
				...isError,
				email: true,
			});
			setErrorMessage({
				...errorMessage,
				email: "Email cannot be empty",
			});
			return;
		}

		// initialize form data
		const registerFormData = new FormData();

		Object.entries(userResetInput).forEach(([key, value]) => {
			registerFormData.append(key, value);
		});

		// call send OTP function
		try {
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<AuthPageHeader />
			<Section
				color={"secondary"}
				py_override={true}
				className={"py-16 w-full h-dvh"}>
				<div className="px-24 gap-24 w-full h-full">
					<div className="h-[550px] flex flex-col gap-12 justify-between items-center px-12 py-12 w-1/2 mx-auto bg-white rounded-lg shadow-lg">
						<div className="w-full flex flex-col gap-12">
							<div className="w-full">
								<h2 className="text-center font-medium text-accent">
									Forgot your password?
								</h2>
							</div>
							<div className="flex flex-col gap-8 justify-start items-start">
								{progressIndex == 0 && (
									<>
										<AuthFormInputField
											name={"username"}
											type={"text"}
											label={"Registered Username"}
											placeholder={"Your username"}
											errorMessage={errorMessage.username}
											isError={isError.username}
											onChangeFunction={
												onResetInputChange
											}
											value={userResetInput.username}
											className={"animate-fadeIn"}
										/>
										<AuthFormInputField
											name={"email"}
											type={"text"}
											label={"Registered Email"}
											placeholder={"Your email"}
											errorMessage={errorMessage.email}
											isError={isError.email}
											onChangeFunction={
												onResetInputChange
											}
											value={userResetInput.email}
											className={"animate-fadeIn"}
										/>
										<div className="animate-fadeIn">
											<span className="text-neutral-500 italic">
												Remebered your password? Return
												to{" "}
											</span>
											<Link
												to={"/login"}
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
											name={"otp"}
											type={"text"}
											label={"OTP we sent"}
											placeholder={"Your OTP"}
											errorMessage={null}
											isError={null}
											onChangeFunction={null}
											value={null}
											className={"animate-fadeIn"}
										/>
									</>
								)}
							</div>
						</div>
						<div className="w-full flex flex-row items-center justify-between">
							<Button
								type="button"
								onClick={handlePrevious}
								className={
									"shadow-md transition-transform px-4 py-2 bg-neutral-300 rounded-lg hover:scale-105"
								}>
								<h6 className="text-white font-medium">
									Return
								</h6>
							</Button>
							{progressIndex == 0 ? (
								<Button
									type="button"
									onClick={onSendOTPButtonClick}
									className={
										"shadow-md transition-transform px-10 py-2 bg-accent rounded-lg hover:scale-105"
									}>
									<h6 className="text-white font-medium">
										Send OTP
									</h6>
								</Button>
							) : (
								<Button
									type="button"
									onClick={null}
									className={
										"shadow-md transition-transform px-10 py-2 bg-accent rounded-lg hover:scale-105"
									}>
									<h6 className="text-white font-medium">
										Reset Password
									</h6>
								</Button>
							)}
						</div>
					</div>
				</div>
			</Section>
		</>
	);
}

export default ResetPassword;
