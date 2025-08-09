import NodePrimitive, { type INodePrimitive } from "./NodePrimitive";
import { useRef, useState } from "react";
import { Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Coordinate } from "../types";

export interface IBaseNode extends INodePrimitive {
    header: React.ReactNode,
    posX?: number,
    posY?: number
}

export default function BaseNode({
    children,
    className,
    header,
    style,
    posX = 0,
    posY = 0,
    ...rest
}: IBaseNode) {
    const handleRef = useRef<HTMLDivElement>(null);
    const [ myPos, setMyPos ] = useState<Coordinate>(new Coordinate(posX, posY));

    const _style = {
        ...style,
        left: myPos.x,
        top: myPos.y,
    }

    const onSpaceDrop: INodePrimitive['onSpaceDrop'] = ({delta}, relativePos) => {
        const relative = relativePos.find(item => item.data['type'] === "node-space");
        const newPos = new Coordinate(
            (relative?.pos.x || 0) - delta.x,
            (relative?.pos.y || 0) - delta.y
        );
        setMyPos(newPos);
    }

    return (
        <NodePrimitive
            className={cn(
                "absolute bg-slate-200 rounded-box flex flex-col overflow-hidden",
                className
            )}
            handleRef={handleRef}
            style={_style}
            onSpaceDrop={onSpaceDrop}
            {...rest}
        >
            <div
                data-slot="node-block-header"
                className="flex items-center font-medium gap-1 p-2 bg-slate-500 text-neutral-50 cursor-pointer"
                ref={handleRef}
            >
                <div
                    className="grow-0 shrink-0"
                >
                    <Grip size={20} />
                </div>
                <>{ header }</>
            </div>

            <div
                data-slot="node-block-content"
                className="p-1"
            >
                { children }
            </div>
        </NodePrimitive>
    )
}