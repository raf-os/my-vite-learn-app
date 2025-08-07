import { useDraggable, type UseDraggableInput } from "@dnd-kit/react";
import { cn } from "@/lib/utils";
import { createContext, useContext, useEffect, useRef } from "react";
import { Grip } from "lucide-react";

export interface IBaseDraggableProps extends React.ComponentPropsWithRef<'div'> {
    uniqueID: string,
    data?: Record<string, any>,
}

type TBaseDraggableContext = UseDraggableInput;
const BaseDraggableContext = createContext<TBaseDraggableContext>({id:"%%ERROR%%"});

export default function BaseDraggable({
    children,
    className,
    uniqueID,
    data,
    ref,
    ...rest
}: IBaseDraggableProps) {
    const draggableConfigs: UseDraggableInput = {
        id: uniqueID,
        data: data,
    };
    const internalRef = useRef<HTMLDivElement>(null);

    const { ref: draggableRef } = useDraggable(draggableConfigs);

    useEffect(() => {
        if (internalRef.current) {
            ref = internalRef;
            draggableRef(internalRef.current);
        }
    }, [internalRef]);

    return (
        <BaseDraggableContext.Provider value={draggableConfigs}>
            <div
                ref={internalRef}
                className={cn(
                    "flex flex-col",
                    className
                )}
                {...rest}
            >
                { children }
            </div>
        </BaseDraggableContext.Provider>
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
    const { handleRef } = useDraggable(dragConfig);

    return (
        <div
            ref={handleRef}
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
