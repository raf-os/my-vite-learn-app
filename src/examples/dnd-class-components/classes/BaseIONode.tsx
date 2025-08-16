import { PrimitiveDraggable, type PrimitiveDraggableProps, type PrimitiveDraggableState } from "./PrimitiveDraggable";
import { AppLayers } from "../types";
import { configNodeData } from "../utils";
import { cn } from "@/lib/utils";

export interface BaseIONodeProps extends PrimitiveDraggableProps {
    _id: string,
    type: 'input' | 'output',
    label: string,
    dataType: 'string' | 'number' | 'boolean',
}

export interface BaseIONodeState extends PrimitiveDraggableState {

}

export class BaseIONodeOutput extends PrimitiveDraggable<'io-node', BaseIONodeProps, BaseIONodeState> {
    _id: string;
    className = "flex gap-1 justify-end items-center text-xs font-semibold";

    constructor(props: BaseIONodeProps) {
        super(props);

        this._id = this.props._id;
    }

    setupData() {
        return configNodeData({
            type: 'io-node',
            layer: AppLayers.Space,
            strat: 'output',
            dataType: this.props.dataType
        });
    }

    innerJSX(): React.ReactNode {
        return (
            <>
                <div>
                    { this.props.label }
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