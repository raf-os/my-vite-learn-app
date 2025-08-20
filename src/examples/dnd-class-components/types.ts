import type { IONodeTypes } from "./classes/BaseIONode";
import type { BaseNodeInstanceProps } from "./classes/BaseNodeInstance";
import type { BaseEventPayload, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/types";

export type TInstanceProps<T extends BaseNodeInstanceProps> = Omit<T, "initialPos" | "_id">;

export type ExtractValues<T extends Record<string, string>> = T[keyof T];

export type EvPayload = BaseEventPayload<ElementDragType>;

export const AppLayers = {
    Space: 1 << 0,
    Panel: 1 << 1,
}

export interface ICanvasDrawable {
    requestCanvasRender: (ctx: CanvasRenderingContext2D) => void;
}

export interface IONodeProps {
    datatype: 'string' | 'number' | 'boolean',
    name: string,
    label?: string,
}

type BaseBlockData = {
    layer: number,
    [key: string | symbol]: any,
}

interface NodeSpace extends BaseBlockData {
    type: 'node-space',
}

export interface IONode extends BaseBlockData {
    type: 'io-node',
    strat: 'input' | 'output',
    dataType: IONodeProps['datatype'],
    id: string,
    owner: string,
    __obj: IONodeTypes,
}

interface AbstractNodeBlock extends BaseBlockData {
    type: 'node-abstract',
};

interface AssetNodeBlock extends BaseBlockData {
    type: 'node-asset',
}

interface InstanceNodeBlock extends BaseBlockData {
    type: 'node-instance',
    id: string
}

export type BlockData =
    NodeSpace |
    IONode |
    AbstractNodeBlock |
    AssetNodeBlock |
    InstanceNodeBlock;

export type NodeTypes = BlockData[`type`];

export type ExtractNodeType<T extends string> = T extends NodeTypes ? Extract<BlockData, { type: T }> : AbstractNodeBlock;

export type NarrowByType<TUnion, TType extends string> = TUnion extends { type: TType } ? TUnion : never;

export interface ICanvasRenderable {
    render: (ctx: CanvasRenderingContext2D) => void;
}