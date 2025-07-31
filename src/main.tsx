import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home.tsx';
import NotFound from './NotFound.tsx';
import MainAppLayout from './layout.tsx';
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
		Component: MainAppLayout,
		errorElement: (<MainAppLayout><ErrorBoundary /></MainAppLayout>),
		children: [
			{
				index: true,
				Component: Home,
			},
		]
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
