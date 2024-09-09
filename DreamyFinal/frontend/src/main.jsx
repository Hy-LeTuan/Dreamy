import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import ResetPassword from "./routes/ResetPassword";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
	},
	{
		path: "register/",
		element: <Register />,
	},
	{
		path: "login/",
		element: <Login />,
	},
	{
		path: "logout/",
		element: <Logout />,
	},
	{
		path: "reset-password/",
		element: <ResetPassword />,
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
