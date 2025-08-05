import { useDraggable, type UseDraggableArguments } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { createContext, useContext } from "react";
import { Grip } from "lucide-react";

type IBaseDraggableContext = UseDraggableArguments;

export const BaseDraggableContext = createContext<IBaseDraggableContext>({ id: "%%%ERROR%%% "});

export interface IBaseDraggableProps extends React.ComponentPropsWithRef<'div'> {
    uniqueID: string,
    data?: Record<string, any>,
}

export default function BaseDraggable({
    children,
    className,
    uniqueID,
    data,
    ...rest
}: IBaseDraggableProps) {
    const draggableConfigs: UseDraggableArguments = {
        id: uniqueID,
        data: data,
    };

    const { attributes, setNodeRef, transform } = useDraggable(draggableConfigs);

    const styleOverride = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={{
                ...styleOverride
            }}
            className={cn(
                "flex flex-col",
                className
            )}
            {...attributes}
            {...rest}
        >
            <BaseDraggableContext value={draggableConfigs}>
                { children }
            </BaseDraggableContext>
        </div>
    )
}

export interface IDraggableHandlerWrapperProps extends React.ComponentPropsWithRef<'div'> {
    hideIcon?: boolean,
}

export function DraggableHandlerWrapper({
    children,
    className,
    hideIcon = false,
    ...rest
}: IDraggableHandlerWrapperProps) {
    const dragConfig = useContext(BaseDraggableContext);
    const { listeners } = useDraggable(dragConfig);

    return (
        <div
            {...listeners}
            data-slot="draggable-handle"
            className={cn(
                "select-none cursor-pointer",
                !hideIcon && "flex flex-nowrap items-center gap-1.5",
                className
            )}
            {...rest}
        >
            { hideIcon?
                children :
                (
                    <>
                        <div
                            className="border p-px rounded-sm"
                            data-slot="draggable-handle-icon"
                        >
                            <Grip
                                className="size-4 grow-0 shrink-0"
                            />
                        </div>

                        <div
                            className="grow-1 shrink-1"
                            data-slot="draggable-handle-text"
                        >
                            { children }
                        </div>
                    </>
                )
            }
        </div>
    )
}
