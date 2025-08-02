import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home.tsx';
import FormBehaviorOverridePage from '@/examples/form-submission-override/page.tsx';
import DragNDropPage from './examples/drag-n-drop/page.tsx';
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
			<div className="flex flex-col gap-1 w-full md:w-[900px]">
				<div className="text-xl font-bold text-red-400">
					Error caught
				</div>
				<div className="font-medium">
					{error.message}
				</div>
				<div className="px-4 py-3 bg-slate-200 rounded-box">
					{error.stack}
				</div>
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
		errorElement: (
			<MainAppLayout>
				<ErrorBoundary />
			</MainAppLayout>
			),
		children: [
			{
				index: true,
				Component: Home,
			}, {
				path: "form-submission-override/",
				Component: FormBehaviorOverridePage,
			}, {
				path: "drag-n-drop/",
				Component: DragNDropPage
			}
		]
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
