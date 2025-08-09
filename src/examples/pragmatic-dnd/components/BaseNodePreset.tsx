import NodePrimitive, { type INodePrimitive } from "./NodePrimitive";
import { type IBaseNode } from "./BaseNode";
import { Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useContext } from "react";
import { AppContext } from "..";

export interface IBaseNodePreset extends INodePrimitive {
    header: React.ReactNode,
    handleStyle?: string,
    nodeSpawn: React.ReactElement<IBaseNode>,
}

export default function BaseNodePreset({
    children,
    className,
    handleStyle,
    header,
    nodeSpawn,
    ...rest
}: IBaseNodePreset) {
    const handleRef = useRef<HTMLDivElement>(null);
    const { appendNodeBlock } = useContext(AppContext);

    const spawnNode: INodePrimitive['onPanelDrop'] = ({}, pos) => {
        const data = pos.find((item) => item.data['type'] === "node-space");

        const posX = (data?.pos.x || 0);
        const posY = (data?.pos.y || 0);

        appendNodeBlock(nodeSpawn, posX, posY);
    }

    return (
        <NodePrimitive
            className={cn(
                "flex bg-amber-200 rounded-box overflow-hidden",
                className
            )}
            handleRef={handleRef}
            onSpaceDrop={spawnNode}
            {...rest}
        >
            <div
                ref={handleRef}
                className={cn(
                    "flex bg-amber-400 hover:bg-amber-500 grow-0 shrink-0 w-8 items-center justify-center",
                    handleStyle
                )}
            >
                <Grip size={20} />
            </div>
            <div
                data-slot="node-block-main"
                className="flex flex-col gap-1 grow-1 shrink-1 p-2"
            >
                <div
                    data-slot="node-block-header"
                    className="font-medium select-none flex"
                >
                    { header }
                </div>

                <div
                    data-slot="node-block-content"
                    className="bg-neutral-50 px-1 py-0.5 rounded-box shadow-sm"
                >
                    { children }
                </div>
            </div>
        </NodePrimitive>
    )
}