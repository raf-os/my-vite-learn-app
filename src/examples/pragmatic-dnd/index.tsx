import { useRef, useEffect, useState, createContext, cloneElement } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { type IBaseNode } from "./components/BaseNode";
import { TAppLayers } from "./types";
import { configBlockData } from "./utils";
import { v4 as uuid } from "uuid";

import TestNode from "./components/nodes/TestNode";

type TAppContext = {
    appendNodeBlock: (...arg: any) => void,
    detachNodeBlock: (...arg: any) => void,
}

const defaultAppContext: TAppContext = {
    appendNodeBlock: () => {},
    detachNodeBlock: () => {},
}

export const AppContext = createContext<TAppContext>(defaultAppContext);

export default function PragmaticDNDTestPage() {
    return (
        <div
            className="flex flex-col gap-4 w-full h-full grow-1 shrink-1"
        >
            <div
                className="grow-0 shrink-0 w-full text-center"
            >
                DND using pragmatic dnd
            </div>

            <div
                className="flex grow-1 shrink-1 w-full p-8"
            >
                <div
                    className="grid-bg rounded-[8px] grow-1 relative overflow-hidden"
                    data-slot="app-space"
                >
                    <NodeSpaceWrapper>
                        <div
                            className="absolute right-0 top-0 flex p-4 w-1/4 min-h-[128px] h-full justify-end"
                        >
                            <NodeListPanel />
                        </div>
                    </NodeSpaceWrapper>
                </div>
            </div>
        </div>
    )
}

function NodeListPanel() {
    const ref = useRef<HTMLDivElement>(null);
    const blockData = configBlockData({
        type: "node-panel",
        layer: TAppLayers.Panel
    });

    useEffect(() => {
        if (ref.current) {
            const el = ref.current;

            return dropTargetForElements({
                element: el,
                getData: () => (blockData),
            });
        }
    })

    return (
        <div
            className="grow-0 shrink-0 top-4 right-4 w-full h-full p-2 bg-neutral-100 rounded-box flex flex-col gap-4"
            ref={ref}
        >
            <div
                className="text-lg text-slate-700 font-bold border-slate-700 border-b-2 p-2"
            >
                Node List
            </div>

            <div
                className="bg-neutral-200 rounded-box grow-1 shrink-1 h-full p-2 overflow-hidden"
                data-slot="node-preset-list"
            >
                <TestNode />
            </div>
        </div>
    )
}

interface INodeSpaceWrapperProps extends React.ComponentPropsWithoutRef<'div'> {
}

function NodeSpaceWrapper({
    children,
    ...rest
}: INodeSpaceWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [ isOver, setIsOver ] = useState(false);
    const [ spaceState, setSpaceState ] = useState<React.ReactElement<IBaseNode>[]>([]);

    const blockData = configBlockData({
        type: "node-space",
        layer: TAppLayers.Space
    });

    const appendNodeBlock = (node: React.ReactElement<IBaseNode>, posX: number, posY: number) => {
        const nodeID = uuid();
        const newNode = cloneElement(node,
            {
                key: `node-block(id:${nodeID})`,
                posX: posX,
                posY: posY,
            }
        )
        setSpaceState(prev => [...prev, newNode]); // TODO: Investigate why this was necessary to work
    };

    const detachNodeBlock = () => {};

    const ctx: TAppContext = {
        appendNodeBlock,
        detachNodeBlock
    }

    useEffect(() => {
        if (ref.current) {
            const el = ref.current;

            return dropTargetForElements({
                element: el,
                getData: () => (blockData),
                onDrop: () => setIsOver(false),
            });
        }
    }, []);

    return (
        <AppContext.Provider value={ctx}>
            <div
                className="w-full h-full relative"
                id="node-space-portal"
                ref={ref}
                {...rest}
            >
                <div
                    className="relative w-full h-full"
                >
                    { spaceState }
                </div>
                { children }
            </div>
        </AppContext.Provider>
    )
}