import { Component, createRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Coordinate from "./Coordinate";
import { type BlockData, type NarrowByType, type EvPayload, AppLayers } from "../types";
import { configNodeData, isDropTargetValid } from "../utils";
import { cn } from "@/lib/utils";

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
    style: React.CSSProperties = {}; // Change in case you want to override in child instances
    key?: string;
    className?: string;

    constructor(props: U) {
        super(props);
        this.nodeData = this.setupData() as NarrowByType<BlockData, T>;
    }

    updateState<K extends keyof V>(newObj: Pick<V, K>) {
        this.setState((prev) => { return {
            ...prev,
            ...newObj
        }});
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
        this.updateState({ isDragging: false });
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

        if (isDropTargetValid(location, AppLayers.Panel)) {
            this.onPanelDrop?.(payload, relativePositions);
        } else if (isDropTargetValid(location, AppLayers.Space)) {
            this.onSpaceDrop?.(payload, relativePositions);
        }
    }

    onDrag?(payload: EvPayload): void;
    onPanelDrop?(payload: EvPayload, relativePositions: EventRelativePayload): void;
    onSpaceDrop?(payload: EvPayload, relativePositions: EventRelativePayload): void;

    setupData(): BlockData {
        return configNodeData({
            type: 'node-abstract',
            layer: AppLayers.Space
        });
    }

    updateDraggingStyle(newState: boolean) {
        this.baseStyle = {
            opacity: newState ? "50%" : "100%",
        }
    }

    componentDidMount(): void {
        if (this.draggableRef.current) {
            const el = this.draggableRef.current;

            this.draggableCleanup = draggable({
                element: el,
                dragHandle: this.handleRef.current || el,
                getInitialData: () => (this.nodeData),
                onDragStart: (payload) => this.onDragStart(payload),
                onDrag: (payload) => this.onDrag?.(payload),
                onDrop: (payload) => this.onDrop(payload),
                ...this.functionOverrides
            });
        }
    }

    shouldComponentUpdate(nextProps: Readonly<U>, nextState: Readonly<V>, nextContext: any): boolean {
        this.updateDraggingStyle(nextState.isDragging);
        return true;
    }

    componentWillUnmount(): void {
        this.draggableCleanup();
    }

    innerJSX?(): React.ReactNode;

    render() {
        return (
            <div
                ref={this.draggableRef}
                className={cn(
                    this.className,
                    this.props.className
                )}
                style={{
                    ...this.baseStyle,
                    ...this.style
                }}
                key={this.key}
            >
                { this.innerJSX?.() }
            </div>
        )
    }
}