import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
	isRouteErrorResponse
} from "react-router";

export function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				Route error response
			</div>
		)
	} else if (error instanceof Error) {
		return (
			<div>
				Regular error response
			</div>
		)
	} else {
		<div>
			Unknown error response
		</div>
	}
}

const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		ErrorBoundary: ErrorBoundary
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
