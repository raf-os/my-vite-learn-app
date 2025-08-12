import NodePrimitive from "./NodePrimitive";
import { useRef, useState, useContext } from "react";
import { AppContext } from "..";
import { NodeDragLine, TAppLayers, type CoordArray } from "../types";
import { configBlockData } from "../utils";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

export interface IBaseIONode {
    type: "input" | "output",
    label?: string,
}

export default function BaseIONode({
    type,
    label,
}: IBaseIONode) {
    const handleRef = useRef<HTMLDivElement>(null);
    const nodeLine = useRef<NodeDragLine | null>(undefined);
    const [ isDragging, setIsDragging ] = useState<boolean>(false);
    const [ dragPos, setDragPos ] = useState<[number, number]>([0, 0]);
    const { addNodeLine, removeNodeLine } = useContext(AppContext);

    const blockData = configBlockData({
        type: "io-node-output",
        layer: TAppLayers.Space,
    });

    const startDragging = (location?: [number, number]) => {
        setIsDragging(true);
        if (location) setDragPos(location);
    }

    const stopDragging = () => {
        setIsDragging(false);
    }

    return (
        <NodePrimitive
            className={cn(
                "flex items-center gap-1",
                type==="input" && "",
                type==="output" && "flex-row-reverse"
            )}
            style={{
                opacity: "100%"
            }}
            blockData={blockData}
            handleRef={handleRef}
            onDragStart={(payload) => {
                preventUnhandled.start();
                const { clientX, clientY } = payload.location.initial.input;
                nodeLine.current = addNodeLine([clientX, clientY], handleRef) || null;
                console.log(nodeLine.current);
                startDragging([clientX, clientY]);
            }}
            onDrop={() => {
                removeNodeLine(nodeLine.current || undefined);
                stopDragging();
            }}
            onDrag={(payload) => {
                const { clientX, clientY } = payload.location.current.input;
                const newPos: CoordArray = [ clientX, clientY ];
                const isInvalid = newPos.every((i, idx) => i === dragPos[idx]);
                if (!isInvalid) {
                    setDragPos(newPos);
                    nodeLine.current?.updatePosition(newPos);
                }
            }}
            fnOverride={{
                onGenerateDragPreview({ nativeSetDragImage }) {
                    disableNativeDragPreview({ nativeSetDragImage });
                }
            }}
        >
            <div
                ref={handleRef}
                className="bg-neutral-950 size-3 rounded-full grow-0 shrink-0"
            />

            { label && (
                <div className={cn(
                    "grow-1 shrink-1 text-sm",
                    type==="output" && "text-right"
                )}>
                    {label}
                </div>
            )}

            { isDragging && createPortal((
                <div
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        transform: `translate3d(${dragPos[0]}px, ${dragPos[1]}px, 0px)`
                    }}
                    className="bg-slate-700 text-neutral-50 rounded-box text-sm font-semibold p-1 mt-2 ml-2"
                >
                    { label }
                </div>
            ), document.body)}
        </NodePrimitive>
    )
}