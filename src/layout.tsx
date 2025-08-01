import { Outlet } from "react-router";
import './index.css';

export default function MainAppLayout({children}: {children?: React.ReactNode}) {
    return (
        <div
            className="flex flex-col items-center"
        >
            <div className="w-full flex justify-center bg-slate-600 p-4 mb-2">
                <div className="text-neutral-50 font-bold text-2xl">
                    Vite + React Playground
                </div>
            </div>
            { children ? children : <Outlet /> }
        </div>
    );
}