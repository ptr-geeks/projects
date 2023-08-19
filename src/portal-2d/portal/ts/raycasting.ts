import { Vector2, Direction, BlockTypes } from "./types.js"

class BoundedBox {
    start: Vector2
    width: number
    height: number
    type: BlockTypes

    constructor(start: Vector2, width: number, height: number, type: BlockTypes) {
        this.start = start
        this.width = width
        this.height = height
        this.type = type
    }

    get x1() { return this.start.x }
    get y1() { return this.start.y }
    get x2() { return this.start.x + this.width }
    get y2() { return this.start.y + this.height }

    set x1(v) { this.start.x = v }
    set y1(v) { this.start.y = v }
    set x2(v) { this.width = v - this.start.x }
    set y2(v) { this.height = v - this.start.y }

    toEdges() {
        return [
            new Edge(new Vector2(this.x1, this.y1), new Vector2(this.x1, this.y2)),
            new Edge(new Vector2(this.x1, this.y1), new Vector2(this.x2, this.y1)),
            new Edge(new Vector2(this.x2, this.y1), new Vector2(this.x2, this.y2)),
            new Edge(new Vector2(this.x1, this.y2), new Vector2(this.x2, this.y2))
        ]
    }
    toVertices() {
        return [
            new Vector2(this.x1, this.y1),
            new Vector2(this.x1, this.y2),
            new Vector2(this.x2, this.y1),
            new Vector2(this.x2, this.y2)
        ]
    }
    isInBox(point: Vector2) {
        return Math.min(this.x1, this.x2) <= point.x && point.x <= Math.max(this.x1, this.x2) &&
               Math.min(this.y1, this.y2) <= point.y && point.y <= Math.max(this.y1, this.y2)
    }
    /*
        box1 = (xmin1, xmax1)
        box2 = (xmin2, xmax2)
        isOverlapping1D(box1,box2) = xmax1 >= xmin2 and xmax2 >= xmin1
    */

    overlaps(box: BoundedBox) {
        const ov1d = (v1: Vector2, v2: Vector2): boolean => v1.max > v2.min && v2.max > v1.min
        const x1min = Math.min(this.x1, this.x2), x1max = Math.max(this.x1, this.x2)
        const y1min = Math.min(this.y1, this.y2), y1max = Math.max(this.y1, this.y2)
        const x2min = Math.min(box.x1, box.x2), x2max = Math.max(box.x1, box.x2)
        const y2min = Math.min(box.y1, box.y2), y2max = Math.max(box.y1, box.y2)
        const res = ov1d(new Vector2(x1min, x1max), new Vector2(x2min, x2max)) &&
               ov1d(new Vector2(y1min, y1max), new Vector2(y2min, y2max))
        return res
    }
}
class Edge {
    vertex1: Vector2
    vertex2: Vector2

    constructor(vertex1: Vector2, vertex2: Vector2) {
        this.vertex1 = new Vector2(Math.min(vertex1.x, vertex2.x), Math.min(vertex1.y, vertex2.y))
        this.vertex2 = new Vector2(Math.max(vertex1.x, vertex2.x), Math.max(vertex1.y, vertex2.y))
    }
}

enum IntersectTypes {
    NONE,
    BEFORE,
    AFTER
}
class IntersectInfo {
    intersectType: IntersectTypes
    edge: Edge
    distance: number
    box: BoundedBox

    constructor(intersectType: IntersectTypes, edge: Edge, distance: number, box: BoundedBox) {
        this.intersectType = intersectType
        this.edge = edge
        this.distance = distance
        this.box = box
    }
}
class WideRay {
    position: Vector2
    direction: number
    width: number

    constructor(position: Vector2, direction: Direction, width: number) {
        this.position = position
        this.direction = direction
        this.width = width
    }

    intersects(box: BoundedBox): IntersectInfo[] {
        const list = box.toEdges().map(edge => {
            const th = this.direction
            const v1a = new Vector2(edge.vertex1.x - this.position.x, edge.vertex1.y - this.position.y),
                  v2a = new Vector2(edge.vertex2.x - this.position.x, edge.vertex2.y - this.position.y)
            const v1r = new Vector2(v1a.x * Math.cos(th) - v1a.y * Math.sin(th) + this.position.x,
                                    v1a.x * Math.sin(th) + v1a.y * Math.cos(th) + this.position.y),
                  v2r = new Vector2(v2a.x * Math.cos(th) - v2a.y * Math.sin(th) + this.position.x,
                                    v2a.x * Math.sin(th) + v2a.y * Math.cos(th) + this.position.y)
            let valid = clg(Math.min(v1r.x, v2r.x), 10) < flr(this.position.x + this.width/2, 10) && flr(Math.max(v1r.x, v2r.x), 10) > flr(this.position.x - this.width/2, 10)
            if (edge.vertex1.x == 2 && edge.vertex1.y == 6 && edge.vertex2.x == 2 && edge.vertex2.y == 7 && (this.direction == Direction.RIGHT || this.direction == Direction.LEFT)) {
                let x = edge.vertex1
            }

            if (!valid) {
                return new IntersectInfo(IntersectTypes.NONE, edge, 0, box)
            } else {
                let slope = (v1r.y - v2r.y)/(v1r.x-v2r.x)
                const angle = Math.atan(slope)
                if (Math.abs(angle) > (Math.PI/2)*0.99) return new IntersectInfo(IntersectTypes.NONE, edge, 0, box)
                const leftestPoint = v1r.x < v2r.x ? v1r : v2r
                const distance = +((leftestPoint.y+slope*(this.position.x - leftestPoint.x)) - this.position.y).toFixed(12)
                if (distance < 0) {
                    return new IntersectInfo(IntersectTypes.BEFORE, edge, distance, box)
                }
                return new IntersectInfo(IntersectTypes.AFTER, edge, distance, box)
            }
        })
        const sorted = list.sort(sortIntersects)
        return sorted
    }
}

function sortIntersects(a: IntersectInfo, b: IntersectInfo) {
    // != je xor
    if ((a.intersectType == IntersectTypes.NONE) != (b.intersectType == IntersectTypes.NONE)) {
        return a.intersectType == IntersectTypes.NONE ? 1 : -1
    }
    if (a.distance < 0 != b.distance < 0) {
        if (a.distance < 0) return 1
        return -1
    }
    return a.distance < b.distance ? -1 : a.distance == b.distance ? 0 : 1
}

function rnd(i: number, d: number) {
    return +(i.toFixed(d))
}
function flr(i: number, d: number) {
    return Math.floor(i*(10**d))/(10**d)
}
function clg(i: number, d: number) {
    return Math.ceil(i*(10**d))/(10**d)
}

export {IntersectTypes, WideRay, BoundedBox, sortIntersects}
