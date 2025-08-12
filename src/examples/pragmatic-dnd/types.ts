type TCoord = {
    x: number,
    y: number,
}

export const TAppLayers = {
    Space: 1 << 0,
    Panel: 1 << 1,
}

export const IODataTypes: Record<string, string> = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
}

/**
 * Given a type T that's made up of string: string pairs, gets all the values of each pair, that is, the second string in that pairing.
 */
type ExtractValues<T extends Record<string, string>> = T[keyof T];

export type TIOConfig = {
    type: "input" | "output",
    label?: React.ReactNode,
    dataType: ExtractValues<typeof IODataTypes>,
    accepts: ExtractValues<typeof IODataTypes>
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

    add(c2: Coordinate) {
        if (c2 instanceof Coordinate) {
            return new Coordinate(
                this._myPos.x + c2.x,
                this._myPos.y + c2.y
            );
        } else return this;
    }

    subtract(c2: Coordinate) {
        if (c2 instanceof Coordinate) {
            return new Coordinate(
                this._myPos.x - c2.x,
                this._myPos.y - c2.y
            );
        } else return this;
    }

    equals(c2: Coordinate) {
        return (this._myPos.x === c2.x && this._myPos.y === c2.y);
    }

    valueOf() {
        return {};
    }

    toString() {
        return `(${this._myPos.x}, ${this._myPos.y})`;
    }
}