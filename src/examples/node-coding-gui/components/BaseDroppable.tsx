import { useDroppable } from "@dnd-kit/react";
import { cn } from "@/lib/utils";

export interface IBaseDroppableProps extends React.ComponentPropsWithRef<'div'> {
    uniqueID: string,
    data?: Record<string, any>
}

export default function BaseDroppable({
    uniqueID,
    className,
    children,
    data
}: IBaseDroppableProps) {
    const droppable = useDroppable({
        id: uniqueID,
        data: data
    });

    return (
        <div
            ref={droppable.ref}
            className={cn(
                "",
                className
            )}
        >
            {children}
        </div>
    )
}