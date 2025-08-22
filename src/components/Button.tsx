import { cn } from "@/lib/utils"

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {

}

export default function Button({
    children,
    className,
    type="button",
    ...rest
}: ButtonProps) {
    return (
        <button
            className={cn(
                "",
                className
            )}
            type={type}
            {...rest}
        >
            { children }
        </button>
    )
}