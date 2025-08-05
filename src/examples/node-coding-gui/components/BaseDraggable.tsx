import { useDraggable, type DraggableSyntheticListeners } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { createContext } from "react";

type IBaseDraggableContext = DraggableSyntheticListeners;

export const BaseDraggableContext = createContext<IBaseDraggableContext>(undefined);

export interface IBaseDraggableProps extends React.ComponentPropsWithRef<'div'> {
    uniqueID: string,
}

export default function BaseDraggable({
    children,
    className,
    uniqueID,
    ...rest
}: IBaseDraggableProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: uniqueID
    });

    const styleOverride = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={{
                userSelect: "none",
                ...styleOverride
            }}
            className={cn(
                "flex flex-col",
                className
            )}
            {...attributes}
            {...rest}
        >
            <BaseDraggableContext.Provider value={listeners}>
                { children }
            </BaseDraggableContext.Provider>
        </div>
    )
}
