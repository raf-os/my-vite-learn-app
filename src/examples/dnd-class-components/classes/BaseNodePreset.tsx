import { PrimitiveDraggable, type PrimitiveDraggableProps } from "./PrimitiveDraggable";
import { configNodeData } from "../utils";
import { AppLayers } from "../types";

interface BaseNodePresetProps extends PrimitiveDraggableProps {
    header: React.ReactNode,
}

export default class BaseNodePreset extends PrimitiveDraggable<'node-asset', BaseNodePresetProps> {
    setupData() {
        return configNodeData({
            type: 'node-asset',
            layer: AppLayers.Space,
        });
    }
}