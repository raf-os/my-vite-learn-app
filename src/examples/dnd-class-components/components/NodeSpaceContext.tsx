import { createContext } from "react";
import { EventBus } from "../classes/Observable";

export type TCtxEventBus = {
    updateSortOrder: { nodeCount: number, targetId: string, currentIdx: number };
}

export type TNodeSpaceContext = {
    addNodeToSpace: (newObj: React.ReactElement<any>) => void,
    removeNodeFromSpace: () => void,
    bringNodeToFront: (id: string, currentIdx: number) => void,
    eventBus: EventBus<TCtxEventBus>,
}

export const defaultSpaceContext: TNodeSpaceContext = {
    addNodeToSpace: () => {},
    removeNodeFromSpace: () => {},
    bringNodeToFront: () => {},
    eventBus: new EventBus<{}>,
}

export const NodeSpaceContext = createContext<TNodeSpaceContext>(defaultSpaceContext);