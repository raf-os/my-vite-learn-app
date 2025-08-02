import { NavLink } from "react-router";
import { cn } from "@lib/utils";

export default function Link({
    className,
    children,
    ...rest
}: React.ComponentPropsWithRef<typeof NavLink>) {
    return (
        <NavLink
            {...rest}
            className={cn(
                "text-blue-600 hover:text-blue-800 font-medium",
                className
            )}
        >
            {children}
        </NavLink>
    )
}