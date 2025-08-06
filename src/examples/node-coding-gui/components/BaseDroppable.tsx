import { useDroppable } from "@dnd-kit/core";
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
    const { setNodeRef } = useDroppable({
        id: uniqueID,
        data: data
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "",
                className
            )}
        >
            {children}
        </div>
    )
}