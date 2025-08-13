import { useRef, useEffect, useState, createContext, cloneElement } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { type IBaseNode } from "./components/BaseNode";
import { TAppLayers, NodeDragLine, type CoordArray, Coordinate } from "./types";
import { NodeConnection } from "./classes/NodeConnection";
import { configBlockData } from "./utils";
import { v4 as uuid } from "uuid";

import TestNode from "./components/nodes/TestNode";

type TAppContext = {
    appendNodeBlock: (...arg: any) => void,
    detachNodeBlock: (...arg: any) => void,
    addNodeLine: (initialPos: CoordArray, owner?: React.RefObject<HTMLDivElement | null>) => NodeDragLine | void,
    removeNodeLine: (nodeObj?: NodeDragLine) => void,
    addNodeConnection: (from: HTMLDivElement | null, to: HTMLDivElement | null) => NodeConnection | void,
    removeNodeConnection: (instance: NodeConnection) => void,
}

const defaultAppContext: TAppContext = {
    appendNodeBlock: () => {},
    detachNodeBlock: () => {},
    addNodeLine: () => {},
    removeNodeLine: () => {},
    addNodeConnection: () => {},
    removeNodeConnection: () => {},
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ isOver, setIsOver ] = useState(false);
    const [ spaceState, setSpaceState ] = useState<React.ReactElement<IBaseNode>[]>([]);
    const [ nodeLines, setNodeLines ] = useState<NodeDragLine[]>([]); // Temporary drag lines
    const [ nodeConnectionSpace, setNodeConnectionSpace ] = useState<NodeConnection[]>([]); // Active line connections

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

    const addNodeLine = (initialPos: CoordArray, owner?: React.RefObject<HTMLDivElement | null>) => {
        const nodeOwner = owner?.current;
        if (!nodeOwner) return;
        const selfBbox = ref.current?.getBoundingClientRect();
        const selfRelativePosition: CoordArray = [ selfBbox?.x || 0, selfBbox?.y || 0];
        const nlObject = new NodeDragLine(initialPos, selfRelativePosition, nodeOwner);
        setNodeLines(prev => [...prev, nlObject]);
        return nlObject;
    }

    const removeNodeLine = (nodeObj?: NodeDragLine) => {
        if (!nodeObj) return;
        if (nodeObj instanceof NodeDragLine) {
            const newState = nodeLines.filter(node => node !== nodeObj);
            setNodeLines(newState);
        }
    }

    const addNodeConnection: TAppContext['addNodeConnection'] = (from, to) => {
        if (!from || !to) return;
        const curSpace = nodeConnectionSpace.filter(nc => nc.originNode === from); // Remove existing connections
        const selfBbox = ref.current?.getBoundingClientRect();
        const selfRelativePosition = new Coordinate(selfBbox?.x, selfBbox?.y);
        const nodeConnection = new NodeConnection({
            from: from,
            to: to,
            baseOffset: selfRelativePosition
        });
        setNodeConnectionSpace([...curSpace, nodeConnection]);
        return nodeConnection;
    }

    const removeNodeConnection = (instance?: NodeConnection) => {
        if (!instance) return;
        if (instance instanceof NodeConnection) {
            const newState = nodeConnectionSpace.filter(node => node !== instance);
            setNodeConnectionSpace(newState);
        }
    }

    const draw = (ctx: CanvasRenderingContext2D) => {
        // TODO: Make so it only draws when something changes, instead of every frame.
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        nodeConnectionSpace.map(node => {
            node.requestRender(ctx);
        });

        nodeLines.map(node => {
            node.requestDraw(ctx);
        });
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

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        let animationFrame: any;

        if (ctx) {
            if (ref.current) {
                const bbox = ref.current.getBoundingClientRect();
                ctx.canvas.width = bbox.width;
                ctx.canvas.height = bbox.height;
            }
            const render = () => {
                draw(ctx);
                animationFrame = window.requestAnimationFrame(render);
            }
            render();

            return () => {
                window.cancelAnimationFrame(animationFrame);
            }
        }
    }, [draw]);

    const ctx: TAppContext = {
        appendNodeBlock,
        detachNodeBlock,
        addNodeLine,
        removeNodeLine,
        addNodeConnection,
        removeNodeConnection
    }

    return (
        <AppContext.Provider value={ctx}>
            <div
                className="w-full h-full relative"
                id="node-space-portal"
                ref={ref}
                {...rest}
            >
                <canvas
                    id="canvasOverlay"
                    className="z-20 absolute top-0 left-0 pointer-events-none"
                    ref={canvasRef}
                />

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