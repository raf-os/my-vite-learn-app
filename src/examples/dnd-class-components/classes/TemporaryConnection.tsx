import { type ICanvasRenderable } from "../types";
import Coordinate from "./Coordinate";
import { v4 as uuid } from "uuid";
import ConnectionSingleton from "./handlers/ConnectionSingleton";

export default class TemporaryNodeConnection implements ICanvasRenderable {
    id: string = uuid();
    nodeObj: HTMLDivElement;
    initialPos: Coordinate;
    targetPos: Coordinate;

    constructor(nodeObj: HTMLDivElement | null) {
        if (!nodeObj) throw(new Error("No node object reference passed to a TemporaryNodeConnection object."));
        this.nodeObj = nodeObj;

        const { x, y, width, height } = nodeObj.getBoundingClientRect();
        this.initialPos = new Coordinate(x + width / 2, y + height / 2);
        this.targetPos = this.initialPos;
        ConnectionSingleton.attach(this);
    }

    updatePositions(newPos: Coordinate) {
        this.targetPos = newPos;
        ConnectionSingleton.events.emit('connectionUpdate', undefined);
    }

    kill() {
        ConnectionSingleton.detach(this);
    }

    render(ctx: CanvasRenderingContext2D, baseOffset: Coordinate = new Coordinate()) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(this.initialPos.x - baseOffset.x, this.initialPos.y - baseOffset.y);
        ctx.lineTo(this.targetPos.x - baseOffset.x, this.targetPos.y - baseOffset.y);
        ctx.stroke();
    };
}