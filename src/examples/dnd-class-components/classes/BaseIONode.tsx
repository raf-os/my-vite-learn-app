import { PrimitiveDraggable, type PrimitiveDraggableProps, type PrimitiveDraggableState } from "./PrimitiveDraggable";
import { PrimitiveDroppable, type PrimitiveDroppableState } from "./PrimitiveDroppable";
import { AppLayers, type EvPayload, type NodeTypes, type ExtractNodeType, type IONodeProps } from "../types";
import { configNodeData, getTopmostDropTarget } from "../utils";
import { cn } from "@/lib/utils";
import { createElement } from "react";
import { v4 as uuid } from "uuid";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
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
                <div
                    className={cn(
                        "grow-1 shrink-1",
                        this.state.isOver && "text-neutral-50 bg-linear-to-r from-blue-400 to-transparent rounded-[4px]"
                    )}
                >
                    { this.props.label || this.props.name }
                </div>
            </>
        )
    }
}

export class BaseIONodeOutput extends PrimitiveDraggable<'io-node', BaseIONodeProps, BaseOutputNodeState> {
    _id: string;
    className = "flex gap-1 justify-end items-center text-xs font-semibold";

    constructor(props: BaseIONodeProps) {
        super(props);

        this._id = props._id;
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

    innerJSX(): React.ReactNode {
        return (
            <>
                <div className="grow-1 shrink-1 text-right">
                    { this.props.label || this.props.name }
                </div>
                <NodeElement ref={this.handleRef} />
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