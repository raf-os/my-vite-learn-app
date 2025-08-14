import { PrimitiveDraggable, type EventRelativePayload, type EvPayload, type PrimitiveDraggableProps } from "./PrimitiveDraggable";
import { configNodeData } from "../utils";
import { AppLayers } from "../types";
import { Grip } from "lucide-react";

interface BaseNodePresetProps extends PrimitiveDraggableProps {
    header: React.ReactNode,
}

export default class BaseNodePreset extends PrimitiveDraggable<'node-asset', BaseNodePresetProps> {
    className = "flex bg-amber-400 rounded-box";

    setupData() {
        return configNodeData({
            type: 'node-asset',
            layer: AppLayers.Space,
        });
    }

    onSpaceDrop(payload: EvPayload, relativePositions: EventRelativePayload): void {
        // Spawn code goes here
    }

    innerJSX(): React.ReactNode {
        return (
            <>
                <div
                    className="flex items-center grow-0 shrink-0 px-2 cursor-pointer"
                    data-slot="node-asset-header"
                    ref={this.handleRef}
                >
                    <Grip size={24} />
                </div>

                <div
                    data-slot="node-asset-content"
                    className="flex flex-col gap-1 grow-1 shrink-1 py-2 pr-2"
                >
                    <div
                        className="text-sm font-medium"
                    >
                        { this.props.header ? this.props.header : "NODE" }
                    </div>

                    <div
                        className="bg-neutral-50 px-2 py-1 rounded-box shadow-sm grow-1 shrink-1"
                    >
                        { this.props.children }
                    </div>
                </div>
            </>
        )
    }
}