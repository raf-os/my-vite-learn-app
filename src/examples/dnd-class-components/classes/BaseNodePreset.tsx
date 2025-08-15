import { PrimitiveDraggable, type EventRelativePayload, type PrimitiveDraggableProps } from "./PrimitiveDraggable";
import { type BaseNodeInstanceProps } from "./BaseNodeInstance";
import { configNodeData } from "../utils";
import { AppLayers, type TInstanceProps } from "../types";
import { Grip } from "lucide-react";
import Coordinate from "./Coordinate";
import { NodeSpaceContext } from "../components/NodeSpaceContext";
import { createElement } from "react";
import { v4 as uuid } from "uuid";

interface BaseNodePresetProps extends PrimitiveDraggableProps {
    header: React.ReactNode,
    instanceType: new (...args: any[]) => React.Component<any>,
    instanceProps: TInstanceProps<BaseNodeInstanceProps>,
}

export default class BaseNodePreset extends PrimitiveDraggable<'node-asset', BaseNodePresetProps> {
    className = "flex bg-amber-400 rounded-box";
    static contextType = NodeSpaceContext;
    declare context: React.ContextType<typeof NodeSpaceContext>;

    setupData() {
        return configNodeData({
            type: 'node-asset',
            layer: AppLayers.Space,
        });
    }

    onSpaceDrop({}, relativePositions: EventRelativePayload): void {
        const data = relativePositions.find(item => item.data.type === "node-space");
        const posX = (data?.pos.x || 0);
        const posY = (data?.pos.y || 0);

        const mID = uuid();

        // TODO: Maybe create a static helper method for the BaseNodeInstance class instead of createElement, so the class itself can define how a new instance is created
        this.context.addNodeToSpace(createElement<BaseNodeInstanceProps>(
            this.props.instanceType,
            {
                ...this.props.instanceProps,
                initialPos: new Coordinate(posX, posY),
                _id: mID,
                key: `node-instance(id:${mID})`,
            }
        ));
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