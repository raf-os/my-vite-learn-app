import { Component, createRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { BlockData, NarrowByType, EvPayload } from "../types";
import { cn } from "@/lib/utils";

export interface PrimitiveDroppableProps extends React.ComponentPropsWithoutRef<'div'> {

}

export interface PrimitiveDroppableState {
    isDragging: boolean,
    isOver: boolean,
}

export abstract class PrimitiveDroppable<
    T extends string,
    U extends PrimitiveDroppableProps = PrimitiveDroppableProps,
    V extends PrimitiveDroppableState = PrimitiveDroppableState
> extends Component<U, V> {
    droppableRef = createRef<HTMLDivElement>();
    droppableCleanup = () => {};
    nodeData: BlockData & { type: T };
    fnOverrides?: Partial<Parameters<typeof dropTargetForElements>[0]>;

    key?: string;
    style?: string;
    className?: string;

    constructor(props: U) {
        super(props);

        this.nodeData = this.setupData() as NarrowByType<BlockData, T>;
    }

    updateState<K extends keyof V>(newObj: Pick<V, K>) {
        this.setState((prev) => {return {
            ...prev,
            ...newObj
        }})
    };

    onDrop(payload: EvPayload) {
        this.updateState({ isDragging: false });
    }

    componentDidMount(): void {
        if (this.droppableRef.current) {
            const el = this.droppableRef.current;

            this.droppableCleanup = dropTargetForElements({
                element: el,
                getData: () => (this.nodeData),
                ...this.fnOverrides
            });
        }
    }

    componentWillUnmount(): void {
        this.droppableCleanup();
    }

    innerJSX?(): React.ReactNode;

    abstract setupData() : BlockData;

    render() {
        const { className, children, ...rest } = this.props;
        const myJSX = this.innerJSX?.();

        return (
            <div
                ref={this.droppableRef}
                className={cn(
                    this.className,
                    className
                )}
                style={this.style}
                key={this.key}
                {...rest}
            >
                { myJSX }
                { children }
            </div>
        )
    }
}