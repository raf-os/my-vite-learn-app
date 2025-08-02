import { cn } from "@/lib/utils";
import { useFormElement } from "./ComplexForm";

export function Label({
    children,
    className,
    ...rest
}: React.ComponentPropsWithRef<'label'>) {
    return (
        <label
        className={cn(
            "text-sm font-bold ml-2",
            className
        )}
            {...rest}
        >
            {children}
        </label>
    )
}

export function Input({
    label="No Label",
    name,
    className,
    placeholder
}: {
    label?: string,
    name: string,
    className?: string,
    placeholder?: string,
}) {
    const {register} = useFormElement();
    return (
        <div
            className="flex flex-col gap-0.5"
        >
            {label && (
                <Label>
                    {label}
                </Label>
            )}
            <input
                {...register({
                    name: name,
                    metadata: {
                        label: label
                    }
                })}
                className={cn(
                    "input-default",
                    className
                )}
                placeholder={placeholder}
            />
        </div>
    )
}