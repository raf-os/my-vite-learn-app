import NodePrimitive from "./NodePrimitive";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";

export interface IBaseIONode {
    type: "input" | "output",
    label?: string,
}

export default function BaseIONode({
    type,
    label,
}: IBaseIONode) {
    const handleRef = useRef<HTMLDivElement>(null);
    const [ isDragging, setIsDragging ] = useState<boolean>(false);
    const [ dragPos, setDragPos ] = useState<[Number, Number]>([0, 0]);

    return (
        <NodePrimitive
            className={cn(
                "flex items-center gap-1",
                type==="input" && "",
                type==="output" && "flex-row-reverse"
            )}
            handleRef={handleRef}
            onDragStart={() => {
                setIsDragging(true);
            }}
            onDrop={() => {
                setIsDragging(false);
            }}
            onDrag={(payload) => {
                const { clientX, clientY } = payload.location.current.input;
                const newPos: [Number, Number] = [ clientX, clientY ];
                const isInvalid = newPos.every((i, idx) => i === dragPos[idx]);
                if (!isInvalid) {
                    setDragPos(newPos);
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
                >
                    { label }
                </div>
            ), document.body)}
        </NodePrimitive>
    )
}