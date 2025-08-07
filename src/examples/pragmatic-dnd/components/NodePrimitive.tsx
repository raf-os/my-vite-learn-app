import { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { type DragLocationHistory, type BaseEventPayload, type ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/types";
import { Coordinate } from "../types";
import { cn } from "@/lib/utils";

export interface INodePrimitive extends React.ComponentPropsWithoutRef<'div'> {
    onPanelDrop?: (payload: BaseEventPayload<ElementDragType>) => void,
    onSpaceDrop?: (payload: BaseEventPayload<ElementDragType>) => void,
}

export default function NodePrimitive({
    children,
    style,
    className,
    onPanelDrop,
    onSpaceDrop,
    ...rest
}: INodePrimitive) {
    const ref = useRef<HTMLDivElement>(null);
    const [ isDragging, setIsDragging ] = useState<boolean>(false);

    const styleOverride = {
        ...style,
        opacity: isDragging?"50%":"100%"
    }

    const getCurrentTarget = (location: DragLocationHistory) => location.current.dropTargets.at(0);

    const isTargetValid = (location: DragLocationHistory, check: string) => {
        const currentTarget = getCurrentTarget(location);
        return (currentTarget?.data['type'] === check);
    }

    useEffect(() => {
        if (ref.current) {
            const element = ref.current;

            return draggable({
                element: element,
                getInitialData: () => ({ type: "preset" }),
                onDragStart: (payload) => {
                    setIsDragging(true);
                    const iRect = ref.current?.getBoundingClientRect();
                    const rectPos = new Coordinate(iRect?.x, iRect?.y);

                    const inputData = payload.location.initial.input;
                    const initialDragLocation = new Coordinate(inputData.pageX, inputData.pageY);
                    const delta = initialDragLocation.subtract(rectPos);

                    console.log("Delta: ", delta.getLocation());
                },
                onDrop: (payload) => {
                    const { location } = payload;
                    setIsDragging(false);
                    if (isTargetValid(location, "node-panel")) {
                        onPanelDrop!(payload);
                    } else if (isTargetValid(location, "node-space")) {
                        onSpaceDrop!(payload);
                    }
                },
            });
        }
    }, []);

    return (
        <div
            className={cn(
                "",
                className?className:"bg-amber-200 rounded-box p-2"
            )}
            style={styleOverride}
            ref={ref}
            {...rest}
        >
            { children }
        </div>
    )
}