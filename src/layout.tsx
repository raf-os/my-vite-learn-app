import { Outlet } from "react-router";
import './styles/globals.css';

export default function MainAppLayout({children}: {children?: React.ReactNode}) {
    return (
        <div
            className="flex flex-col items-center min-h-dvh"
        >
            <div className="w-full flex justify-center bg-gray-700 p-4 mb-6">
                <div className="text-neutral-50 font-bold text-2xl">
                    <a href="/">
                        Vite + React Playground
                    </a>
                </div>
            </div>
            { children ? children : <Outlet /> }
        </div>
    );
}