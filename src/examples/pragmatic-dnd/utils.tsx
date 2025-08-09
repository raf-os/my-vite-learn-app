import { type DragLocationHistory, type BaseEventPayload, type ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/types";

export function getTopmostDropTarget(location: DragLocationHistory) {
    return location.current.dropTargets.at(0);
}

export function isDropTargetValid(locationData: DragLocationHistory, layerCheck: number) {
    const target = getTopmostDropTarget(locationData);
    return target?.data['layer'] === layerCheck;
}

export type IBlockData = {
    type: string,
    layer: number,
} & Record<string, any>;

export function configBlockData(data: IBlockData) {
    const compiledData = {
        ...data,
    }
    return compiledData;
}