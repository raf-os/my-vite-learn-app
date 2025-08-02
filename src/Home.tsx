import { NavLink } from "react-router"

export default function Home() {
    return (
        <>
            <div>Main Page</div>
            <div>
                <NavLink to="/form-submission-override">
                    form override test
                </NavLink>
            </div>
        </>
    )
}