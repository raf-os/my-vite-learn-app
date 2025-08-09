import NodePrimitive from "./NodePrimitive";
import { useRef } from "react";

export interface IBaseIONode {
    type: "input" | "output"
}

export default function BaseIONode({

}: IBaseIONode) {
    const handleRef = useRef<HTMLDivElement>(null);

    return (
        <NodePrimitive
            className=""
            handleRef={handleRef}
        >
            <div
                ref={handleRef}
                className="bg-neutral-950 size-3 rounded-full grow-0 shrink-0"
            />
        </NodePrimitive>
    )
}