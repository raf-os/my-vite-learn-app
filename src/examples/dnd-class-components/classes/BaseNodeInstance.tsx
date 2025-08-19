import { PrimitiveDraggable, type EventRelativePayload, type PrimitiveDraggableProps, type PrimitiveDraggableState } from "./PrimitiveDraggable";
import { NodeSpaceContext } from "../components/NodeSpaceContext";
import BaseIONode from "./BaseIONode";
import Coordinate from "./Coordinate";
import { configNodeData } from "../utils";
import { AppLayers, type IONodeProps } from "../types";
import { Grip } from "lucide-react";

export interface BaseNodeInstanceProps extends PrimitiveDraggableProps {
    _id: string,
    header: React.ReactNode,
    initialPos: Coordinate,
    inputs?: IONodeProps[],
    outputs?: IONodeProps[],
}

export interface BaseNodeInstanceState extends PrimitiveDraggableState {
    pos: Coordinate,
}

export default class BaseNodeInstance<
    T extends BaseNodeInstanceProps = BaseNodeInstanceProps,
    Q extends BaseNodeInstanceState = BaseNodeInstanceState> extends PrimitiveDraggable<'node-instance', T, Q> {
    _id: string;
    className: string = "absolute flex flex-col bg-neutral-50 rounded-box overflow-hidden";
    myInputs: React.ReactElement<typeof BaseIONode>[] = [];
    myOutputs: React.ReactElement<typeof BaseIONode>[] = [];
    static contextType = NodeSpaceContext;
    declare context: React.ContextType<typeof NodeSpaceContext>;

    constructor(props: T) {
        super(props);

        this._id = props._id;
        this.state = {
            ...this.state,
            pos: props.initialPos,
        };

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

    componentDidMount(): void {
        super.componentDidMount();
        this.updatePosition(this.props.initialPos);
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

    onSpaceDrop({}, relativePositions: EventRelativePayload): void {
        const relativePos = relativePositions.find(item => item.data.type === "node-space");
        const newPos = new Coordinate(
            (relativePos?.pos.x || 0) - this.dragDelta.x,
            (relativePos?.pos.y || 0) - this.dragDelta.y
        );
        this.updatePosition(newPos);
    }

    innerJSX(): React.ReactNode {
        return (
            <>
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

                <div className="flex flex-col gap-2">
                    { this.myInputs }
                    { this.myOutputs }
                </div>
            </>
        )
    }
}