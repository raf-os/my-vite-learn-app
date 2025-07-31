import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import NotFound from './NotFound.tsx';
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
	isRouteErrorResponse
} from "react-router";

export function ErrorBoundary() {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) {
		switch(error.status) {
			case 404:
				return <NotFound />;
			default:
				return (
					<div>
						<p>Error: {error.status}</p>
						<p>{error.statusText}</p>
					</div>
				);
		}
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
	</StrictMode>
)
