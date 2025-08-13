import { Coordinate } from "../types";
import { v4 as uuid } from "uuid";

export type NodeConnectionProps = {
    from: HTMLDivElement,
    to: HTMLDivElement,
    baseOffset?: Coordinate
}

export class NodeConnection {
    private baseOffset: Coordinate;
    private _myID: string;
    originNode: HTMLDivElement;
    targetNode: HTMLDivElement;
    originPos: Coordinate;
    targetPos: Coordinate;

    constructor({
        from,
        to,
        baseOffset
    }: NodeConnectionProps) {
        this._myID = uuid();
        this.baseOffset = baseOffset || new Coordinate(0, 0);
        this.originNode = from;
        this.targetNode = to;

        this.originPos = new Coordinate();
        this.targetPos = new Coordinate();

        this.updatePositions();
    }

    updateOffset(newOffset: Coordinate) {
        this.baseOffset = newOffset;
    }

    updatePositions() {
        if (!this.originNode || !this.targetNode) return;

        const originPos = this.originNode.getBoundingClientRect();
        const targetPos = this.targetNode.getBoundingClientRect();

        const scrollY = globalThis.scrollY;

        this.originPos = (new Coordinate(originPos.x + (originPos.width / 2), originPos.y + (originPos.height / 2) + scrollY)).subtract(this.baseOffset);
        this.targetPos = (new Coordinate(targetPos.x + (targetPos.width / 2), targetPos.y + (targetPos.height / 2) + scrollY)).subtract(this.baseOffset);
    }

    get offset() {
        return this.baseOffset;
    }

    get id() {
        return this._myID;
    }

    requestRender(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(this.originPos.x, this.originPos.y);
        ctx.lineTo(this.targetPos.x, this.targetPos.y);
        ctx.stroke();
    }
}