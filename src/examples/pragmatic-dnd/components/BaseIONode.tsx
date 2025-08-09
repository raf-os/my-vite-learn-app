import NodePrimitive from "./NodePrimitive";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface IBaseIONode {
    type: "input" | "output",
    label?: string,
}

export default function BaseIONode({
    type,
    label,
}: IBaseIONode) {
    const handleRef = useRef<HTMLDivElement>(null);

    return (
        <NodePrimitive
            className={cn(
                "flex items-center gap-1",
                type==="input" && "",
                type==="output" && "flex-row-reverse"
            )}
            handleRef={handleRef}
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
        </NodePrimitive>
    )
}