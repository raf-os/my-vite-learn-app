import { cn } from "@/lib/utils"

export const PageLayout = {
    Root({
        children,
        className,
        ...rest
    }: React.ComponentPropsWithRef<'div'>){
        return (
            <div
                {...rest}
                className={cn(
                    "flex flex-col w-full px-4 md:px-0 md:w-[800px]",
                    className
                )}
            >
                { children }
            </div>
        )
    }
}