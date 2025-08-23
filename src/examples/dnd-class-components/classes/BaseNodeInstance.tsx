import { PrimitiveDraggable, type EventRelativePayload, type PrimitiveDraggableProps, type PrimitiveDraggableState } from "./PrimitiveDraggable";
import { NodeSpaceContext } from "../components/NodeSpaceContext";
import InstanceIOHandler from "./handlers/InstanceIOHandler";
import { NodeInstanceContext, type INodeInstanceContext } from "../components/NodeInstanceContext";
import BaseIONode from "./BaseIONode";
import Coordinate from "./Coordinate";
import { configNodeData } from "../utils";
import { AppLayers, type IONodeProps } from "../types";
import { Grip } from "lucide-react";
import ConnectionSingleton from "./handlers/ConnectionSingleton";

export interface BaseNodeInstanceProps extends PrimitiveDraggableProps {
    _id: string,
    header: React.ReactNode,
    initialPos: Coordinate,
    inputs?: IONodeProps[],
    outputs?: IONodeProps[],
}

export interface BaseNodeInstanceState extends PrimitiveDraggableState {
    pos: Coordinate,
    zIndex: number,
}

export default class BaseNodeInstance<
    T extends BaseNodeInstanceProps = BaseNodeInstanceProps,
    Q extends BaseNodeInstanceState = BaseNodeInstanceState> extends PrimitiveDraggable<'node-instance', T, Q> {
    _id: Readonly<string>;
    className: string = "absolute flex flex-col bg-neutral-50 rounded-box overflow-hidden";
    myInputs: React.ReactElement<typeof BaseIONode>[] = [];
    myOutputs: React.ReactElement<typeof BaseIONode>[] = [];
    handler: InstanceIOHandler;
    _ctx: INodeInstanceContext;
    _evtBusSubscribe: (...args: any) => void = () => {};
    static contextType = NodeSpaceContext;
    declare context: React.ContextType<typeof NodeSpaceContext>;

    constructor(props: T) {
        super(props);

        this._id = props._id;
        this.state = {
            ...this.state,
            pos: props.initialPos,
            zIndex: this.state.zIndex || 0,
        };

        this.style = { ...this.style, zIndex: this.state.zIndex };

        this.handler = new InstanceIOHandler(this._id);
        this._ctx = {
            ioHandler: this.handler,
        }

        if (props.inputs) { // Almost duplicated code, maybe look into fixing
            this.myInputs = props.inputs.map((i, idx) => (
                <BaseIONode
                    owner={this._id}
                    type="input"
                    datatype={i.datatype}
                    label={i.label}
                    name={i.name}
                    key={`input-${idx}`}
                />
            ));
        }

        if (props.outputs) {
            this.myOutputs = props.outputs.map((i, idx) => (
                <BaseIONode
                    owner={this._id}
                    type="output"
                    datatype={i.datatype}
                    label={i.label}
                    name={i.name}
                    key={`output-${idx}`}
                />
            ));
        }
    }

    setupData() {
        return configNodeData({
            type: "node-instance",
            layer: AppLayers.Space,
            id: this._id,
        });
    }

    updateZIndex({nodeCount, targetId, currentIdx}: {nodeCount: number, targetId: string, currentIdx: number}) {
        if (targetId === this.props._id) {
            this.updateState({ zIndex: nodeCount });
        } else if (this.state.zIndex > currentIdx) {
            this.updateState({ zIndex: Math.max(0, this.state.zIndex - 1) });
        }
    }

    bringToFront(): void {
        this.context.bringNodeToFront(this.props._id, this.state.zIndex);
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.updatePosition(this.props.initialPos);
        this._evtBusSubscribe = (...args: Parameters<typeof this.updateZIndex>) => this.updateZIndex(...args);
        this.context.eventBus.on("updateSortOrder", this._evtBusSubscribe);
        this.bringToFront();
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();
        this.context.eventBus.off("updateSortOrder", this._evtBusSubscribe);
    }

    updatePosition(newPosition?: Coordinate) {
        const newPos = Coordinate.from(newPosition);
        this.style = {
            left: newPos.x,
            top: newPos.y,
        }
        this.updateState({
            pos: Coordinate.from(newPosition),
        });
    }

    updateDraggingStyle(isDragging: boolean): void {
        if (isDragging) {
            this.dragStyle = {
                outline: "4px solid var(--color-blue-500)",
                outlineOffset: "3px",
            }
        } else this.dragStyle = {}
    }

    onSpaceDrop({}, relativePositions: EventRelativePayload): void {
        const relativePos = relativePositions.find(item => item.data.type === "node-space");
        const newPos = new Coordinate(
            (relativePos?.pos.x || 0) - this.dragDelta.x,
            (relativePos?.pos.y || 0) - this.dragDelta.y
        );
        this.updatePosition(newPos);
        this.bringToFront();
    }

    shouldComponentUpdate(nextProps: Readonly<T>, nextState: Readonly<Q>, nextContext: any): boolean {
        const s = super.shouldComponentUpdate(nextProps, nextState, nextContext);
        this.style.zIndex = nextState.zIndex;
        return s;
    }

    componentDidUpdate({}, prevState: Readonly<Q>): void {
        if (!this.state.pos.equals(prevState.pos)) {
            ConnectionSingleton.onNodeBlockInstanceMove(this._id);
        }
    }

    innerJSX(): React.ReactNode {
        return (
            <NodeInstanceContext.Provider value={this._ctx}>
                <div
                    ref={this.handleRef}
                    className="flex items-center gap-2 p-2 bg-slate-700 text-neutral-50 cursor-pointer select-none"
                    data-slot="node-instance-header"
                >
                    <Grip size={20} />
                    <div
                        className="font-medium"
                    >
                        { this.props.header }
                    </div>
                </div>

                <div
                    className="text-sm px-2 py-1"
                    data-slot="node-instance-content"
                >
                    { this.props.children }
                </div>

                <div className="flex flex-col gap-0.5">
                    { this.myInputs }
                    { this.myOutputs }
                </div>
            </NodeInstanceContext.Provider>
        )
    }
}