import { cn } from "@/lib/utils";

type tDIV = React.ComponentPropsWithRef<'div'>;

type TExpositionBlockRoot = tDIV;
type TExpositionBlockHeader = tDIV;
type TExpositionBlockContent = tDIV;

export const ExpositionBlock = {
    Root({
        children,
        className,
        ...rest
    }: TExpositionBlockRoot) {
        return (
            <div
                className={cn(
                    "flex flex-col rounded-box border border-neutral-200 bg-neutral-50 shadow-md overflow-hidden",
                    className
                )}
                {...rest}
            >
                { children }
            </div>
        )
    },

    Header({
        children,
        className,
        ...rest
    }: TExpositionBlockHeader) {
        return (
            <div
                className={cn(
                    "flex bg-slate-200 m-2 mb-0 rounded-box px-4 py-3 text-xl font-semibold text-blue-700",
                    className
                )}
                {...rest}
            >
                { children }
            </div>
        )
    },

    Content({
        children,
        className,
        ...rest
    }: TExpositionBlockContent) {
        return (
            <div
                className={cn(
                    "flex flex-col gap-3 px-4 py-4 opacity-75",
                    className
                )}
                {...rest}
            >
                { children }
            </div>
        )
    },
}