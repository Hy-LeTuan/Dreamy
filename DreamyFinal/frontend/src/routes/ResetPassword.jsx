import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field, Input } from "@headlessui/react";
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

	// user object to validate information after entering correct email and username and received an otp
	const [tempUserResetPassword, setTempUserResetPassword] = useState({
		user_id: null,
		username: null,
		email: null,
		secondary_email: null,
		phone: null,
	});

	// progress management state
	const tabsNumber = 4;
	const [progressIndex, setProgressIndex] = useState(0);

	// initialize input state to collect inputs
	const [userResetInput, setUserResetInput] = useState({
		username: "",
		email: "",
		password: "",
		confirm_password: "",
	});

	// initialize loading state
	const [isLoading, setIsLoading] = useState(false);

	// initialize otp sent state for navigation between tabs
	const [isOTPReceived, setIsOTPReceived] = useState(false);

	// initialize error state and error message
	const [isError, setIsError] = useState({
		username: false,
		email: false,
		password: false,
		confirm_password: false,
		connection: false,
		otp: false,
	});

	const [errorMessage, setErrorMessage] = useState({
		username: "",
		email: "",
		password: "",
		confirm_password: "",
		otp: "",
	});

	// define event for continue and return button
	const handleNext = () => {
		// validate correct password before allowing user to continue to ensure there is no need to return after pressing continue
		if (userResetInput.password && userResetInput.confirm_password) {
			if (userResetInput.password !== userResetInput.confirm_password) {
				setIsError({
					...isError,
					confirm_password: true,
				});

				setErrorMessage({
					...errorMessage,
					confirm_password: "Password does not match",
				});
			} else {
				setIsError({
					...isError,
					password: false,
					confirm_password: false,
				});

				setErrorMessage({
					...errorMessage,
					password: "",
					confirm_password: "",
				});

				setProgressIndex((prevIndex) => {
					if (prevIndex < tabsNumber - 1) return prevIndex + 1;
					else return prevIndex;
				});
			}
		} else {
			setIsError({ ...isError, confirm_password: true, password: true });
			setErrorMessage({
				...errorMessage,
				confirm_password: "Password and confirmation cannot be empty",
			});
		}
	};

	const handlePrevious = () => {
		setProgressIndex((prevIndex) => {
			if (prevIndex > 0) return prevIndex - 1;
			else return prevIndex;
		});
	};

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
	};

	// define event to send OTP
	const onSendOTPButtonClick = async () => {
		// set loading state
		setIsLoading(true);

		// set connection error state
		setIsError({
			...isError,
			otp: false,
		});

		setErrorMessage({
			...errorMessage,
			otp: "",
		});

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
			setIsLoading(false);
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
			setIsLoading(false);
			return;
		}

		// call send OTP function
		try {
			const response = await axiosInstance.get(
				`users/otp/${userResetInput.username}/${userResetInput.email}`
			);
			console.log(response);

			// set loading state
			setIsLoading(false);
			handleNext();

			console.log(response);

			// set user state after loading state for better speed from UI
			setTempUserResetPassword({
				...tempUserResetPassword,
				user_id: response?.data?.id,
				username: response?.data?.username,
				email: response?.data?.email,
				secondary_email: response?.data?.secondary_email,
				phone: response?.data?.phone,
			});

			// set otp sent state
			setIsOTPReceived(true);
			console.log(tempUserResetPassword);

			if (isError.otp) {
				console.log("OTP is still error here");
			} else {
				console.log("OTP is not error");
			}
		} catch (e) {
			// set loading state
			setIsLoading(false);
			// set otp sent state
			setIsOTPReceived(true);
			const data = e.response?.data;

			console.log(e);

			// set error message and state based on what went wrong
			if (data) {
				if (e.response?.status == 502 || e.code == "ECONNABORTED") {
					// set connection error
					setIsError({
						...isError,
						connection: true,
					});
					return;
				} else {
					console.log(data);
					Object.entries(data).forEach(([key, value]) => {
						if (key == "detail" && value == "Not found.") {
							setErrorMessage({
								...errorMessage,
								username:
									"Username not found, please check your username",
							});
							setIsError({ ...isError, username: true });
						} else {
							setErrorMessage({
								...errorMessage,
								[key]: [value],
							});
							setIsError({ ...isError, [key]: true });
						}
						console.log(
							`Respone data has key of: ${key} and value of: ${value}`
						);
					});
				}
			}
		}
	};

	// define event to control OTP form
	const input1Ref = useRef(null);
	const input2Ref = useRef(null);
	const input3Ref = useRef(null);
	const input4Ref = useRef(null);
	const input5Ref = useRef(null);
	const input6Ref = useRef(null);

	const handleInputChange = (e, nextInputRef) => {
		if (e.target.value.length === 1 && nextInputRef) {
			nextInputRef.current.focus();
		}
	};

	const handleKeyDown = (e, prevInputRef) => {
		if (e.key === "Backspace" && !e.target.value && prevInputRef) {
			prevInputRef.current.focus();
		}
	};

	// define event to reset password
	const onResetPasswordButtonClick = async () => {
		setIsLoading(true);

		// concatenate all input field to form otp string
		const otp =
			input1Ref.current.value +
			input2Ref.current.value +
			input3Ref.current.value +
			input4Ref.current.value +
			input5Ref.current.value +
			input6Ref.current.value;

		try {
			const response = await axiosInstance.patch(
				`users/otp/reset-password/${tempUserResetPassword.user_id}/${otp}`,
				{
					password: userResetInput.password,
				},
				{
					"Content-Type": "application/json",
				}
			);
			console.log(response);
			setIsLoading(false);
			setIsError({
				...isError,
				otp: false,
			});
		} catch (e) {
			setIsLoading(false);
			const data = e.response?.data;
			const status = e.response?.status;

			console.log(`Status: ${status}`);
			if (data) {
				if (status == 400) {
					console.log(data);
					console.log("status 400 encountered");
					setIsError({
						...isError,
						password: true,
						confirm_password: true,
					});

					setErrorMessage({
						...errorMessage,
						password: data.message[0],
					});
					setProgressIndex(0);
				} else if (status == 406) {
					if (data?.timeout) {
						setIsError({
							...isError,
							otp: true,
						});
						setErrorMessage({
							...errorMessage,
							otp: "OTP timed out, please try again :(",
						});
					} else {
						setIsError({
							...isError,
							otp: true,
						});
						setErrorMessage({
							...errorMessage,
							otp: "Incorrect OTP, please try again :(",
						});
					}
				} else {
					setIsError({
						...isError,
						otp: true,
					});
					setErrorMessage({
						...errorMessage,
						otp: "Something went wrong in validating your OTP, please request another OTP and try again",
					});
				}
			}
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
							{progressIndex == 0 && (
								<div className="flex flex-col gap-8 justify-start items-start">
									<AuthFormInputField
										name={"password"}
										type={"password"}
										label={"New Password"}
										placeholder={"Your new password"}
										errorMessage={errorMessage.password}
										isError={isError.password}
										onChangeFunction={onResetInputChange}
										value={userResetInput.password}
										className={"animate-fadeIn"}
									/>
									<AuthFormInputField
										name={"confirm_password"}
										type={"password"}
										label={"Confirm Password"}
										placeholder={"Type your password again"}
										errorMessage={
											errorMessage.confirm_password
										}
										isError={isError.confirm_password}
										onChangeFunction={onResetInputChange}
										value={userResetInput.confirm_password}
										className={"animate-fadeIn"}
									/>
									<div className="animate-fadeIn">
										<span className="text-neutral-500 italic">
											Remebered your password? Return to{" "}
										</span>
										<Link to={"/login"} className="italic">
											<span className=" underline-offset-4 text-accent hover:underline">
												Login{" "}
											</span>
											<span className="text-neutral-500">
												&gt;
											</span>
										</Link>
									</div>
								</div>
							)}
							{progressIndex == 1 && (
								<div className="flex flex-col gap-8 justify-start items-start">
									<AuthFormInputField
										name={"username"}
										type={"text"}
										label={"Registered Username"}
										placeholder={"Your username"}
										errorMessage={errorMessage.username}
										isError={isError.username}
										onChangeFunction={onResetInputChange}
										value={userResetInput.username}
										className={"animate-fadeIn"}
									/>
									<AuthFormInputField
										name={"email"}
										type={"text"}
										label={"Registered Email"}
										placeholder={
											"Your main or secondary email"
										}
										errorMessage={errorMessage.email}
										isError={isError.email}
										onChangeFunction={onResetInputChange}
										value={userResetInput.email}
										className={"animate-fadeIn"}
									/>
									{isError.connection && (
										<div className="animate-fadeIn">
											<span className="text-alert italic">
												Oops, we couldn't send you the
												email for your OTP. Please try
												again :&#40;
											</span>
										</div>
									)}
									{isOTPReceived && (
										<Button
											className={
												"animate-fadeIn me-auto px-3 py-2 rounded-lg bg-sky-300 transition-all disabled:bg-sky-300/80 disabled:hover:scale-100 hover:scale-105 shadow-md"
											}
											onClick={onSendOTPButtonClick}
											disabled={isLoading}>
											<span className="text-white">
												Resend OTP
											</span>
										</Button>
									)}
								</div>
							)}
							{progressIndex == 2 && (
								<>
									<div className="w-full h-[200px] flex flex-col gap-4">
										{isError.otp ? (
											<div className="text-center shadow-sm py-1 px-3 rounded-md w-fit animate-fadeIn text-sm text-white bg-alert">
												{errorMessage.otp}
											</div>
										) : (
											<div className="text-center py-1 px-3 rounded-md w-fit animate-fadeIn text-sm text-neutral-500">
												Enter the OTP you received here
											</div>
										)}

										<div className="w-full flex flex-col gap-8">
											<div className="w-full flex flex-row justify-between items-center">
												<Input
													ref={input1Ref}
													className={
														"animate-fadeIn font-header font-medium text-accent text-center text-3xl w-20 h-24 border-[1px] border-black rounded-lg data-[focus]:border-blue-400"
													}
													type="text"
													maxLength={1}
													onChange={(e) =>
														handleInputChange(
															e,
															input2Ref
														)
													}
												/>
												<Input
													ref={input2Ref}
													className={
														"animate-fadeIn font-header font-medium text-accent text-center text-3xl w-20 h-24 border-[1px] border-black rounded-lg data-[focus]:border-blue-400"
													}
													type="text"
													maxLength={1}
													onChange={(e) =>
														handleInputChange(
															e,
															input3Ref
														)
													}
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															input1Ref
														)
													}
												/>
												<Input
													ref={input3Ref}
													className={
														"animate-fadeIn font-header font-medium text-accent text-center text-3xl w-20 h-24 border-[1px] border-black rounded-lg data-[focus]:border-blue-400"
													}
													type="text"
													maxLength={1}
													onChange={(e) =>
														handleInputChange(
															e,
															input4Ref
														)
													}
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															input2Ref
														)
													}
												/>
											</div>
											<div className="w-full flex flex-row justify-between items-center">
												<Input
													ref={input4Ref}
													className={
														"animate-fadeIn font-header font-medium text-accent text-center text-3xl w-20 h-24 border-[1px] border-black rounded-lg data-[focus]:border-blue-400"
													}
													type="text"
													maxLength={1}
													onChange={(e) =>
														handleInputChange(
															e,
															input5Ref
														)
													}
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															input3Ref
														)
													}
												/>
												<Input
													ref={input5Ref}
													className={
														"animate-fadeIn font-header font-medium text-accent text-center text-3xl w-20 h-24 border-[1px] border-black rounded-lg data-[focus]:border-blue-400"
													}
													type="text"
													maxLength={1}
													onChange={(e) =>
														handleInputChange(
															e,
															input6Ref
														)
													}
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															input4Ref
														)
													}
												/>
												<Input
													ref={input6Ref}
													className={
														"animate-fadeIn font-header font-medium text-accent text-center text-3xl w-20 h-24 border-[1px] border-black rounded-lg data-[focus]:border-blue-400"
													}
													type="text"
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															input5Ref
														)
													}
													maxLength={1}
												/>
											</div>
										</div>
									</div>
								</>
							)}
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
							{progressIndex == 0 && (
								<Button
									type="button"
									onClick={handleNext}
									className={
										"shadow-md transition-transform px-10 py-2 disabled:bg-accent/80 bg-accent rounded-lg hover:scale-105"
									}>
									<h6 className="text-white font-medium">
										Continue
									</h6>
								</Button>
							)}
							{progressIndex == 1 &&
								(isOTPReceived ? (
									<Button
										type="button"
										onClick={handleNext}
										className={
											"shadow-md transition-transform px-10 py-2 disabled:bg-accent/80 bg-accent rounded-lg hover:scale-105"
										}
										disabled={isLoading}>
										<h6 className="text-white font-medium">
											Continue
										</h6>
									</Button>
								) : (
									<Button
										type="button"
										onClick={onSendOTPButtonClick}
										className={
											"shadow-md transition-transform px-10 py-2 disabled:bg-accent/80 bg-accent rounded-lg hover:scale-105"
										}
										disabled={isLoading}>
										<h6 className="text-white font-medium">
											Send OTP
										</h6>
									</Button>
								))}
							{progressIndex == 2 && (
								<Button
									type="button"
									onClick={onResetPasswordButtonClick}
									disabled={isLoading}
									className={
										"shadow-md transition-transform px-10 py-2 disabled:bg-accent/80 bg-accent rounded-lg hover:scale-105"
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
