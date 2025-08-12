import { useRef, useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { type BaseEventPayload, type ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/types";
import { Coordinate, TAppLayers } from "../types";
import { isDropTargetValid, configBlockData, type IBlockData } from "../utils";
import { cn } from "@/lib/utils";

type EventPayloadWithDelta = BaseEventPayload<ElementDragType> & {
    delta: Coordinate,
}

export type EventRelativePayload = {
    index: number,
    pos: { x: number, y: number },
    data: Record<string, any>
}[];

export interface INodePrimitive extends Omit<React.ComponentPropsWithoutRef<'div'>, "onDragStart" | "onDrop" | "onDrag"> {
    onPanelDrop?: (payload: EventPayloadWithDelta, relativePos: EventRelativePayload) => void,
    onSpaceDrop?: (payload: EventPayloadWithDelta, relativePos: EventRelativePayload) => void,
    onDragStart?: (payload: EventPayloadWithDelta) => void,
    onDrop?: (payload: EventPayloadWithDelta) => void,
    onDrag?: (payload: EventPayloadWithDelta) => void,
    fnOverride?: Partial<Parameters<typeof draggable>[0]>,
    inputs?: any,
    outputs?: any,
    handleRef?: React.RefObject<HTMLDivElement | null>,
    blockData?: IBlockData
}

export default function NodePrimitive({
    children,
    style,
    className,
    onPanelDrop,
    onSpaceDrop,
    onDragStart,
    onDrop,
    onDrag,
    fnOverride,
    handleRef,
    blockData,
    ...rest
}: INodePrimitive) {
    const ref = useRef<HTMLDivElement>(null);
    const dragDelta = useRef<Coordinate>(new Coordinate());
    const [ isDragging, setIsDragging ] = useState<boolean>(false);

    const myBlockData = blockData ? blockData : configBlockData({
        type: "preset-block",
        layer: TAppLayers.Space
    });

    const styleOverride = {
        opacity: isDragging?"50%":"100%",
        ...style
    }

    useEffect(() => {
        if (ref.current) {
            const element = ref.current;

            return draggable({
                element: element,
                dragHandle: (handleRef && handleRef.current!==null) ? handleRef.current : element,
                getInitialData: () => (myBlockData),
                onDragStart: (payload) => {
                    setIsDragging(true);
                    const iRect = ref.current?.getBoundingClientRect();
                    const rectPos = new Coordinate(iRect?.x, iRect?.y);

                    const inputData = payload.location.initial.input;
                    const initialDragLocation = new Coordinate(inputData.pageX, inputData.pageY);
                    const delta = initialDragLocation.subtract(rectPos);

                    dragDelta.current = delta;
                    onDragStart?.({
                        ...payload,
                        delta: delta
                    });
                },
                onDrop: (payload) => {
                    const { location } = payload;
                    const newPayload = {
                        ...payload,
                        delta: dragDelta.current,
                    }
                    const relativePositions: EventRelativePayload = payload.location.current.dropTargets.map((target, idx) => {
                        const { x: rx, y: ry } = target.element.getBoundingClientRect();
                        const myPos = new Coordinate(rx, ry);
                        const { pageX: px, pageY: py } = payload.location.current.input;
                        const posDiff = (new Coordinate(px, py)).subtract(myPos);
                        return {
                            index: idx,
                            pos: posDiff.getLocation(),
                            data: target.data
                        }
                    });
                    onDrop?.(newPayload);
                    setIsDragging(false);
                    if (isDropTargetValid(location, TAppLayers.Panel)) {
                        onPanelDrop?.(newPayload, relativePositions);
                    } else if (isDropTargetValid(location, TAppLayers.Space)) {
                        onSpaceDrop?.(newPayload, relativePositions);
                    }
                },
                onDrag: (payload) => {
                    if (onDrag) {
                        onDrag({
                            ...payload,
                            delta: dragDelta.current,
                        });
                    }
                },
                ...fnOverride
            });
        }
    }, []);

    return (
        <div
            className={cn(
                "",
                className
            )}
            style={styleOverride}
            ref={ref}
            {...rest}
        >
            { children }
        </div>
    )
}