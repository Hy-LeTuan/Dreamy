import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Section from "../components/Section";
import AuthPageHeader from "../components/AuthPageHeader.jsx";
import ButtonFormComponent from "../components/ButtonFormComponent.jsx";
import AuthFormInputField from "../components/AuthFormInputField.jsx";
import useAuthStore from "../store/authStore.js";
import { login } from "../utils/auth.js";
import { safeguardFromSpecialChars } from "../utils/safeguard.js";
import { delayExecution } from "../utils/utils.js";

function Login() {
	// navigate hooko
	const navigate = useNavigate();

	// logged in state
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	// logged in state
	const [isLoading, setIsLoading] = useState(false);

	// input state to collect inputs
	const [userLoginInput, setUserLoginInput] = useState({
		username: null,
		password: null,
	});

	// initialize error state and error message
	const [isError, setIsError] = useState({
		username: false,
		password: false,
	});
	const [errorMessage, setErrorMessage] = useState({
		username: false,
		password: false,
	});

	// event for login input change
	const onLoginInputChange = (e) => {
		// check for special symbols when typing for better design
		if (e.currentTarget.name == "username") {
			if (safeguardFromSpecialChars(e.currentTarget.value)) {
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
		} else if (e.currentTarget.name == "password") {
			setIsError({
				...isError,
				password: false,
			});
		}

		// set input value regardless
		setUserLoginInput({
			...userLoginInput,
			[e.currentTarget.name]: e.currentTarget.value,
		});
	};

	// event for login submit button pressed
	const onLoginInputSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const username = userLoginInput.username;
		const password = userLoginInput.password;

		// check for empty username
		if (username == "" || !username) {
			setIsError({
				...isError,
				username: true,
			});
			setErrorMessage({
				...errorMessage,
				username: "Username cannot be empty",
			});
			return;
		}

		try {
			setIsLoading(true);

			const response = await login({
				username: [username],
				password: [password],
			});

			if (response.status == "success") {
				setIsLoading(false);
				setIsError({
					...isError,
					username: false,
					password: false,
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
				password: true,
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
							Welcome Back
						</h2>
						<p className="text-neutral-500 text-base">
							Our goal is to help you pass every exam and ace
							every test. Login now to never miss any information
							again and let's get back to learning
						</p>
					</div>
					<div className="col-span-1 bg-white flex flex-col items-start justify-between py-10 px-12 gap-10 rounded-xl">
						<h2 className="font-medium text-accent">
							Login Information
						</h2>
						<div className="w-full flex flex-col items-start justify-start gap-8">
							<div className="flex flex-col gap-6 w-full">
								<AuthFormInputField
									name={"username"}
									type={"text"}
									label={"Username"}
									placeholder={"Your username"}
									errorMessage={errorMessage.username}
									isError={isError.username}
									onChangeFunction={onLoginInputChange}
									value={userLoginInput.username}
								/>
								<AuthFormInputField
									name={"password"}
									type={"password"}
									label={"Password"}
									placeholder={"Your password"}
									errorMessage={errorMessage.password}
									isError={isError.password}
									onChangeFunction={onLoginInputChange}
									value={userLoginInput.password}
								/>
								<Link
									to={"/reset-password"}
									className="italic text-neutral-500">
									Forgot your password?
								</Link>
							</div>
							<ButtonFormComponent
								oldWidth={"w-32"}
								newWidth={"hover:w-40"}
								className={"bg-accent"}
								onClickFunction={onLoginInputSubmit}>
								<h6 className="text-white font-medium">
									Login Now!
								</h6>
								{isLoading ? (
									<img
										src="/src/assets/icons/loading-circle.svg"
										alt="loading circle icon"
										className={`absolute w-4 h-4 transition-all left-32 animate-spin`}
									/>
								) : isLoggedIn ? (
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="checkmark icon"
										className="absolute w-4 h-4 transition-all left-32 animate-ping"
									/>
								) : (
									<img
										src="/src/assets/icons/right-arrow-icon.svg"
										alt="right arrow"
										className="top-1/2 left-20 -translate-y-1/2 transition-transform duration-200 absolute w-7 h-7 opacity-0 delay-0 group-hover:delay-75 group-hover:translate-x-9 group-hover:opacity-100"
									/>
								)}
							</ButtonFormComponent>
						</div>
						<div>
							<span className="text-neutral-500 italic">
								Don't have an account?{" "}
							</span>
							<Link to={"/register"} className="italic">
								<span className=" underline-offset-4 text-accent hover:underline text-base">
									Create account{" "}
								</span>
								<span className="text-neutral-500">&gt;</span>
							</Link>
						</div>
					</div>
				</div>
			</Section>
		</>
	);
}

export default Login;
