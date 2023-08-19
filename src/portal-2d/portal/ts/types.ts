enum Direction {
    UP=Math.PI,
    RIGHT=Math.PI/2,
    DOWN=0,
    LEFT=(Math.PI/2)*3
}

enum BlockTypes {
    AIR = 0,
    SOLID = 1,
    PAINT = 2,
    PLAYER = -1
}

enum PortalColor {
    ORANGE,
    BLUE
}

class Vector2 {
    _x: any
    _y: any
    constructor(x: any, y: any) {
        this._x = x
        this._y = y
    }
    // boundedvector needs accessors, so this also needs accessors
    get x() { return this._x }
    get y() { return this._y }
    set x(v: any) { this._x = v }
    set y(v: any) { this._y = v }
    
    get min() { return Math.min(this.x, this.y) }
    get max() { return Math.max(this.x, this.y) }

    offsetNew(x: any, y: any) {
        return new Vector2(this.x + x, this.y + y)
    }

    clone() {
        return new Vector2(this.x, this.y)
    }
}
class BoundedVector2 extends Vector2 {
    boundX: Vector2
    boundY: Vector2
    constructor(x: any, y: any, boundX: Vector2, boundY: Vector2) {
        super(x, y)
        this.boundX = boundX
        this.boundY = boundY
    }
    get x() { return this._x }
    get y() { return this._y }
    set x(v: number) { this._x = this.boundX.x !== null && this.boundX.y !== null ? Math.max(this.boundX.x, Math.min(this.boundX.y, v)) :
                                this.boundX.x !== null ? Math.min(this.boundX.y, v) :
                                this.boundX.y !== null ? Math.max(this.boundX.x, v) :
                                v
    }
    set y(v: number) { this._y = this.boundY.x !== null && this.boundY.y !== null ? Math.max(this.boundY.x, Math.min(this.boundY.y, v)) :
                                this.boundY.x !== null ? Math.min(this.boundY.y, v) :
                                this.boundY.y !== null ? Math.max(this.boundY.x, v) :
                                v
    }
    set overrideX(v: number) { this._x = v }
    set overrideY(v: number) { this._y = v }

    clone() {
        return new BoundedVector2(this.x, this.y, this.boundX, this.boundY)
    }
}
export {Direction, Vector2, BoundedVector2, BlockTypes, PortalColor}
