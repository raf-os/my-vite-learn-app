import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

/**
 * @todo MOVE ROUTING TO SEPARATE FILE
 */
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
				lazy: async () => {
					const Home = await import("@/Home.tsx");
					return { Component: Home.default }
				}
			}, {
				path: "form-submission-override/",
				lazy: async() => {
					const FormOverridePage = await import("@/examples/form-submission-override/page.tsx");
					return { Component: FormOverridePage.default }
				}
			}, {
				path: "drag-n-drop/",
				lazy: async() => {
					const DragNDropPage = await import("@/examples/drag-n-drop/page.tsx");
					return { Component: DragNDropPage.default }
				}
			}, {
				path: "node-coding-ui/",
				lazy: async() => {
					const NodeCodingUIPage = await import("@/examples/node-coding-gui");
					return { Component: NodeCodingUIPage.default }
				}
			}, {
				path: "pragmatic-dnd/",
				lazy: async() => {
					const PragmaticDNDPage = await import("@/examples/pragmatic-dnd");
					return { Component: PragmaticDNDPage.default }
				}
			}
		]
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
