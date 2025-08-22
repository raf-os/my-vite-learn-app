import { createContext } from "react";

export type TNodeSpaceContext = {
    addNodeToSpace: (newObj: React.ReactElement<any>) => void,
    removeNodeFromSpace: () => void,
    pushNodeToTop: (id: string) => void,
}

export const defaultSpaceContext: TNodeSpaceContext = {
    addNodeToSpace: () => {},
    removeNodeFromSpace: () => {},
    pushNodeToTop: () => {},
}

export const NodeSpaceContext = createContext<TNodeSpaceContext>(defaultSpaceContext);