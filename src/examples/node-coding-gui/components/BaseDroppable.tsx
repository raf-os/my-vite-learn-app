import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export interface IBaseDroppableProps extends React.ComponentPropsWithRef<'div'> {
    uniqueID: string,
}

export default function BaseDroppable({
    uniqueID,
    className,
    children
}: IBaseDroppableProps) {
    const { setNodeRef } = useDroppable({
        id: uniqueID,
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