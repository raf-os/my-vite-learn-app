import { PrimitiveDraggable, type PrimitiveDraggableProps, type PrimitiveDraggableState } from "./PrimitiveDraggable";
import { PrimitiveDroppable, type PrimitiveDroppableState } from "./PrimitiveDroppable";
import { AppLayers, type EvPayload, type NodeTypes, type ExtractNodeType, type IONodeProps } from "../types";
import { configNodeData, getTopmostDropTarget } from "../utils";
import Coordinate from "./Coordinate";
import { cn } from "@/lib/utils";
import { createElement, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { v4 as uuid } from "uuid";
import { monitorForElements, type draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import type { DropTargetArgs, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export interface BaseIONodeProps extends Omit<PrimitiveDraggableProps, "datatype">, IONodeProps {
    _id: string,
    owner: string,
    type: 'input' | 'output',
}

export interface BaseOutputNodeState extends PrimitiveDraggableState {

}

export interface BaseInputNodeState extends PrimitiveDroppableState {
    isDragValid: boolean,
    isOver: boolean,
}

export default function BaseIONode(props: Omit<BaseIONodeProps, "_id">) {
    const myID = uuid();
    const newProps: BaseIONodeProps = {
        ...props,
        _id: `node-io(id:${myID})`
    }
    if (props.type === "input") {
        return createElement(BaseIONodeInput, newProps);
    } else if (props.type === "output") {
        return createElement(BaseIONodeOutput, newProps);
    } else return <></>;
}

export class BaseIONodeInput extends PrimitiveDroppable<'io-node', BaseIONodeProps, BaseInputNodeState> {
    _id: string;
    className = "flex gap-1 justify-baseline items-center text-xs font-semibold";
    fnOverrides: Partial<DropTargetArgs<ElementDragType>> = {
        onDropTargetChange: (payload) => {
            const target = getTopmostDropTarget(payload.location);
            if (target && target.data['id'] === this._id && this.state.isDragValid) {
                this.updateState({ isOver: true });
            }
            else { this.updateState({isOver: false}) }
        }
    };

    constructor(props: BaseIONodeProps) {
        super(props);
        this._id = props._id;
        this.state = {
            ...this.state,
            isDragValid: false,
        }
    }

    setupData() {
        return configNodeData({
            type: 'io-node',
            layer: AppLayers.Space,
            strat: 'input',
            dataType: this.props.datatype,
            id: this.props._id,
            owner: this.props.owner,
        });
    }

    onDragStart(payload: EvPayload): void {
        const sourceType = payload.source.data['type'] as NodeTypes;
        if (sourceType === 'io-node') {
            const data = payload.source.data as ExtractNodeType<'io-node'>;
            if (data.strat === "output" && data.dataType === this.nodeData.dataType && data.owner !== this.props.owner) {
                this.updateState({ isDragValid: true });
            }
        }
    }

    onDrop(payload: EvPayload) {
        this.updateState({ isDragValid: false, isOver: false });
    };

    componentDidMount(): void {
        super.componentDidMount();
        this.cleanupFns.add(() => monitorForElements({
            canMonitor: ({source}) => source.data['type'] as NodeTypes === 'io-node',
            onDragStart: (payload) => this.onDragStart(payload),
            onDrop: (payload) => this.onDrop(payload),
        }));
    }

    innerJSX(): React.ReactNode {
        return (
            <>
                <NodeElement
                    className={cn(
                        "bg-transparent inset-ring-3",
                        this.state.isDragValid && "inset-ring-green-500",
                        this.state.isOver && "inset-ring-blue-400"
                    )}
                />
                <NodeLabel
                    className={cn(
                        this.state.isOver && "text-neutral-50 bg-linear-to-r from-blue-400 to-transparent"
                    )}
                >
                    { this.props.label || this.props.name }
                </NodeLabel>
            </>
        )
    }
}

export class BaseIONodeOutput extends PrimitiveDraggable<'io-node', BaseIONodeProps, BaseOutputNodeState> {
    _id: string;
    className = "flex gap-1 justify-end items-center text-xs font-semibold relative";

    functionOverrides: Partial<Parameters<typeof draggable>[0]> = {
        onGenerateDragPreview({ nativeSetDragImage }) {
            disableNativeDragPreview({ nativeSetDragImage });
        }
    }

    constructor(props: BaseIONodeProps) {
        super(props);

        this._id = props._id;
        this.state = {
            ...this.state,
            isDragging: false,
        }
    }

    setupData() {
        return configNodeData({
            type: 'io-node',
            layer: AppLayers.Space,
            strat: 'output',
            dataType: this.props.datatype,
            id: this._id,
            owner: this.props.owner,
        });
    }

    onDragStart(payload: EvPayload): void {
        super.onDragStart(payload);
        preventUnhandled.start();
    }

    innerJSX(): React.ReactNode {
        return (
            <>
                <NodeLabel className="text-right">
                    { this.props.label || this.props.name }
                </NodeLabel>
                <NodeElement ref={this.handleRef} />
                { this.state.isDragging && createPortal(
                    <DragPreview label={this.props.name} />,
                    document.body
                ) }
            </>
        )
    }
}

interface NodeElementProps extends React.ComponentPropsWithRef<'div'> {
}

function NodeElement({
    className,
    ref,
    ...rest
}: NodeElementProps) {
    return (
        <div
            className={cn(
                "size-4 bg-neutral-950 rounded-full",
                className
            )}
            ref={ref}
            {...rest}
        />
    )
}

function NodeLabel({
    className,
    children,
    ...rest
}: React.ComponentPropsWithRef<'div'>) {
    return (
        <div
            className={cn(
                "grow-1 shrink-1 rounded-[4px] px-[4px] py-[2px]",
                className
            )}
            {...rest}
        >
            { children }
        </div>
    )
}

type DragPreviewProps = {
    label: string,
} & React.ComponentPropsWithRef<'div'>;

function DragPreview({ label } : DragPreviewProps) {
    const [ curPos, setCurPos ] = useState<Coordinate>(new Coordinate(0, 0));
    const [ dimensions, setDimensions ] = useState<Coordinate>(new Coordinate());
    const labelRef = useRef<HTMLDivElement>(null);

    const updateDrag = (payload: EvPayload) => {
        const { clientX: cx, clientY: cy } = payload.location.current.input;
        const newPos = new Coordinate(
            Math.min(Math.max(cx, dimensions.x)),
            Math.max(cy, dimensions.y)
        );
        setCurPos(newPos);
    }

    useEffect(() => {
        return monitorForElements({
            onDrag: (payload) => updateDrag(payload),
        })
    });

    useEffect(() => {
        if (labelRef.current) {
            const { width, height } = labelRef.current.getBoundingClientRect();
            const d = new Coordinate(width / 2, height / 2);
            setDimensions(d);
        }
    }, []);

    return (
        <div
            style={{
                transform: `translate3d(${curPos.x}px, ${curPos.y}px, 0)`,
                position: "absolute",
                top: "0",
                left: "0"
            }}
        >
            <div
                className="-translate-x-1/2 -translate-y-1/2 bg-slate-700 text-neutral-50 text-sm font-bold p-1 rounded-box"
                ref={labelRef}
            >
                { label }
            </div>
        </div>
    )
}
