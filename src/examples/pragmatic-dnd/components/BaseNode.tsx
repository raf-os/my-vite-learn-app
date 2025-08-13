import NodePrimitive, { type INodePrimitive } from "./NodePrimitive";
import BaseIONode, {type IBaseIONode} from "./BaseIONode";
import { useRef, useState, createContext, useContext, useEffect } from "react";
import { AppContext } from "..";
import { Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Coordinate, TAppLayers } from "../types";
import { configBlockData } from "../utils";
import { NodeConnection } from "../classes/NodeConnection";

export type INodeIOConfig = Omit<IBaseIONode, "type">;

export interface IBaseNode extends INodePrimitive {
    header: React.ReactNode,
    posX?: number,
    posY?: number,
    inputs?: INodeIOConfig[],
    outputs?: INodeIOConfig[],
}

export interface IBaseNodeContext {
    owner: React.RefObject<HTMLDivElement | null> | null,
    connectNode: (self: HTMLDivElement, target: HTMLDivElement) => void,
}

const defaultNodeContext: IBaseNodeContext = {
    owner: null,
    connectNode: () => {},
}

export const BaseNodeContext = createContext<IBaseNodeContext>(defaultNodeContext);

export default function BaseNode({
    children,
    className,
    header,
    style,
    blockData,
    posX = 0,
    posY = 0,
    inputs,
    outputs,
    ...rest
}: IBaseNode) {
    const handleRef = useRef<HTMLDivElement>(null);
    const myRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<(HTMLDivElement | null | undefined)[]>([]);
    const [ myPos, setMyPos ] = useState<Coordinate>(new Coordinate(posX, posY));
    const [ connections, setConnections ] = useState<{ owner: HTMLDivElement, connection: NodeConnection}[]>([]);
    const { addNodeConnection, removeNodeConnection, updateConnectionPositions } = useContext(AppContext);

    const myData = configBlockData({
        type: "node-block",
        layer: TAppLayers.Space,
        ...blockData
    });

    const _style = {
        ...style,
        left: myPos.x,
        top: myPos.y,
    };

    const registerIO = (conf: INodeIOConfig[] | undefined, type: IBaseIONode['type']) => {
        return conf?.map((nd, idx) => (
            <BaseIONode
                label={nd.label}
                type={type}
                key={`${type}-${idx}`}
                nodeRef={node => registerNodeRef(node, idx)}
            />
        ));
    }

    const registerNodeRef = (node: HTMLDivElement | null, idx: number) => {
        if (node) {
            nodeRefs.current[idx] = node;
        } else {
            nodeRefs.current[idx] = undefined;
        }
    }

    const connectNode = (self: HTMLDivElement, target: HTMLDivElement) => {
        const nList = connections.filter(con => con.owner !== self);
        const nObj = addNodeConnection(self, target);
        if (nObj) {
            nList.push({
                owner: self,
                connection: nObj
            });
            setConnections(nList);
        }
    }

    const onSpaceDrop: INodePrimitive['onSpaceDrop'] = ({delta}, relativePos) => {
        const relative = relativePos.find(item => item.data['type'] === "node-space");
        const newPos = new Coordinate(
            (relative?.pos.x || 0) - delta.x,
            (relative?.pos.y || 0) - delta.y
        );
        setMyPos(newPos);
    }


    useEffect(() => {
        updateConnectionPositions();
    }, [myPos]);

    const ctx = {
        owner: myRef,
        connectNode,
    }

    return (
        <BaseNodeContext.Provider value={ctx}>
            <NodePrimitive
                className={cn(
                    "absolute bg-slate-200 rounded-box flex flex-col overflow-hidden",
                    className
                )}
                handleRef={handleRef}
                myRef={myRef}
                style={_style}
                onSpaceDrop={onSpaceDrop}
                blockData={myData}
                {...rest}
            >
                <div
                    data-slot="node-block-header"
                    className="flex items-center font-medium gap-1 p-2 bg-slate-500 text-neutral-50 cursor-pointer"
                    ref={handleRef}
                >
                    <div
                        className="grow-0 shrink-0"
                    >
                        <Grip size={20} />
                    </div>
                    <>{ header }</>
                </div>

                <div
                    data-slot="node-block-content"
                    className="p-1"
                >
                    { children }
                </div>

                <div
                    className="flex flex-col"
                    data-slot="node-block-IO"
                >
                    <div
                        className="text-sm font-bold px-1.5 select-none"
                    >
                        I/O nodes
                    </div>
                    { registerIO(inputs, "input") }
                    { registerIO(outputs, "output") }
                </div>
            </NodePrimitive>
        </BaseNodeContext.Provider>
    )
}