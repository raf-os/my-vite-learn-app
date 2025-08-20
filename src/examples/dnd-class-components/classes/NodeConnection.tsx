import type { IONodeTypes } from "./BaseIONode";
import { v4 as uuid } from "uuid";
import type { ICanvasRenderable } from "../types";
import Coordinate from "./Coordinate";

export interface NodeConnectionData {
    nodeID: string,
    ownerID: string,
    obj: IONodeTypes;
}

export default class NodeConnection implements ICanvasRenderable {
    source: NodeConnectionData;
    target: NodeConnectionData;
    id: string;

    constructor(source: NodeConnectionData, target: NodeConnectionData) {
        this.source = source;
        this.target = target;
        this.id = uuid();
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.source.obj && this.target.obj) { // no refs, no problem
        }
    }
}