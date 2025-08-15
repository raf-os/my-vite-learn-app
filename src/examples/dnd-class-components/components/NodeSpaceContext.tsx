import { createContext } from "react";

export type TNodeSpaceContext = {
    addNodeToSpace: (newObj: React.ReactElement<any>) => void,
    removeNodeFromSpace: () => void,
    markCanvasForUpdate: () => void,
}

export const defaultSpaceContext: TNodeSpaceContext = {
    addNodeToSpace: () => {},
    removeNodeFromSpace: () => {},
    markCanvasForUpdate: () => {},
}

export const NodeSpaceContext = createContext<TNodeSpaceContext>(defaultSpaceContext);