import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import Login from "./routes/Login";
import Register from "./routes/Register";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
	},
	{
		path: "login/",
		element: <Login />,
	},
	{
		path: "register/",
		element: <Register />,
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
