import type { IONodeTypes, BaseIONodeInput, BaseIONodeOutput } from "./BaseIONode";
import { v4 as uuid } from "uuid";
import type { ICanvasRenderable } from "../types";
import Coordinate from "./Coordinate";

export interface NodeConnectionData<T extends IONodeTypes = IONodeTypes> {
    nodeID: string,
    ownerID: string,
    obj: T;
}

export default class NodeConnection implements ICanvasRenderable {
    source: NodeConnectionData<BaseIONodeOutput>;
    target: NodeConnectionData<BaseIONodeInput>;
    sourcePos: Coordinate = new Coordinate();
    targetPos: Coordinate = new Coordinate();
    id: string;

    constructor(source: NodeConnectionData<BaseIONodeOutput>, target: NodeConnectionData<BaseIONodeInput>) {
        this.source = source;
        this.target = target;
        this.id = uuid();
        this.updatePositions();
    }

    updatePositions() {
        const sObj = this.source.obj;
        const tObj = this.target.obj;

        if (!sObj || !tObj) return;
        if (!sObj.handleRef.current || !tObj.handleRef.current) return;

        const sBox = sObj.handleRef.current.getBoundingClientRect();
        const tBox = tObj.handleRef.current.getBoundingClientRect();

        this.sourcePos = new Coordinate(
            sBox.x + sBox.width / 2,
            sBox.y + sBox.height / 2
        );

        this.targetPos = new Coordinate(
            tBox.x + tBox.width / 2,
            tBox.y + tBox.height /2
        );
    }

    render(ctx: CanvasRenderingContext2D, offset: Coordinate = new Coordinate()) {
        const sObj = this.source.obj;
        const tObj = this.target.obj;

        if (!sObj || !tObj) return;
        if (sObj.handleRef.current && tObj.handleRef.current) {
            ctx.fillStyle = "#000000";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(this.sourcePos.x - offset.x, this.sourcePos.y - offset.y);
            ctx.lineTo(this.targetPos.x - offset.x, this.targetPos.y - offset.y);
            ctx.stroke();
        }
    }
}