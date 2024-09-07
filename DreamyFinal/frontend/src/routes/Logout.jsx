import React from "react";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

function Logout() {
	useEffect(() => {
		logout();
	}, []);

	return (
		<>
			<Header />
			<Section>
				<h1>Logout</h1>
				<Link to={"/"}>
					<h3>Return to homepage</h3>
				</Link>
			</Section>
		</>
	);
}

export default Logout;
