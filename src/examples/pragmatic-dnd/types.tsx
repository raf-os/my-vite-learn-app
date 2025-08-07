type TCoord = {
    x: number,
    y: number,
}

export class Coordinate {
    private _myPos: TCoord;

    constructor(x?: number, y?: number) {
        this._myPos = {
            x: x || 0,
            y: y || 0,
        }
    }

    get x(): number {
        return this._myPos.x;
    }

    get y(): number {
        return this._myPos.y;
    }

    getLocation() {
        return this._myPos;
    }

    add(c2: InstanceType<typeof Coordinate>) {
        if (c2 instanceof Coordinate) {
            return new Coordinate(
                this._myPos.x + c2.x,
                this._myPos.y + c2.y
            );
        } else return this;
    }

    subtract(c2: InstanceType<typeof Coordinate>) {
        if (c2 instanceof Coordinate) {
            return new Coordinate(
                this._myPos.x - c2.x,
                this._myPos.y - c2.y
            );
        } else return this;
    }

    valueOf() {
        return {};
    }

    toString() {
        return `(${this._myPos.x}, ${this._myPos.y})`;
    }
}