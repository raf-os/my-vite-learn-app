import NodePanel from "./NodePanel";
import BaseNodeInstance from "../classes/BaseNodeInstance";
import { useState, useRef, useEffect } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { configNodeData } from "../utils";
import { AppLayers, type ICanvasRenderable } from "../types";
import { NodeSpaceContext, defaultSpaceContext } from "./NodeSpaceContext";
import ConnectionSingleton from "../classes/handlers/ConnectionSingleton";
import Coordinate from "../classes/Coordinate";

import Modal, { ModalSingleton } from "./Modal";
import AboutModal from "./modal-messages/About";

import AppMenuBar from "./AppMenuBar";

export default function NodeSpace() {
    const ref = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shouldCanvasRedraw = useRef<boolean>(false);
    const canvasOffset = useRef<Coordinate>(new Coordinate());
    const [ nodeSpaceState, setNodeSpaceState ] = useState<React.ReactElement<BaseNodeInstance>[]>([]);
    const [ nodeConnections, setNodeConnections ] = useState<ICanvasRenderable[]>(ConnectionSingleton.getConnections());

    const blockData = configNodeData({
        type: "node-space",
        layer: AppLayers.Space
    });

    const addNodeToSpace = (nodeObj: React.ReactElement<BaseNodeInstance>) => {
        const newState = [
            ...nodeSpaceState,
            nodeObj
        ];
        setNodeSpaceState(newState);
    }

    const appCtx = {
        ...defaultSpaceContext,
        addNodeToSpace,
    }

    const draw = (ctx: CanvasRenderingContext2D) => {
        if (shouldCanvasRedraw.current === true) {
            // In theory, this should only redraw when necessary. Might be too good to be true, keep an eye on it
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            nodeConnections.map(conn => conn.render(ctx, canvasOffset.current));

            shouldCanvasRedraw.current = false;
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        let animationFrame: number;

        if (canvas) {
            const bbox = canvas.getBoundingClientRect();
            canvasOffset.current = new Coordinate(bbox.x, bbox.y);
        }

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

    useEffect(() => {
        ModalSingleton.create(AboutModal);
        
        if (ref.current) {
            const el = ref.current;

            return dropTargetForElements({
                element: el,
                getData: () => (blockData),
            });
        }
    }, []);

    useEffect(() => { // Subscribing and unsubscribing to events
        const handleNodeConnectionUpdate = () => {
            setNodeConnections(ConnectionSingleton.getConnections());
            shouldCanvasRedraw.current = true;
        }

        const handleNodeDrawUpdate = () => {
            shouldCanvasRedraw.current = true;
        }

        ConnectionSingleton.events.on(['connectionAttach', 'connectionDetach'], handleNodeConnectionUpdate);
        ConnectionSingleton.events.on(['connectionUpdate'], handleNodeDrawUpdate)

        return () => {
            ConnectionSingleton.events.off(['connectionAttach', 'connectionDetach'], handleNodeConnectionUpdate);
            ConnectionSingleton.events.off(['connectionUpdate'], handleNodeDrawUpdate);
        }
    }, [ConnectionSingleton.events]);

    return (
        <NodeSpaceContext.Provider value={appCtx}>
            <div className="flex flex-col relative w-full h-full">
                <AppMenuBar />

                <div
                    className="w-full h-full relative"
                    data-slot="app-space"
                >
                    <canvas
                        id="appCanvasOverlay"
                        className="z-10 absolute top-0 left-0 pointer-events-none"
                        ref={canvasRef}
                    />

                    <div
                        className="relative w-full h-full"
                        id="appNodeSpaceState"
                        ref={ref}
                    >
                        { nodeSpaceState }
                    </div>
                    
                    <NodePanel />
                </div>

                <Modal />
            </div>
        </NodeSpaceContext.Provider>
    )
}