import { Outlet } from "react-router";
import './index.css';

export default function MainAppLayout({children}: {children?: React.ReactNode}) {
    return (
        <div>
            <div>Main Layout</div>
            { children ? children : <Outlet /> }
        </div>
    );
}