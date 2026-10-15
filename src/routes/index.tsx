import { type RouteObject, useRoutes } from "react-router-dom";
import NotFoundPage from "../pages/404";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import FeedPage from "../pages/feed";
import NewVideoPage from "../pages/new";
import WatchVideoPage from "../pages/watch";
import ProtectedRoute from "./protected";

export function AppRoutes() {
	const authRoutes: RouteObject[] = [
		{
			path: "/login",
			element: <LoginPage />,
		},
		{
			path: "/signup",
			element: <RegisterPage />,
		},
	];

	const commonRoutes: RouteObject[] = [
		{
			path: "/",
			element: <FeedPage />,
		},
		{
			path: "/watch/:videoId",
			element: <WatchVideoPage />,
		},
		{
			path: "/*",
			element: <NotFoundPage />,
		},
	];

	const guardedRoutes: RouteObject[] = [
		{
			path: "/new",
			element: <NewVideoPage />,
		},
	];
	const routes: RouteObject[] = [
		...authRoutes,
		...commonRoutes,
		{ element: <ProtectedRoute />, children: guardedRoutes },
	];

	return <>{useRoutes(routes)}</>;
}
