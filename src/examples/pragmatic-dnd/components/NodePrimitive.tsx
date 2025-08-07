import { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { type BaseEventPayload, type ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/types";
import { Coordinate, TAppLayers } from "../types";
import { isDropTargetValid, configBlockData } from "../utils";
import { cn } from "@/lib/utils";

type EventPayloadWithDelta = BaseEventPayload<ElementDragType> & {
    delta: Coordinate,
}

export interface INodePrimitive extends React.ComponentPropsWithoutRef<'div'> {
    onPanelDrop?: (payload: EventPayloadWithDelta) => void,
    onSpaceDrop?: (payload: EventPayloadWithDelta) => void,
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
    const dragDelta = useRef<Coordinate>(new Coordinate());
    const [ isDragging, setIsDragging ] = useState<boolean>(false);

    const blockData = configBlockData({
        type: "preset-block",
        layer: TAppLayers.Space
    })

    const styleOverride = {
        ...style,
        opacity: isDragging?"50%":"100%"
    }

    useEffect(() => {
        if (ref.current) {
            const element = ref.current;

            return draggable({
                element: element,
                getInitialData: () => (blockData),
                onDragStart: (payload) => {
                    setIsDragging(true);
                    const iRect = ref.current?.getBoundingClientRect();
                    const rectPos = new Coordinate(iRect?.x, iRect?.y);

                    const inputData = payload.location.initial.input;
                    const initialDragLocation = new Coordinate(inputData.pageX, inputData.pageY);
                    const delta = initialDragLocation.subtract(rectPos);

                    dragDelta.current = delta;
                },
                onDrop: (payload) => {
                    const { location } = payload;
                    const newPayload = {
                        ...payload,
                        delta: dragDelta.current,
                    }
                    setIsDragging(false);
                    if (isDropTargetValid(location, TAppLayers.Panel)) {
                        onPanelDrop!(newPayload);
                    } else if (isDropTargetValid(location, TAppLayers.Space)) {
                        onSpaceDrop!(newPayload);
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