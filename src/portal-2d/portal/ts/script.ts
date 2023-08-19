// test
import { Vector2, BoundedVector2, Direction, BlockTypes, PortalColor } from "./types.js"
import { IntersectTypes, WideRay, BoundedBox, sortIntersects } from "./raycasting.js"

const gbi = (id: string) => document.getElementById(id)
const canvas = gbi("maincanvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!

const GRAVITY = 9.8

interface worldType {
    map: BlockTypes[]
    size: Vector2
    viewableSize: Vector2
    boundedBoxes: BoundedBox[]
    allBoxes: BoundedBox[]
}
let world: worldType = {
    map: [
        1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    /*map: [
        2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2,
        2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 2,
        2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2,
        2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
        2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2,
        1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
        2, 2, 2, 2, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1,
        2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 1, 1, 0, 0, 0, 1,
        2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 1, 1, 0, 0, 1,
        2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1,
        2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1,
        2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1 
    ],*/
    size: new Vector2(13, 9),
    boundedBoxes: [],
    allBoxes: [],
    viewableSize: new Vector2(13, 9),
}
world.boundedBoxes = world.map.map((v, i, _) => v != BlockTypes.AIR ? new BoundedBox(new Vector2(i%world.size.x, Math.floor(i/world.size.x)), 1, 1, v) : null).filter(v => v !== null)
world.allBoxes = world.map.map((v, i, _) => new BoundedBox(new Vector2(i%world.size.x, Math.floor(i/world.size.x)), 1, 1, v))

class Portal {
    color: PortalColor
    direction: number
    center: Vector2
    static width: number = 2
    constructor(color: PortalColor, direction: number, center: Vector2) {
        this.color = color
        this.direction = direction
        this.center = center
    }
}

class SpriteDescriptor {
    start: Vector2
    width: number
    height: number
    image: HTMLImageElement
    name: string
    constructor(start: Vector2, width: number, height: number, image: HTMLImageElement, name: string) {
        this.start = start
        this.height = height
        this.width = width
        this.image = image
        this.name = name
    }
    asDrawArgs(dx, dy, dw, dh) {
        return [this.image, this.start.x, this.start.y, this.width, this.height, dx, dy, dw, dh]
    }
}

class AnimationState {
    lastAnimationTime: number
    animationTimer: number
    thisFrame: SpriteDescriptor
    frames: Map<string, SpriteDescriptor>
    constructor(lastAnimationTime: number, animationTimer: number, thisFrame: SpriteDescriptor, frames: Map<string, SpriteDescriptor>) {
        this.lastAnimationTime = lastAnimationTime
        this.animationTimer = animationTimer
        this.thisFrame = thisFrame
        this.frames = frames
    }
}

class Player {
    drawConfig: DrawConfig
    spawn: Vector2
    position: BoundedBox
    velocity: Vector2
    acceleration: number
    onSurface: Set<Direction>
    jumpVelocity: number
    animations: AnimationState
    constructor(drawConfig: DrawConfig, spawn: Vector2, width: number, height: number, acceleration: number, animations: AnimationState, maxSpeed: number = 5) {
        this.drawConfig = drawConfig
        this.spawn = spawn
        this.position = new BoundedBox(spawn, width, height, BlockTypes.PLAYER)
        this.velocity = new BoundedVector2(0, 0, new Vector2(-maxSpeed, maxSpeed), new Vector2(null, null))
        this.acceleration = acceleration
        this.onSurface = new Set()
        this.animations = animations
        this.jumpVelocity = 5
    }

    move() {
        this.velocity.y = this.velocity.y + GRAVITY * this.drawConfig.dt
        const prevVelocity = this.velocity.clone()
        const LeftRay  = new WideRay(this.position.start.offsetNew(0, this.position.height/2), Direction.LEFT, this.position.height)
        const RightRay = new WideRay(this.position.start.offsetNew(this.position.width, this.position.height/2), Direction.RIGHT, this.position.height)
        const UpRay    = new WideRay(this.position.start.offsetNew(this.position.width/2, 0), Direction.UP, this.position.width)
        const DownRay  = new WideRay(this.position.start.offsetNew(this.position.width/2, this.position.height), Direction.DOWN, this.position.width)
        const rayMap = new Map([[Direction.DOWN, DownRay], [Direction.UP, UpRay], [Direction.LEFT, LeftRay], [Direction.RIGHT, RightRay]])

        let realMoveAmount = new Vector2(this.velocity.x * this.drawConfig.dt, this.velocity.y * this.drawConfig.dt)

        rayMap.forEach((ray, direction, _) => {
            const edges = world.boundedBoxes.flatMap(v => ray.intersects(v)).sort(sortIntersects)

            const badBeforeEdges = edges.filter(edge => { return ((edge.intersectType == IntersectTypes.BEFORE) && (
                Math.abs(edge.distance) < 
                rnd(Math.abs((Math.sin(direction))), 2)*this.position.width+rnd(Math.abs(Math.cos(direction)), 2)*this.position.height))})
            const firstEdge = badBeforeEdges.length == 0 ? edges[0] : badBeforeEdges[0]
            const expectedMoveAmount = new Vector2(this.velocity.x * this.drawConfig.dt, this.velocity.y * this.drawConfig.dt)
            if ((firstEdge.intersectType != IntersectTypes.NONE) && ((firstEdge.intersectType != IntersectTypes.BEFORE || badBeforeEdges.length != 0))) {
                if (Math.sin(direction)*expectedMoveAmount.x+(Math.cos(direction))*expectedMoveAmount.y > firstEdge.distance) {
                    this.onSurface.add(direction)
                    this.velocity.x = rnd(Math.abs(Math.cos(direction))*this.velocity.x, 6)
                    this.velocity.y = rnd(Math.abs(Math.sin(direction))*this.velocity.y, 6)
                    realMoveAmount.x = closestToZero(Math.sin(direction) * firstEdge.distance + Math.cos(direction)*realMoveAmount.x, realMoveAmount.x)
                    realMoveAmount.y = closestToZero(Math.cos(direction) * firstEdge.distance + Math.sin(direction)*realMoveAmount.y, realMoveAmount.y)
                } else { this.onSurface.delete(direction) }
            }
        })
        if (this.velocity != prevVelocity) {
            rayMap.forEach((ray, _, __) => {
                const portalBlue = portals.get(PortalColor.BLUE)
                const portalOrange = portals.get(PortalColor.ORANGE)

                const intersects = new Map([portalBlue, portalOrange].filter(p => p !== null).map(portal => ray.intersects(new BoundedBox(
                    new Vector2(portal.center.x-(Portal.width/2)*Math.abs(Math.cos(portal.direction)), portal.center.y-(Portal.width/2)*Math.abs(Math.sin(portal.direction))),
                    Portal.width*Math.abs(Math.cos(portal.direction)),
                    Portal.width*Math.abs(Math.sin(portal.direction)),
                    0
                ))).map((v, i, _) => [[portalBlue, portalOrange][i], v.sort(sortIntersects)]))
                
                if (intersects.get(portalBlue) !== undefined && intersects.get(portalOrange) !== undefined && intersects.get(portalBlue)[0].intersectType == IntersectTypes.AFTER && intersects.get(portalBlue)[0].distance == 0) {
                    this.position.x1 = portalOrange.center.x-this.position.width*(+(0 < portalOrange.direction && portalOrange.direction < Math.PI))//+(this.position.x1 - portalBlue.center.x)
                    this.position.y1 = portalOrange.center.y-this.position.height*(+!(Math.PI/2 <= portalOrange.direction && portalOrange.direction <= 3*Math.PI/2))//+(this.position.y1 - portalBlue.center.y)
                    this.velocity.x = prevVelocity.x*Math.cos(portalBlue.direction-portalOrange.direction-Math.PI/2)
                    this.velocity.y = prevVelocity.y*Math.cos(portalBlue.direction-portalOrange.direction-Math.PI/2)

                    realMoveAmount.x = this.velocity.x * this.drawConfig.dt
                    realMoveAmount.y = this.velocity.y * this.drawConfig.dt
                } 
                /*if (intersects.get(portalOrange) !== undefined && intersects.get(portalBlue) !== undefined && intersects.get(portalOrange)[0].intersectType == IntersectTypes.AFTER && intersects.get(portalOrange)[0].distance == 0) {
                    this.position.x1 = portalBlue.center.x-this.position.width*(+(0 < portalBlue.direction && portalBlue.direction < Math.PI))//+(this.position.x1 - portalOrange.center.x)
                    this.position.y1 = portalBlue.center.y-this.position.height*(+!(Math.PI/2 <= portalBlue.direction && portalBlue.direction <= 3*Math.PI/2))//+(this.position.y1 - portalOrange.center.y)
                    this.velocity.x = prevVelocity.x*Math.cos(portalOrange.direction-portalBlue.direction-Math.PI/2)
                    this.velocity.y = prevVelocity.y*Math.cos(portalOrange.direction-portalBlue.direction-Math.PI/2)

                    realMoveAmount.x = this.velocity.x * this.drawConfig.dt
                    realMoveAmount.y = this.velocity.y * this.drawConfig.dt
                }*/


                 //Math.floor(drawConfig.margin.x+(portal.center.x-(Portal.width/2)*Math.abs(Math.cos(portal.direction)))*drawConfig.ratio),
                 //Math.floor(drawConfig.margin.y+(portal.center.y-(Portal.width/2)*Math.abs(Math.sin(portal.direction)))*drawConfig.ratio),
                 //Portal.width*Math.abs(Math.cos(portal.direction))*drawConfig.ratio + 0.1*-Math.sin(portal.direction)*drawConfig.ratio,
                 //Portal.width*Math.abs(Math.sin(portal.direction))*drawConfig.ratio + 0.1*-Math.cos(portal.direction)*drawConfig.ratio
            })
        }
        this.position.x1 = rnd(this.position.x1 + realMoveAmount.x, 5)
        this.position.y1 = rnd(this.position.y1 + realMoveAmount.y, 5)
    }

    shoot(color: PortalColor, direction: number) {
        const shootOrigin = this.position.start.offsetNew(this.position.width/2, this.position.height/2)
        const ray = new WideRay(shootOrigin, direction, 0)
        const edges = world.boundedBoxes.flatMap(v => ray.intersects(v)).sort(sortIntersects)
        const firstEdge = edges[0]
        if (firstEdge.intersectType != IntersectTypes.AFTER) return false
        if (firstEdge.box.type != BlockTypes.PAINT) return false
        let slope = (firstEdge.edge.vertex1.y - firstEdge.edge.vertex2.y)/(firstEdge.edge.vertex1.x-firstEdge.edge.vertex2.x)
        const angle = (Math.atan(slope)+Math.PI*(+((0+Math.PI/2*Math.cos(Math.atan(slope))) < direction && direction <= (Math.PI+Math.PI/2*Math.cos(Math.atan(slope)))))+(2*Math.PI))%(2*Math.PI)
        const shotPoint = new Vector2((firstEdge.edge.vertex1.x+firstEdge.edge.vertex2.x)/2, (firstEdge.edge.vertex1.y+firstEdge.edge.vertex2.y)/2)
        const wallBox = new BoundedBox(
            new Vector2(shotPoint.x-(Portal.width/2)*Math.abs(Math.cos(angle)), shotPoint.y-(Portal.width/2)*Math.abs(Math.sin(angle))),
            Portal.width*Math.abs(Math.cos(angle)) + 0.1*Math.sin(angle),
            Portal.width*Math.abs(Math.sin(angle)) + 0.1*Math.cos(angle),
            0
        )
        const airBox = new BoundedBox(
            new Vector2(
                rnd(shotPoint.x-(Portal.width/2)*Math.abs(Math.cos(angle)), 5),
                rnd(shotPoint.y-(Portal.width/2)*Math.abs(Math.sin(angle)), 5)
            ),
            rnd(Portal.width*Math.abs(Math.cos(angle)) + 0.1*-Math.sin(angle), 5),
            rnd(Portal.width*Math.abs(Math.sin(angle)) + 0.1*-Math.cos(angle), 5),
            0
        )
        if (world.allBoxes.filter(box => box.overlaps(wallBox) && box.type != BlockTypes.PAINT).length > 0) return false
        if (world.allBoxes.filter(box => box.overlaps(airBox)  && box.type != BlockTypes.AIR)  .length > 0) return false
        portals.set(color, new Portal(color, angle/*(-(Math.PI/2 < direction && direction <= 3*Math.PI/2))*/, shotPoint))
    }
    animate() {
        let rgm = this.animations.thisFrame.name.match(/(\D+)(\d+)/);
        let name: string
        const frames = this.animations.frames
        if (rnd(this.velocity.x, 5) == 0 && rnd(this.velocity.y, 5) == 0) {
            name = "idle"
        } else if (Math.abs(this.velocity.x) <= Math.abs(this.velocity.y)) {
            if (this.velocity.y < 0) name = "jump"
            else name = "fall"
        } else if (Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {
            if (rnd(this.velocity.y, 5) == 0) {
                if (this.velocity.x > 0) name = "runRight"
                else name = "runLeft"
            } else {
                if (this.velocity.x > 0) name = "fallRight"
                else name = "fallLeft"
            }
        } else {
            throw Error("what")
        }

        this.animations.thisFrame = this.animations.frames.get(name+rgm[2])
        if (this.animations.lastAnimationTime > this.animations.animationTimer) {
            this.animations.thisFrame = frames.has(name + (+rgm[2]+1)) ? frames.get(name + (+rgm[2]+1)) : frames.get(name + "0")
            this.animations.lastAnimationTime = 0
        }
    }
}
class DrawConfig {
    ratio: number
    margin: Vector2
    size: Vector2
    dt: number
    elapsed: number
    elapsedTimers: Map<string, number>
    constructor(ratio: number, size: Vector2, margin: Vector2) {
        this.ratio = ratio
        this.size = size
        this.margin = margin
        this.elapsedTimers = new Map()
    }
}

let pressedKeys: Set<string> = new Set()
let mousePos: Vector2 = new Vector2(0, 0)
let portals: Map<PortalColor, Portal|null> = new Map([[PortalColor.BLUE, null], [PortalColor.ORANGE, null]])

let prevTime = performance.now(), elapsed = 0

function init() {
    window.addEventListener("resize", onWindowResize)
    window.addEventListener("keydown", event => pressedKeys.add(event.code))
    window.addEventListener("keyup", event => pressedKeys.delete(event.code))
    canvas.addEventListener("mousedown", event => pressedKeys.add("Mouse" + event.button))
    canvas.addEventListener("mouseup", event => pressedKeys.delete("Mouse" + event.button))

    canvas.addEventListener("contextmenu", event => {event.preventDefault(); return false})

    window.addEventListener("mousemove", event => {
        mousePos = new Vector2(event.x, event.y)
        //let a = (mousePos.y-drawConfig.margin.y)*(1/drawConfig.ratio)-player.position.y1, b = (mousePos.x-drawConfig.margin.x)*(1/drawConfig.ratio)-player.position.x1
        //console.log(b, a)
        //console.log((Math.atan2(-a, b)+(Math.PI/2)+(2*Math.PI))%(2*Math.PI))
    })
    drawConfig.elapsedTimers.set("player", 0)
    drawConfig.elapsedTimers.set("blocks", 0)

    window.requestAnimationFrame(gameLoop)


    function onWindowResize() {
        canvas.width = Math.floor(window.innerWidth), canvas.height = window.innerHeight
    }
}

const v2 = (x, y) => new Vector2(x, y)
const sprites = new Image()
sprites.src = "/images/spritesheet.png"

let drawConfig: DrawConfig = new DrawConfig(0, new Vector2(0, 0), new Vector2(0, 0))
let player: Player = new Player(drawConfig, new Vector2(1, 4.5), 1, 1.5, 20, new AnimationState(
    0, 500, null, 
    new Map([
        ["idle0", new SpriteDescriptor(v2(0, 0), 200, 300, sprites, "idle0")],
        ["idle1", new SpriteDescriptor(v2(200, 0), 200, 300, sprites, "idle1")],
        ["runRight0", new SpriteDescriptor(v2(400, 0), 200, 300, sprites, "runRight0")],
        ["runRight1", new SpriteDescriptor(v2(600, 0), 200, 300, sprites, "runRight1")],
        ["runLeft0", new SpriteDescriptor(v2(800, 0), 200, 300, sprites, "runLeft0")],
        ["runLeft1", new SpriteDescriptor(v2(1000, 0), 200, 300, sprites, "runLeft1")],
        ["jump0", new SpriteDescriptor(v2(1200, 0), 200, 300, sprites, "jump0")],
        ["jump1", new SpriteDescriptor(v2(0, 300), 200, 300, sprites, "jump1")],
        ["fall0", new SpriteDescriptor(v2(200, 300), 200, 300, sprites, "fall0")],
        ["fall1", new SpriteDescriptor(v2(400, 300), 200, 300, sprites, "fall1")],
        ["fallRight0", new SpriteDescriptor(v2(600, 300), 200, 300, sprites, "fallRight0")],
        ["fallRight1", new SpriteDescriptor(v2(800, 300), 200, 300, sprites, "fallRight1")],
        ["fallLeft0", new SpriteDescriptor(v2(1000, 300), 200, 300, sprites, "fallLeft0")],
        ["fallLeft1", new SpriteDescriptor(v2(1200, 300), 200, 300, sprites, "fallLeft1")],
    ])
), 5) 
player.animations.thisFrame = player.animations.frames.get("idle0")

function gameLoop(time: number) {
    window.requestAnimationFrame(gameLoop)

    drawConfig.size = new Vector2(canvas.width, canvas.height)
    let aspect = canvas.height/world.viewableSize.y
    if (aspect*world.viewableSize.x > canvas.width) aspect = canvas.width/world.viewableSize.x
    drawConfig.ratio = aspect
    drawConfig.margin = new Vector2((drawConfig.size.x - world.viewableSize.x*aspect)/2, (canvas.height - world.viewableSize.y*aspect)/2)

    if (time < prevTime) {
        return
    }
     
    const deltaTime = (time - prevTime)/1000
    elapsed += deltaTime
    drawConfig.dt = deltaTime
    drawConfig.elapsed = elapsed
    prevTime = time

    handleKeyPresses(drawConfig, player)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    paintBackground(drawConfig)
    player.move()
    player.animate()
    player.animations.lastAnimationTime += deltaTime*1000
    paintPlayer(drawConfig, player)
    portals.forEach((portal, _, __) => portal !== null ? paintPortal(drawConfig, portal) : null)
}


function paintBackground(drawConfig: DrawConfig) {
    for (let i = 0; i < world.size.x*world.size.y; i++) {
        let x = i % world.size.x, y = Math.floor(i/world.size.x)
        const atlasPos = world.map[i]==1 ? new Vector2(1400, 0) : world.map[i]==2 ? new Vector2(1400, 200) : new Vector2(1400, 400)
        ctx.drawImage(sprites, atlasPos.x, atlasPos.y, 200, 200, Math.floor(drawConfig.margin.x+x*drawConfig.ratio), Math.floor(drawConfig.margin.y+y*drawConfig.ratio), Math.ceil(drawConfig.ratio), Math.ceil(drawConfig.ratio))
    }
}

function paintPlayer(drawConfig: DrawConfig, player: Player) {
    ctx.fillStyle = "aqua"
    // @ts-ignore
    ctx.drawImage(...player.animations.thisFrame.asDrawArgs(Math.floor(drawConfig.margin.x+player.position.x1*drawConfig.ratio), Math.floor(drawConfig.margin.y+player.position.y1*drawConfig.ratio), Math.ceil(drawConfig.ratio * player.position.width), Math.ceil(drawConfig.ratio * player.position.height)))
}

function paintPortal(drawConfig: DrawConfig, portal: Portal) {
    ctx.fillStyle = portal.color == PortalColor.BLUE ? "blue" : "orange"
    ctx.fillRect(Math.floor(drawConfig.margin.x+(portal.center.x-(Portal.width/2)*Math.abs(Math.cos(portal.direction)))*drawConfig.ratio),
                 Math.floor(drawConfig.margin.y+(portal.center.y-(Portal.width/2)*Math.abs(Math.sin(portal.direction)))*drawConfig.ratio),
                 Portal.width*Math.abs(Math.cos(portal.direction))*drawConfig.ratio + 0.1*Math.sin(portal.direction)*drawConfig.ratio,
                 Portal.width*Math.abs(Math.sin(portal.direction))*drawConfig.ratio + 0.1*Math.cos(portal.direction)*drawConfig.ratio)
                 //10*Math.sin(portal.direction), 10)
}

function handleKeyPresses(drawConfig: DrawConfig, player: Player) {
    pressedKeys.forEach(key => {
        let y: number, x: number
        switch (key) {
            case "KeyA":
            case "ArrowLeft":
                player.velocity.x = player.velocity.x + -player.acceleration * drawConfig.dt
                break
            case "KeyD":
            case "ArrowRight":
                player.velocity.x = player.velocity.x + player.acceleration * drawConfig.dt
                break
            case "Space":
            case "ArrowUp":
                if (player.onSurface.has(Direction.DOWN)) {
                    player.velocity.y = -player.jumpVelocity
                }
                break
            case "Mouse0":
                y = (mousePos.y-drawConfig.margin.y)*(1/drawConfig.ratio)-player.position.y1-player.position.height/2, x = (mousePos.x-drawConfig.margin.x)*(1/drawConfig.ratio)-player.position.x1-player.position.width/2
                player.shoot(PortalColor.BLUE, (Math.atan2(-y, x)+(5*Math.PI/2))%(2*Math.PI))
                break
            
            case "Mouse2":
                y = (mousePos.y-drawConfig.margin.y)*(1/drawConfig.ratio)-player.position.y1-player.position.height/2, x = (mousePos.x-drawConfig.margin.x)*(1/drawConfig.ratio)-player.position.x1-player.position.width/2
                player.shoot(PortalColor.ORANGE, (Math.atan2(-y, x)+(5*Math.PI/2))%(2*Math.PI))
                break
        }
    })
    if ((!pressedKeys.has("KeyA") && !pressedKeys.has("ArrowLeft")) && (!pressedKeys.has("KeyD") && !pressedKeys.has("ArrowRight")) && player.onSurface.has(Direction.DOWN))
        player.velocity.x = Math.sign(player.velocity.x) * Math.max(0, (Math.abs(player.velocity.x)-player.acceleration*drawConfig.dt))
}

function rnd(i: number, d: number) {
    return +(i.toFixed(d))
}
function closestToZero(x: number, y: number) {
    return Math.abs(x) < Math.abs(y) ? x : y
}

init()
