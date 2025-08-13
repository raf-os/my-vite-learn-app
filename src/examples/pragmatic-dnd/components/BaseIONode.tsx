import NodePrimitive from "./NodePrimitive";
import { useRef, useState, useEffect, useContext, type ComponentPropsWithRef } from "react";
import { AppContext } from "..";
import { NodeDragLine, TAppLayers, type CoordArray } from "../types";
import { configBlockData, getTopmostDropTarget } from "../utils";
import { BaseNodeContext } from "./BaseNode";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export interface IBaseIONode {
    type: "input" | "output",
    label: string,
    nodeRef?: React.RefObject<HTMLDivElement>,
}

export default function BaseIONode(props: IBaseIONode) {
    if (props.type==="input") return IONodeInput(props);
    else if (props.type==="output") return IONodeOutput(props);
    else return null;
}

const NodeElement = (props: ComponentPropsWithRef<'div'> & {type: "input" | "output"}) => {
    return (
        <div
            ref={props.ref}
            className={cn(
                "size-3 rounded-full grow-0 shrink-0",
                props.type==="input"?"inset-ring-2":"bg-neutral-950",
                props.className
            )}
        />
    )
}

function useMultipleRefs(...refs: (React.RefObject<HTMLDivElement | null> | undefined)[]): React.RefCallback<HTMLDivElement> {
    const validRefs = refs.filter(r => (r!==undefined && r!==null));
    return (node: HTMLDivElement | null) => {
        validRefs.map(ref => ref.current = node);
    }
}

function IONodeInput({
    label,
    nodeRef,
}: IBaseIONode) {
    const ref = useRef<HTMLDivElement>(null);
    const [ isOver, setIsOver ] = useState<boolean>(false);
    const { owner } = useContext(BaseNodeContext);

    const assignRefs = useMultipleRefs(ref, nodeRef);

    const blockData = configBlockData({
        type: "io-node-input",
        layer: TAppLayers.Space,
        owner: owner,
    });

    useEffect(() => {
        const el = ref.current;

        if (el) {
            return dropTargetForElements({
                element: el,
                getData: () => (blockData),
                onDropTargetChange: (payload) => {
                    const target = getTopmostDropTarget(payload.location);
                    const sourceOwner = payload.source.data['owner'] as (React.RefObject<HTMLDivElement | null> | null);

                    const isTargetValid = target && target.element === ref.current && payload.source.data['type'] === "io-node-output";
                    const isSourceOther = (sourceOwner !== owner);

                    if (isTargetValid && isSourceOther) {
                        setIsOver(true);
                    } else {
                        setIsOver(false);
                    }
                },
                onDrop: () => {
                    setIsOver(false);
                }
            });
        }
    }, []);
    
    return (
        <div
            className="flex gap-1 items-center"
            ref={assignRefs}
        >
            <NodeElement
                className={isOver?"inset-ring-green-500":"inset-ring-neutral-950"}
                type="input"
            />
            { label }
        </div>
    )
}

export function IONodeOutput({
    label,
    nodeRef
}: IBaseIONode) {
    const ref = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const nodeLine = useRef<NodeDragLine | null>(undefined);
    const [ isDragging, setIsDragging ] = useState<boolean>(false);
    const [ dragPos, setDragPos ] = useState<[number, number]>([0, 0]);
    const { addNodeLine, removeNodeLine } = useContext(AppContext);
    const { owner }  = useContext(BaseNodeContext);

    const assignRefs = useMultipleRefs(ref, nodeRef);

    const blockData = configBlockData({
        type: "io-node-output",
        layer: TAppLayers.Space,
        owner: owner,
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
                "flex-row-reverse"
            )}
            style={{
                opacity: "100%"
            }}
            blockData={blockData}
            handleRef={handleRef}
            myRef={assignRefs}
            onDragStart={(payload) => {
                preventUnhandled.start();
                const { clientX, clientY } = payload.location.initial.input;
                nodeLine.current = addNodeLine([clientX, clientY], handleRef) || null;
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
            <NodeElement
                ref={handleRef}
                type="output"
            />

            <div className={cn(
                "grow-1 shrink-1 text-sm text-right"
            )}>
                {label}
            </div>

            { isDragging && createPortal((
                <div
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        transform: `translate3d(${dragPos[0]}px, ${dragPos[1]}px, 0px)`
                    }}
                    className="bg-slate-700 text-neutral-50 rounded-box text-sm font-semibold p-1 mt-2 ml-2 z-40"
                >
                    { label }
                </div>
            ), document.body)}
        </NodePrimitive>
    )
}