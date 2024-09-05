import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosInstance from "./axiosInstance";
import useAuthStore from "../store/authStore";

const decodeTokenAndSetStore = (accessToken) => {
	const decoded = jwtDecode(accessToken);

	const user = {
		id: decoded.user_id,
		username: decoded.username,
		email: decoded.email,
	};

	useAuthStore.setState({ user: user });
};

const saveToken = (accessToken, refreshToken) => {
	Cookies.set("access", accessToken, {
		expires: 1,
		secure: true,
	});

	Cookies.set("refresh", refreshToken, {
		expires: 3,
		secure: true,
	});
};

export const isAccessTokenExpired = (accessToken) => {
	try {
		const decodedToken = jwtDecode(accessToken);
		return decodedToken.exp < Date.now() / 100;
	} catch (error) {
		console.log(error);
		return true;
	}
};

const getRefreshToken = () => {};

const login = async (data) => {
	const username = data.username;
	const password = data.password;

	if (!password || !username) {
		throw new Error("username or password is null");
	}

	// set username and password
	const formData = new FormData();
	formData.append("username", username);
	formData.append("password", password);

	try {
		const response = await axiosInstance.post("users/token", formData);

		// get jwt token
		const accessToken = response.data["access"];
		const refreshToken = response.data["refresh"];

		// save jwt token
		saveToken(accessToken, refreshToken);

		// decode and set to auth store
		decodeTokenAndSetStore(accessToken);

		return response;
	} catch (e) {
		if (e.response?.status == 401) {
			throw new Error("Username and password does not match");
		}
	}
};

const logout = () => {
	Cookies.remove("access");
	Cookies.remove("refresh");

	useAuthStore.setState({ user: null });
};

export { login };
