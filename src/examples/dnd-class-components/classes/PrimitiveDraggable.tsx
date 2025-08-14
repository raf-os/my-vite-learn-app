import { Component, createRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Coordinate from "./Coordinate";
import { type BlockData, type NarrowByType, AppLayers } from "../types";
import { type BaseEventPayload, type ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/types";
import { configNodeData, isDropTargetValid } from "../utils";

type EvPayload = BaseEventPayload<ElementDragType>;

export interface PrimitiveDraggableProps extends React.ComponentPropsWithRef<'div'> {}

export interface PrimitiveDraggableState {
    isDragging: boolean,
    [key: string]: any,
}

export type EventRelativePayload = {
    index: number,
    pos: Coordinate,
    data: BlockData
}[];

export abstract class PrimitiveDraggable<
    T extends string,
    U extends PrimitiveDraggableProps = PrimitiveDraggableProps,
    V extends PrimitiveDraggableState = PrimitiveDraggableState> extends Component<U, V> {
    draggableRef = createRef<HTMLDivElement>();
    handleRef = createRef<HTMLDivElement>();
    draggableCleanup = () => {};
    dragDelta = new Coordinate();
    nodeData: BlockData & { type: T };
    functionOverrides?: Partial<Parameters<typeof draggable>[0]>;
    baseStyle: React.CSSProperties = {};

    constructor(props: U) {
        super(props);
        this.nodeData = this.setupData() as NarrowByType<BlockData, T>;
    }

    updateState(newObj: Partial<PrimitiveDraggableState>) {
        this.setState({
            ...this.state,
            ...newObj
        });
    }

    onDragStart(payload: EvPayload) {
        this.updateState({ isDragging: true });
        const myRect = this.draggableRef.current?.getBoundingClientRect();
        const rectPos = new Coordinate(myRect?.x, myRect?.y);

        const inputData = payload.location.initial.input;
        const initialDragLocation = new Coordinate(inputData.pageX, inputData.pageY);
        const delta = initialDragLocation.subtract(rectPos);

        this.dragDelta = delta;
    }

    onDrop(payload: EvPayload) {
        const { location } = payload;
        const relativePositions: EventRelativePayload = payload.location.current.dropTargets.map((target, idx) => {
            const { x: rx, y: ry } = target.element.getBoundingClientRect();
            const myPos = new Coordinate(rx, ry);
            const { pageX: px, pageY: py } = payload.location.current.input;
            const posDiff = (new Coordinate(px, py)).subtract(myPos);
            return {
                index: idx,
                pos: posDiff,
                data: target.data as BlockData
            }
        });

        this.updateState({ isDragging: false });

        if (isDropTargetValid(location, AppLayers.Panel)) {
            this.onPanelDrop?.(payload, relativePositions);
        } else if (isDropTargetValid(location, AppLayers.Space)) {
            this.onSpaceDrop?.(payload, relativePositions);
        }
    }

    onDrag?(payload: EvPayload): void;
    onPanelDrop?(payload: EvPayload, relativePositions?: EventRelativePayload): void;
    onSpaceDrop?(payload: EvPayload, relativePositions?: EventRelativePayload): void;

    setupData(): BlockData {
        return configNodeData({
            type: 'node-abstract',
            layer: AppLayers.Space
        });
    }

    updateDraggingStyle() {
        this.baseStyle = {
            opacity: this.state.isDragging ? "50%":"100%",
        }
    }

    componentDidMount(): void {
        if (this.draggableRef.current) {
            const el = this.draggableRef.current;

            this.draggableCleanup = draggable({
                element: el,
                dragHandle: this.handleRef.current || el,
                getInitialData: () => (this.nodeData),
                onDragStart: this.onDragStart,
                onDrag: this.onDrag,
                ...this.functionOverrides
            });
        }
        this.updateState({ isDragging: false});
    }

    componentDidUpdate({}, prevState: Readonly<PrimitiveDraggableState>): void {
        if (prevState.isDragging !== this.state.isDragging) {
            this.updateDraggingStyle();
        }
    }

    componentWillUnmount(): void {
        this.draggableCleanup();
    }

    innerJSX?(): React.ReactNode;

    render() {
        return (
            <div
                ref={this.draggableRef}
            >
                { this.innerJSX?.() }
            </div>
        )
    }
}