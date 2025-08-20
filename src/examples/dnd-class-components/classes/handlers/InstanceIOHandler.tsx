import type { IONode } from "../../types";
import type { BaseIONodeInput, BaseIONodeOutput } from "../BaseIONode";
import NodeConnection from "../NodeConnection";
import ConnectionSingleton from "./ConnectionSingleton";

type TIONode = {
    element: HTMLDivElement | null | undefined,
    id: string,
    obj: BaseIONodeInput | BaseIONodeOutput,
}

export default class InstanceIOHandler {
    connectedNodes: TIONode[] = [];
    owner: string;

    constructor(owner: string) {
        this.owner = owner;
    }

    register(node: TIONode) {
        this.connectedNodes.push(node);
    }

    unregister(nodeID: string) {
        this.connectedNodes = this.connectedNodes.filter(node => node.id !== nodeID);
    }

    connect(outputNode: IONode, inputNode: IONode) {
        const conn = new NodeConnection({
            nodeID: outputNode.id,
            ownerID: outputNode.owner,
            obj: outputNode.__obj,
        }, {
            nodeID: inputNode.id,
            ownerID: inputNode.id,
            obj: inputNode.__obj,
        });
        ConnectionSingleton.attach(conn);
    }
    
    disconnect(id: string) {
        ConnectionSingleton.removeByID(id);
    }
}