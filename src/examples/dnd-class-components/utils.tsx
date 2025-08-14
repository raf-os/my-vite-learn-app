import { type BlockData, type NodeTypes, type ExtractNodeType, type NarrowByType } from "./types";
import { type DropTargetRecord, type DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/types";

export function configNodeData<T extends NodeTypes>(
    data: BlockData & { type: T }
) {
    return data as NarrowByType<BlockData, T>;
}

export function getTopmostDropTarget(location: DragLocationHistory) {
    return location.current.dropTargets.at(0);
}

export function isDropTargetValid(locationData: DragLocationHistory, layerCheck: number) {
    const target = getTopmostDropTarget(locationData);
    return target?.data['layer'] === layerCheck;
}

export function getTargetData<T extends string = string>(target: DropTargetRecord) {
    const data = target.data;
    return data as ExtractNodeType<T>;
}

export function isTargetType(target: DropTargetRecord, type: NodeTypes) {
    return target.data['type'] === type;
}