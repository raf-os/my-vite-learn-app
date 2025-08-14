export const AppLayers = {
    Space: 1 << 0,
    Panel: 1 << 1,
}

type BaseBlockData = {
    layer: number,
    [key: string | symbol]: any
}

interface AbstractNodeBlock extends BaseBlockData {
    type: 'node-abstract',
};

interface AssetNodeBlock extends BaseBlockData {
    type: 'node-asset',
}

interface InstanceNodeBlock extends BaseBlockData {
    type: 'node-instance',
}

export type BlockData =
    AbstractNodeBlock |
    AssetNodeBlock |
    InstanceNodeBlock;

export type NodeTypes = BlockData[`type`];

export type ExtractNodeType<T extends string> = T extends NodeTypes ? Extract<BlockData, { type: T }> : AbstractNodeBlock;

export type NarrowByType<TUnion, TType extends string> = TUnion extends { type: TType } ? TUnion : never;