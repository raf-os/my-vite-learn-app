import type { BaseNodeInstanceProps } from "./classes/BaseNodeInstance";

export type TInstanceProps<T extends BaseNodeInstanceProps> = Omit<T, "initialPos" | "_id">;

export const AppLayers = {
    Space: 1 << 0,
    Panel: 1 << 1,
}

export interface ICanvasDrawable {
    requestCanvasRender: (ctx: CanvasRenderingContext2D) => void;
}

type BaseBlockData = {
    layer: number,
    [key: string | symbol]: any,
}

interface NodeSpace extends BaseBlockData {
    type: 'node-space',
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
    AbstractNodeBlock |
    AssetNodeBlock |
    InstanceNodeBlock;

export type NodeTypes = BlockData[`type`];

export type ExtractNodeType<T extends string> = T extends NodeTypes ? Extract<BlockData, { type: T }> : AbstractNodeBlock;

export type NarrowByType<TUnion, TType extends string> = TUnion extends { type: TType } ? TUnion : never;