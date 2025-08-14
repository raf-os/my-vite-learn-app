import { PrimitiveDraggable, type PrimitiveDraggableProps } from "./PrimitiveDraggable";
import { configNodeData } from "../utils";
import { AppLayers } from "../types";
import { Grip } from "lucide-react";

interface BaseNodeInstanceProps extends PrimitiveDraggableProps {
    header: React.ReactNode,
}

export default class BaseNodeInstance extends PrimitiveDraggable<'node-instance', BaseNodeInstanceProps> {
    setupData() {
        return configNodeData({
            type: "node-instance",
            layer: AppLayers.Space,
        });
    }

    innerJSX(): React.ReactNode {
        return (
            <>
                <div
                    ref={this.handleRef}
                    className="flex items-center gap-2 p-2 bg-slate-700 text-neutral-50"
                    data-slot="node-instance-header"
                >
                    <Grip size={24} />
                    <div
                        className="text-sm font-medium"
                    >
                        { this.props.header }
                    </div>
                    
                    
                </div>

                <div
                    className=""
                    data-slot="node-instance-content"
                >
                    { this.props.children }
                </div>
            </>
        )
    }
}