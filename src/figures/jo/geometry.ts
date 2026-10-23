import {
  cameraOf,
  corners,
  cylinder,
  depthOf,
  haloOf,
  insetPlan,
  onTop,
  pathOf,
  planOutline,
  ring,
  roundedPlan,
  slabOf,
  topMatrix,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from '../../components/iso/iso-kit.ts'
import * as G from '../../components/iso/lathe.mjs'
import { tubePieces } from '../../components/iso/tube.mjs'
import {
  ANTENNA,
  BALL,
  BUBBLE,
  CASE,
  CHAT,
  DECK,
  DECK_TOP,
  DECK_Z,
  DESK,
  DESK_H,
  FACE_Y,
  FOOT_H,
  FRONT,
  GLASS,
  GLASS_Y,
  HAND,
  HANDS,
  HEAD,
  HEAD_MID,
  JS,
  JX,
  KB,
  KB_TOP,
  KB_Z,
  LEDGE,
  LIP_BACK,
  LIP_FRONT,
  NECK,
  P,
  PC,
  PC_BEZEL,
  PC_FACE,
  PC_FRONT,
  PC_SIDE,
  PC_TOP,
  PC_Z,
  RIM_Y,
  STAND,
  U,
  at,
  onFaceX,
  onFaceY,
} from './view.ts'

type Paths = SolidPaths

const solid = (plan: Plan, z: number, h: number, steps = 6, bevel = 0): Paths => slabOf(plan, z, h, P, steps, bevel)
const round = (cx: number, cy: number, r: number, z: number, h: number, steps = 24, bevel = 0): Paths => cylinder(cx, cy, r, z, h, P, steps, bevel)
const join = (paths: string[]) => paths.filter(Boolean).join('')
const byDepth = <T extends Plane>(points: T[]) => [...points].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P))
const turned = (paths: unknown) => paths as Paths
const ribsOf = G.ribsOf as unknown as (...args: unknown[]) => { d: string; alpha: number }[]

// A rounded rectangle in a face's local (h, -z) coordinates, closed: slots, vents, windows.
export const flat = (h0: number, z0: number, h1: number, z1: number, r: number, steps = 6) =>
  pathOf(roundedPlan({ x: h0, y: z0, w: h1 - h0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z] as Flat), true)

// A rounded rectangle in the (x, z) plane, as a polygon for prisms along y.
const profile = (x0: number, z0: number, x1: number, z1: number, r: number, steps = 10) =>
  roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([x, z]) => [x, z])

const ALONG_Y = (y: number) => G.frameOf([0, y, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1])

// An opening in a vertical face, with its inner walls shaded by facing (desk-computer's recess).
export interface Opening {
  h0: number
  h1: number
  z0: number
  z1: number
  r: number
  depth: number
}

export interface Recess {
  front: string
  back: string
  shape: string
  tops: string
  sides: string[]
}

function recessOf(opening: Opening, axis: 'x' | 'y', plane: number): Recess {
  const { h0, h1, z0, z1, r, depth } = opening
  const ringPoints = roundedPlan({ x: h0, y: z0, w: h1 - h0, d: z1 - z0, r }, 6)
  const world = (h: number, z: number, back: number): Point3 => (axis === 'y' ? [h, plane - back, z] : [plane - back, -h, z])
  const { sinA, cosA } = cameraOf(P)
  const ch = (h0 + h1) / 2
  const cz = (z0 + z1) / 2
  const tops: string[] = []
  const sides: string[][] = [[], [], [], []]
  ringPoints.forEach(([ah, az], index) => {
    const [bh, bz] = ringPoints[(index + 1) % ringPoints.length]!
    const length = Math.hypot(bh - ah, bz - az) || 1
    let [nh, nz] = [(bz - az) / length, -(bh - ah) / length]
    if (nh * (ch - (ah + bh) / 2) + nz * (cz - (az + bz) / 2) < 0) [nh, nz] = [-nh, -nz]
    const normal: Point3 = axis === 'y' ? [nh, 0, nz] : [0, -nh, nz]
    if (depthOf(normal, P) <= 1e-6) return
    const quad = pathOf([at(world(ah, az, 0)), at(world(bh, bz, 0)), at(world(bh, bz, depth)), at(world(ah, az, depth))], true)
    if (nz >= Math.abs(nh)) tops.push(quad)
    else {
      const lit = (normal[0] * -sinA + normal[1] * cosA + 1) / 2
      sides[Math.min(3, Math.max(0, Math.floor(lit * 4)))]!.push(quad)
    }
  })
  const face = axis === 'y' ? onFaceY : onFaceX
  return { front: face(plane), back: face(plane - depth), shape: flat(h0, z0, h1, z1, r), tops: tops.join(''), sides: sides.map((list) => list.join('')) }
}

// Desk -------------------------------------------------------------------------------------------

const DESK_FEET = byDepth(corners(DESK, 24))
const DESK_SCREWS = corners(DESK, 10)
const MAT: Plan = { x: -108, y: 4, w: 292, d: 68, r: 6 }
const LABEL: Plan = { x: -108, y: 75, w: 30, d: 9, r: 1.4 }

export const DESK_ART = {
  halo: haloOf(DESK, -DESK_H - FOOT_H, DESK_H, P),
  feet: DESK_FEET.map(([x, y]) => [round(x, y, 7, -DESK_H - FOOT_H, 1.6, 28), round(x, y, 5.4, -DESK_H - FOOT_H + 1.6, FOOT_H - 1.6, 28)]),
  slab: solid(DESK, -DESK_H, DESK_H, 8, 1.6),
  groove: planOutline(insetPlan(DESK, 5), 0, P),
  screwRings: join(DESK_SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: DESK_SCREWS.map(([x, y]) => at([x, y, 0])),
  mat: solid(MAT, 0, 0.6, 6),
  stitch: planOutline(insetPlan(MAT, 2.4), 0.6, P, 6),
  label: solid(LABEL, 0, 0.8, 3),
  labelLine: planOutline(insetPlan(LABEL, 1.4), 0.8, P, 3),
  labelScrews: [at([LABEL.x + 2.8, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 2.8, LABEL.y + LABEL.d / 2, 0.8])],
  labelText: topMatrix([LABEL.x + LABEL.w / 2, LABEL.y + LABEL.d / 2 + 1.3], 0.8, P, 'x'),
}

// Monitor ----------------------------------------------------------------------------------------

export const CASE_PLAN: Plan = { x: CASE.x0, y: CASE.y0, w: CASE.x1 - CASE.x0, d: CASE.y1 - CASE.y0, r: 3 }
export const NECK_PLATE: Plan = { x: -14, y: -60, w: 28, d: 18, r: 3 }
const NECK_FRONT = NECK.y + NECK.d
export const MON_PORT: Plan = { x: CASE.x1, y: -44, w: 1.2, d: 6, r: 0.8 }
export const PLUG_A = G.frameAlong([CASE.x1 + 1.2, -41, 70], [1, 0, 0])
export const VIDEO_START: Point3 = [CASE.x1 + 6.4, -41, 70]

export const MONITOR_ART = {
  standHalo: haloOf(STAND, 0, 4, P),
  stand: solid(STAND, 0, 4, 8, 1),
  standGroove: planOutline(insetPlan(STAND, 4.5), 4, P, 8),
  plate: solid(NECK_PLATE, 4, 1.6, 4, 0.4),
  plateScrews: [at([NECK_PLATE.x + 3.2, NECK_PLATE.y + NECK_PLATE.d - 3.2, 5.6]), at([NECK_PLATE.x + NECK_PLATE.w - 3.2, NECK_PLATE.y + NECK_PLATE.d - 3.2, 5.6])],
  neck: solid(NECK, 5.6, 134, 4, 0.6),
  clip: flat(-3.4, 16, 3.4, 30, 3.4, 6),
  clipPlane: onFaceY(NECK_FRONT),
  clipBack: flat(-1.8, 18, 1.8, 28, 1.8, 6),
  case: solid(CASE_PLAN, CASE.z0, CASE.z1 - CASE.z0, 6, 1.2),
  vents: join(Array.from({ length: 14 }, (_, index) => planOutline({ x: -52 + index * 8, y: CASE.y0 + 2.2, w: 2.4, d: 5.6, r: 1.2 }, CASE.z1, P, 4))),
  port: solid(MON_PORT, 65, 10, 3),
  plug: turned(G.disc(0, 5.2, 2.5, PLUG_A, P)),
  plugRibs: ribsOf(PLUG_A, 0.6, 3.4, 2.5, 18, P, { fade: [0.1, 0.55], seams: true }),
}

export const SCREEN = recessOf({ h0: GLASS.x0, h1: GLASS.x1, z0: GLASS.z0, z1: GLASS.z1, r: GLASS.r, depth: GLASS.depth }, 'y', FRONT)
export const GLASS_PLANE = onFaceY(GLASS_Y)

// Static desktop on the glass: a soft glare, three icons with their names as rule lines, and an
// app window snapped to the right half (sidebar, picture, text) whose theme follows dark mode.
export const WINDOW = { x0: 26, x1: 102, z0: 76, z1: 178, bar: 7, side: 46 }
const W = WINDOW
export const DESKTOP = {
  glare: pathOf([[-104, -180], [-46, -180], [-104, -122]], true),
  glareFrom: [-104, -180] as Flat,
  glareTo: [-80, -156] as Flat,
  bloom: 'M40 -150a44 22 -18 1 0 88 0a44 22 -18 1 0 -88 0Z',
  icons: [0, 1, 2].map((row) => flat(-96, 166 - row * 22, -86, 176 - row * 22, 2.2, 4)).join(''),
  names: [0, 1, 2].map((row) => `M${-98} ${-(162 - row * 22)}H${-84 - (row === 1 ? 3 : 0)}`).join(''),
  window: flat(W.x0, W.z0, W.x1, W.z1, 2.4, 4),
  bar: `M${W.x0} ${-(W.z1 - W.bar)}H${W.x1}M${W.side} ${-(W.z1 - W.bar)}V${-W.z0}`,
  buttons: [0, 1, 2].map((index) => flat(W.x1 - 5 - index * 4.4, W.z1 - 4.7, W.x1 - 2.6 - index * 4.4, W.z1 - 2.3, 0.5, 2)).join(''),
  picture: flat(W.side + 6, W.z1 - W.bar - 36, W.x1 - 6, W.z1 - W.bar - 6, 1.4, 3),
  text: [
    ...[0, 1, 2, 3].map((row) => `M${W.x0 + 4} ${-(W.z1 - W.bar - 6 - row * 5)}H${W.side - 4 - (row % 2 ? 4 : 0)}`),
    ...[0, 1, 2].map((row) => `M${W.side + 6} ${-(W.z1 - W.bar - 43 - row * 5)}H${W.x1 - 6 - (row === 2 ? 18 : row * 7)}`),
  ].join(''),
}

// Taskbar ledge ----------------------------------------------------------------------------------

export const FLOOR: Plan = { x: LEDGE.x0, y: LEDGE.y0, w: LEDGE.x1 - LEDGE.x0, d: LIP_BACK - LEDGE.y0, r: 0.8 }
export const LIP: Plan = { x: LEDGE.x0, y: LIP_BACK, w: LEDGE.x1 - LEDGE.x0, d: LEDGE.lip, r: 1 }
export const CAP = (x: number): Plan => ({ x, y: LEDGE.y0, w: LEDGE.cap, d: LIP_BACK - LEDGE.y0, r: 0.8 })
const BAR_MID = (LEDGE.floor + LEDGE.top) / 2
const PINS = [-27, -18, -9, 9, 18, 27]
// Two cheek brackets close the ledge's ends and carry it from the case front, on the bezel either side of the glass.
const CHEEK = [[FRONT, LEDGE.floorTop], [LIP_FRONT, LEDGE.floorTop], [LIP_FRONT, LEDGE.floor - 2.4], [FRONT, CASE.z0 + 1.6]]
const CHEEK_W = 2.4
const ALONG_X = G.frameOf([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1])

export const LEDGE_ART = {
  cheekLeft: turned(G.prismOf(ALONG_X, CHEEK, LEDGE.x0 - CHEEK_W, LEDGE.x0, P)),
  cheekRight: turned(G.prismOf(ALONG_X, CHEEK, LEDGE.x1, LEDGE.x1 + CHEEK_W, P)),
  floor: solid(FLOOR, LEDGE.floor, LEDGE.floorTop - LEDGE.floor, 3),
  leftCap: solid(CAP(LEDGE.x0), LEDGE.floorTop, LEDGE.top - LEDGE.floorTop, 3, 0.4),
  rightCap: solid(CAP(LEDGE.x1 - LEDGE.cap), LEDGE.floorTop, LEDGE.top - LEDGE.floorTop, 3, 0.4),
  lip: solid(LIP, LEDGE.floor, LEDGE.top - LEDGE.floor, 3, 0.6),
  plane: onFaceY(LIP_FRONT),
  // Start tile, search, pinned apps and the tray, as the shapes a taskbar shows.
  start: [0, 1].flatMap((col) => [0, 1].map((row) => flat(-2.6 + col * 2.8, BAR_MID - 2.6 + row * 2.8, -0.4 + col * 2.8, BAR_MID - 0.4 + row * 2.8, 0.2, 1))).join(''),
  pins: PINS.map((x) => (x === -9 ? '' : flat(x - 2.4, BAR_MID - 2.4, x + 2.4, BAR_MID + 2.4, 1, 3))).join(''),
  search: G.circleOf(G.frameAlong([-9, LIP_FRONT, BAR_MID], [0, 1, 0]), 0, 2.2, P),
  running: [-18, 9].map((x) => flat(x - 1.4, LEDGE.floor + 1, x + 1.4, LEDGE.floor + 1.6, 0.3, 1)).join(''),
  tray: [76, 81, 86].map((x) => flat(x - 1.3, BAR_MID - 1.3, x + 1.3, BAR_MID + 1.3, 1.3, 3)).join(''),
  clock: `M${92} ${-(BAR_MID + 1.3)}H${99}M${93} ${-(BAR_MID - 1.4)}H${99}`,
}

// Jo ---------------------------------------------------------------------------------------------

export const HEAD_Y = (HEAD.y0 + HEAD.y1) / 2
export const FACE = { x0: JX - 33 * JS, x1: JX + 33 * JS, z0: HEAD_MID + (1 - 22) * JS, z1: HEAD_MID + (1 + 22) * JS, r: 18 * JS }
export const EAR = (side: number) => G.frameAlong([JX + side * (HEAD.x1 - JX), HEAD_Y, HEAD_MID], [side, 0, 0])
export const ELLIPSOID = Array.from({ length: 25 }, (_, index) => {
  const s = -HAND.a + (2 * HAND.a * index) / 24
  return [s, HAND.b * Math.sqrt(Math.max(0, 1 - (s / HAND.a) ** 2)), 1]
})
const SMILE_Z = -(HEAD_MID - 7 * JS)
const handR = (s: number) => HAND.b * Math.sqrt(Math.max(0, 1 - (s / HAND.a) ** 2))
const handSlope = (s: number) => (-HAND.b * s) / (HAND.a * HAND.a * Math.sqrt(Math.max(1e-6, 1 - (s / HAND.a) ** 2)))

export const JO_ART = {
  torso: solid({ x: JX - 28 * JS, y: -33, w: 56 * JS, d: 17, r: 16 * JS }, LEDGE.floorTop, HEAD.z0 - LEDGE.floorTop + 0.4, 8),
  earLeft: turned(G.disc(0, 10 * JS, 10 * JS, EAR(-1), P)),
  earRight: turned(G.disc(0, 10 * JS, 10 * JS, EAR(1), P)),
  earTip: G.circleOf(EAR(1), 10 * JS, 5.6 * JS, P),
  head: turned(G.prismOf(ALONG_Y(0), profile(HEAD.x0, HEAD.z0, HEAD.x1, HEAD.z1, HEAD.r), HEAD.y0, HEAD.y1, P)),
  rim: turned(G.prismOf(ALONG_Y(0), profile(HEAD.x0 + 1.4, HEAD.z0 + 1.4, HEAD.x1 - 1.4, HEAD.z1 - 1.4, HEAD.r - 1.4), HEAD.y1, RIM_Y, P)),
  screen: turned(G.prismOf(ALONG_Y(0), profile(FACE.x0, FACE.z0, FACE.x1, FACE.z1, FACE.r), RIM_Y, FACE_Y, P)),
  facePlane: onFaceY(FACE_Y),
  // Face features in the face plane (local x, -z), from the robot model: eyes 16 x 21 at +-13, 5 up.
  eye: { rx: 8 * JS, ry: 10.5 * JS },
  eyes: [-1, 1].map((side) => ({ cx: JX + side * 13 * JS, cy: -(HEAD_MID + 6 * JS) })),
  blush: [-1, 1].map((side) => ({ cx: JX + side * 23 * JS, cy: -(HEAD_MID - 6 * JS), rx: 6.75 * JS, ry: 4 * JS })),
  smile: (() => {
    const outer = Array.from({ length: 13 }, (_, i) => [JX + 5.6 * JS * Math.cos((Math.PI * i) / 12), SMILE_Z + 5.6 * JS * Math.sin((Math.PI * i) / 12)] as Flat)
    const inner = Array.from({ length: 13 }, (_, i) => [JX + 3.4 * JS * Math.cos((Math.PI * (12 - i)) / 12), SMILE_Z + 2.6 * JS * Math.sin((Math.PI * (12 - i)) / 12)] as Flat)
    return pathOf([...outer, ...inner], true)
  })(),
  collar: round(JX, HEAD_Y, 2.2, ANTENNA.z0 - 0.3, ANTENNA.collar + 0.3, 18),
  stalk: round(JX, HEAD_Y, 0.95, ANTENNA.z0 + ANTENNA.collar, ANTENNA.stalk, 12),
  // The status light is one smooth glass ball: a circle with a radial gradient lit from the kit's light.
  ballAt: at(BALL),
  ballR: ANTENNA.ball * G.scaleOf(P),
  ballLit: at(G.add3(BALL, G.mul3(G.lightOf(P), ANTENNA.ball * 0.55)) as Point3),
  hands: HANDS.map((centre) => turned(G.lathe(ELLIPSOID, G.frameAlong(centre, [1, 0, 0]), P))),
  // Two finger seams across each mitten.
  fingers: HANDS.map((centre) => join([-1.7, 0.6].map((s) => G.arcOf(G.frameAlong(centre, [1, 0, 0]), s, handR(s), P, { slope: handSlope(s) })))),
}

// PC ---------------------------------------------------------------------------------------------

export const PC_PLAN: Plan = { x: PC.x, y: PC.y, w: PC.w, d: PC.d, r: PC.r }
export const PC_FEET = byDepth(corners(PC_PLAN, 6))
export const SLOT = { h0: PC.x + 8, h1: PC.x + 40, z0: 70, z1: 80, r: 1.4, depth: 3 }
export const CART: Plan = { x: PC.x + 9.6, y: PC_FACE - SLOT.depth, w: 28.8, d: 15, r: 1 }
const CART_TOP = 78.8
const CART_LABEL: Plan = { x: CART.x + 3, y: PC_FACE + 0.8, w: 22.8, d: 7.4, r: 0.8 }
const PC_POWER = G.frameAlong([PC.x + 38, PC_FACE, 104], [0, 1, 0])
const NET = { y0: PC_FRONT - 24, y1: PC_FRONT - 15, z0: 15.5, z1: 22.5 }
const SCREW_F = (z: number) => G.frameAlong([PC_SIDE, PC.y + 5.6, z], [1, 0, 0])
const RIVET = G.frameAlong([PC_SIDE, (NET.y0 + NET.y1) / 2, 9.6], [1, 0, 0])
export const FRONT_PORT: Plan = { x: PC.x + 26, y: PC_FACE, w: 8, d: 0.8, r: 0.5 }
export const PLUG_B = G.frameAlong([PC.x + 30, PC_FACE + 0.8, 10], [0, 1, 0])
export const DECK_CABLE_END: Point3 = [PC.x + 30, PC_FACE + 4.6, 10]

export const PC_ART = {
  halo: haloOf(PC_PLAN, 0, 8, P),
  feet: PC_FEET.map(([x, y]) => round(x, y, 3, 0, PC_Z, 18)),
  case: solid(PC_PLAN, PC_Z, PC_TOP - PC_Z, 6, 1.2),
  topVents: join(Array.from({ length: 7 }, (_, index) => planOutline({ x: PC.x + 8, y: PC.y + 12 + index * 5, w: 32, d: 1.6, r: 0.8 }, PC_TOP, P, 3))),
  topScrews: [at([PC.x + 4.5, PC.y + 4.5, PC_TOP]), at([PC.x + PC.w - 4.5, PC.y + 4.5, PC_TOP])],
  sidePlane: onFaceX(PC_SIDE),
  sidePanel: flat(-(PC_FRONT - 7), 28, -(PC.y + 10), 110, 2.4, 4),
  sideVents: join(Array.from({ length: 11 }, (_, index) => flat(-(PC.y + 15 + index * 3.6) - 0.8, 76, -(PC.y + 15 + index * 3.6) + 0.8, 102, 0.8, 3))),
  sideVentsLow: join(Array.from({ length: 11 }, (_, index) => flat(-(PC.y + 15 + index * 3.6) - 0.8, 36, -(PC.y + 15 + index * 3.6) + 0.8, 52, 0.8, 3))),
  screws: [30, 92].map((z) => turned(G.disc(0, 1.2, 1.7, SCREW_F(z), P))),
  screwSlots: join([30, 92].map((z) => G.circleOf(SCREW_F(z), 1.2, 0.9, P))),
  netFrame: flat(-NET.y1 - 0.9, NET.z0 - 0.9, -NET.y0 + 0.9, NET.z1 + 0.9, 1.4, 4),
  cap: solid({ x: PC_SIDE, y: NET.y0, w: 1.4, d: NET.y1 - NET.y0, r: 1 }, NET.z0, NET.z1 - NET.z0, 3, 0.3),
  tab: solid({ x: PC_SIDE + 1.4, y: (NET.y0 + NET.y1) / 2 - 1.6, w: 2.2, d: 3.2, r: 0.8 }, NET.z0 + 2, 3, 3),
  tether: solid({ x: PC_SIDE, y: (NET.y0 + NET.y1) / 2 - 0.6, w: 0.6, d: 1.2, r: 0.3 }, 9.6, NET.z0 - 9.6, 2),
  rivet: turned(G.disc(0, 0.7, 1.1, RIVET, P)),
  bezel: solid({ x: PC.x + 2, y: PC_FRONT, w: PC.w - 4, d: PC_BEZEL, r: 1 }, 6, PC_TOP - 8, 3, 0.4),
  facePlane: onFaceY(PC_FACE),
  slot: recessOf(SLOT, 'y', PC_FACE),
  cartridge: solid(CART, SLOT.z0 + 1, CART_TOP - SLOT.z0 - 1, 3, 0.4),
  cartLabel: solid(CART_LABEL, CART_TOP, 0.4, 3),
  cartLabelLine: planOutline(insetPlan(CART_LABEL, 1), CART_TOP + 0.4, P, 3),
  cartRule: join([0, 1, 2].map((row) => onTop([[CART_LABEL.x + 2.4, CART_LABEL.y + 2 + row * 1.7], [CART_LABEL.x + (row === 2 ? 11 : 17), CART_LABEL.y + 2 + row * 1.7]], CART_TOP + 0.4, P))),
  cartRibs: join([0, 1, 2].map((row) => onTop([[CART.x, CART.y + CART.d - 2 - row * 1.3], [CART.x + CART.w, CART.y + CART.d - 2 - row * 1.3]], CART_TOP, P))),
  cartPlane: onFaceY(CART.y + CART.d),
  cartGrip: flat(CART.x + 7, SLOT.z0 + 3.2, CART.x + CART.w - 7, SLOT.z0 + 4.6, 0.7, 3),
  eject: solid({ x: PC.x + 42, y: PC_FACE, w: 2.6, d: 0.7, r: 0.5 }, 72.5, 5, 2),
  vents: join(Array.from({ length: 9 }, (_, index) => flat(PC.x + 9, 24 + index * 3.4, PC.x + 39, 25.3 + index * 3.4, 0.65, 3))),
  power: turned(G.disc(0, 1.2, 3.3, PC_POWER, P)),
  powerRing: G.circleOf(PC_POWER, 1.2, 2.1, P),
  led: flat(PC.x + 22, 103.2, PC.x + 28, 104.8, 0.8, 3),
  frontPort: solid(FRONT_PORT, 7.2, 5.6, 3),
  plug: turned(G.disc(0, 3.8, 2.3, PLUG_B, P)),
}

// Keyboard ---------------------------------------------------------------------------------------

type Row = [string, number][]
const ROWS: Row[] = [
  [['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['Backspace', 2]],
  [['Tab', 1.5], ['q', 1], ['w', 1], ['e', 1], ['r', 1], ['t', 1], ['y', 1], ['u', 1], ['i', 1], ['o', 1], ['p', 1], ['[', 1], [']', 1], ['\\', 1.5]],
  [['Caps', 1.75], ['a', 1], ['s', 1], ['d', 1], ['f', 1], ['g', 1], ['h', 1], ['j', 1], ['k', 1], ['l', 1], [';', 1], ["'", 1], ['Enter', 2.25]],
  [['Shift', 2.25], ['z', 1], ['x', 1], ['c', 1], ['v', 1], ['b', 1], ['n', 1], ['m', 1], [',', 1], ['.', 1], ['/', 1], ['ShiftRight', 2.75]],
  [['Ctrl', 1.5], ['Win', 1.5], ['Alt', 1.5], ['Space', 7], ['AltRight', 1.5], ['CtrlRight', 2]],
]
const ROW_H = [5.4, 5, 4.6, 4.2, 3.8]
const KEYS_X = KB.x + (KB.w - U * 15) / 2
const KEYS_Y = KB.y + 4

export interface Key {
  name: string
  cap: Paths
  dish: string
  // Keys that press: the column above their footprint (they sink into the base, never through it)
  // and the front of the footprint, the edge of the opening they sink into.
  well?: { clip: string; lip: string }
}

const MOVING = ['Alt', 'Space']

// The screen region over a footprint: its outline at z swept straight up, and the lower chain of
// that outline (the edge a part standing on the footprint meets the surface along).
function columnOf(ring: Plane[], z: number) {
  const low = ring.map(([x, y]) => at([x, y, z]))
  const hull = G.hullOf([...low, ...ring.map(([x, y]) => at([x, y, z + 40]))]) as Flat[]
  const left = low.reduce((a, b) => (b[0] < a[0] ? b : a))
  const right = low.reduce((a, b) => (b[0] > a[0] ? b : a))
  const start = low.indexOf(left)
  const chain: Flat[] = []
  for (let step = 0; step <= low.length; step++) {
    const point = low[(start + step) % low.length]!
    chain.push(point)
    if (point === right) break
  }
  const below = (list: Flat[]) => list.reduce((sum, [, y]) => sum + y, 0) / list.length
  const other: Flat[] = []
  for (let step = 0; step <= low.length; step++) {
    const point = low[(start - step + low.length) % low.length]!
    other.push(point)
    if (point === right) break
  }
  return { clip: pathOf(hull, true), lip: pathOf(below(chain) > below(other) ? chain : other) }
}

export const KEYS: Key[] = ROWS.flatMap((row, r) => {
  let x = KEYS_X
  return row.map(([name, width]) => {
    const plan = { x: x + 0.7, y: KEYS_Y + r * U + 0.7, w: width * U - 1.4, d: U - 1.4, r: 1.3 }
    x += width * U
    const top = KB_TOP + ROW_H[r]!
    const well = MOVING.includes(name) ? columnOf(roundedPlan(plan, 3), KB_TOP) : undefined
    return { name, cap: solid(plan, KB_TOP, ROW_H[r]!, 3, 0.4), dish: planOutline(insetPlan(plan, 1.6), top, P, 3), well }
  })
})

export const KEYBOARD_ART = {
  halo: haloOf(KB, 0, 4, P),
  feet: byDepth(corners(KB, 8)).map(([x, y]) => round(x, y, 2.6, 0, KB_Z, 16)),
  base: solid(KB, KB_Z, KB_TOP - KB_Z, 6, 1),
  well: planOutline({ x: KEYS_X - 1.4, y: KEYS_Y - 1.4, w: U * 15 + 2.8, d: U * 5 + 2.8, r: 2 }, KB_TOP, P, 4),
  screws: [at([KB.x + 3.4, KB.y + 2, KB_TOP]), at([KB.x + KB.w - 3.4, KB.y + 2, KB_TOP])],
}

// Control deck -----------------------------------------------------------------------------------

export const TOGGLE_X = [80, 100, 120]
export const TOGGLE_Y = 34
export const PIVOT_Z = DECK_TOP + 3.4
export const SLIDER_Y = [54, 68]
export const SLIDE = { x0: 82, x1: 140 }
const DECK_SCREWS = corners(DECK, 5.5)
export const LOCK: Plan = { x: 150, y: 30, w: 18, d: 18, r: 2.2 }
export const DECK_PORT: Plan = { x: DECK.x + DECK.w, y: 27, w: 0.8, d: 6, r: 0.5 }
export const PLUG_C = G.frameAlong([DECK.x + DECK.w + 0.8, 30, 6], [1, 0, 0])
export const DECK_CABLE_START: Point3 = [DECK.x + DECK.w + 4.6, 30, 6]

const sliderStrip = (y: number): Plan => ({ x: SLIDE.x0 - 2, y: y + 2.6, w: SLIDE.x1 - SLIDE.x0 + 4, d: 2.8, r: 0.5 })
const ticks = SLIDER_Y.map((y) => {
  const minor: string[] = []
  const major: string[] = []
  for (let step = 0; step <= 10; step++) {
    const x = SLIDE.x0 + ((SLIDE.x1 - SLIDE.x0) * step) / 10
    const big = step % 5 === 0
    ;(big ? major : minor).push(onTop([[x, y + 2.6], [x, y + 2.6 + (big ? 2.2 : 1.2)]], DECK_TOP + 0.4, P))
  }
  return { minor: minor.join(''), major: major.join('') }
})

export const DECK_ART = {
  halo: haloOf(DECK, 0, 6, P),
  plinth: solid(insetPlan(DECK, 2), 0, DECK_Z, 6),
  body: solid(DECK, DECK_Z, DECK_TOP - DECK_Z, 6, 1),
  groove: planOutline(insetPlan(DECK, 3.4), DECK_TOP, P, 6),
  screwRings: join(DECK_SCREWS.map(([x, y]) => ring(x, y, 1.5, DECK_TOP, P, 12))),
  screws: DECK_SCREWS.map(([x, y]) => at([x, y, DECK_TOP])),
  toggles: TOGGLE_X.map((x) => ({
    nut: round(x, TOGGLE_Y, 3.8, DECK_TOP, 1.6, 6),
    collar: round(x, TOGGLE_Y, 2.2, DECK_TOP + 1.6, PIVOT_Z - DECK_TOP - 1.6, 16),
    plate: solid({ x: x - 5.5, y: TOGGLE_Y + 6.6, w: 11, d: 4.4, r: 0.7 }, DECK_TOP, 0.4, 3),
    rule: onTop([[x - 3.6, TOGGLE_Y + 8.8], [x + 2.2, TOGGLE_Y + 8.8]], DECK_TOP + 0.4, P),
    lamp: round(x + 7, TOGGLE_Y - 2, 1.2, DECK_TOP, 0.5, 12),
  })),
  sliders: SLIDER_Y.map((y, index) => ({
    slotLine: planOutline({ x: SLIDE.x0 - 2, y: y - 1.4, w: SLIDE.x1 - SLIDE.x0 + 4, d: 2.8, r: 1.4 }, DECK_TOP, P, 4),
    strip: solid(sliderStrip(y), DECK_TOP, 0.4, 2),
    minor: ticks[index]!.minor,
    major: ticks[index]!.major,
    plate: solid({ x: DECK.x + 5, y: y - 2, w: 9.4, d: 4, r: 0.7 }, DECK_TOP, 0.4, 3),
    rule: onTop([[DECK.x + 6.8, y], [DECK.x + 12.4, y]], DECK_TOP + 0.4, P),
  })),
  lock: solid(LOCK, DECK_TOP, 3.8, 3, 0.4),
  lockDish: planOutline(insetPlan(LOCK, 2.4), DECK_TOP + 3.8, P, 3),
  lockPlate: solid({ x: LOCK.x + 3.5, y: LOCK.y + LOCK.d + 2, w: 11, d: 4.4, r: 0.7 }, DECK_TOP, 0.4, 3),
  lockRule: onTop([[LOCK.x + 5.4, LOCK.y + LOCK.d + 4.2], [LOCK.x + 11, LOCK.y + LOCK.d + 4.2]], DECK_TOP + 0.4, P),
  port: solid(DECK_PORT, 3.2, 5.6, 3),
  plug: turned(G.disc(0, 3.8, 2.1, PLUG_C, P)),
}

// A slider knob, built at the start of its travel and moved along x.
export const KNOB: Plan = { x: SLIDE.x0 - 3.75, y: -4.25, w: 7.5, d: 8.5, r: 1.4 }
export const KNOB_ART = SLIDER_Y.map((y) => ({
  paths: solid({ ...KNOB, y: y + KNOB.y }, DECK_TOP, 4.6, 3, 0.4),
  grip: join([-1.8, 0, 1.8].map((dx) => onTop([[SLIDE.x0 + dx, y + KNOB.y], [SLIDE.x0 + dx, y + KNOB.y + KNOB.d]], DECK_TOP + 4.6, P))),
}))

// Mouse ------------------------------------------------------------------------------------------

// A mouse on its pad, right of the deck: an ellipsoid shell sunk a little into the pad, shown above
// the pad only (the column over its footprint), with the button seams and the scroll wheel.
export const PAD: Plan = { x: 195, y: 28, w: 24, d: 46, r: 3 }
const PAD_TOP = 0.8
const MOUSE = { x: 207, y: 51, a: 10, b: 6, sink: 1.2 }
const MOUSE_F = G.frameAlong([MOUSE.x, MOUSE.y, PAD_TOP - MOUSE.sink], [0, 1, 0])
const mouseR = (s: number) => MOUSE.b * Math.sqrt(Math.max(0, 1 - (s / MOUSE.a) ** 2))
const mouseSlope = (s: number) => (-MOUSE.b * s) / (MOUSE.a ** 2 * Math.sqrt(Math.max(4e-3, 1 - (s / MOUSE.a) ** 2)))
const MOUSE_PROFILE = Array.from({ length: 33 }, (_, index) => {
  const s = -MOUSE.a + (2 * MOUSE.a * index) / 32
  return [s, mouseR(s), 1]
})
const onShell = (s: number, across: number): Point3 => [MOUSE.x + across, MOUSE.y + s, PAD_TOP - MOUSE.sink + Math.sqrt(Math.max(0, mouseR(s) ** 2 - across ** 2))]
const FOOT_S = MOUSE.a * Math.sqrt(1 - (MOUSE.sink / MOUSE.b) ** 2)
const FOOTPRINT: Plane[] = [1, -1].flatMap((side) =>
  Array.from({ length: 41 }, (_, index) => {
    const s = side * (-FOOT_S + (2 * FOOT_S * index) / 40)
    return [MOUSE.x + side * Math.sqrt(Math.max(0, mouseR(s) ** 2 - MOUSE.sink ** 2)), MOUSE.y + s] as Plane
  }),
)
const CROSS_S = -1.6
const WHEEL = { s0: -5.8, s1: -3.2, half: 0.85 }
const stadiumOn = (s0: number, s1: number, half: number) => {
  const points: Point3[] = []
  for (let index = 0; index <= 12; index++) {
    const t = Math.PI * (index / 12)
    points.push(onShell(s1 - half + half * Math.sin(t), -half * Math.cos(t)))
  }
  for (let index = 0; index <= 12; index++) {
    const t = Math.PI * (index / 12)
    points.push(onShell(s0 + half - half * Math.sin(t), half * Math.cos(t)))
  }
  return pathOf(points.map(at), true)
}
// The top seam between the buttons runs from the wheel slot forward to where the shell turns away.
const seamForward = (() => {
  const V = G.viewOf(P) as Point3
  const points: Flat[] = []
  for (let s = WHEEL.s0; s > -MOUSE.a; s -= 0.1) {
    const slope = mouseSlope(s)
    if ((-slope * V[1] + V[2]) / Math.hypot(1, slope) < 0.004) break
    points.push(at(onShell(s, 0)))
  }
  return pathOf(points)
})()
const MOUSE_COLUMN = columnOf(FOOTPRINT, PAD_TOP)

export const MOUSE_ART = {
  padHalo: haloOf(PAD, 0, 2, P),
  pad: solid(PAD, 0, PAD_TOP, 4),
  stitch: planOutline(insetPlan(PAD, 1.8), PAD_TOP, P, 4),
  halo: haloOf({ x: MOUSE.x - 6, y: MOUSE.y - 9, w: 12, d: 18, r: 6 }, PAD_TOP, 3, P),
  base: pathOf(FOOTPRINT.map(([x, y]) => at([x, y, PAD_TOP])), true),
  clip: MOUSE_COLUMN.clip,
  shell: turned((G.lathe as (...args: unknown[]) => unknown)(MOUSE_PROFILE, MOUSE_F, P, { smooth: { slope: mouseSlope, radius: mouseR } })),
  seams: join([
    G.arcOf(MOUSE_F, CROSS_S, mouseR(CROSS_S), P, { slope: mouseSlope(CROSS_S), from: Math.asin(MOUSE.sink / mouseR(CROSS_S)), to: Math.PI - Math.asin(MOUSE.sink / mouseR(CROSS_S)) }),
    pathOf([at(onShell(CROSS_S, 0)), at(onShell(WHEEL.s1, 0))]),
    seamForward,
  ]),
  slot: stadiumOn(WHEEL.s0, WHEEL.s1, WHEEL.half),
  wheel: stadiumOn(WHEEL.s0 + 0.5, WHEEL.s1 - 0.5, WHEEL.half - 0.4),
}

// Cables -----------------------------------------------------------------------------------------

function cableRoute(from: Point3, out: Point3, to: Point3, inward: Point3, reach: [number, number], sag: number, least: number) {
  const p1: Point3 = [from[0] + out[0] * reach[0], from[1] + out[1] * reach[0], from[2] + out[2] * reach[0]]
  const p2: Point3 = [to[0] - inward[0] * reach[1], to[1] - inward[1] * reach[1], to[2] - inward[2] * reach[1]]
  return Array.from({ length: 41 }, (_, index) => {
    const t = index / 40
    const u = 1 - t
    const point = [0, 1, 2].map((axis) => u * u * u * from[axis]! + 3 * u * u * t * p1[axis]! + 3 * u * t * t * p2[axis]! + t * t * t * to[axis]!) as Point3
    point[2] = Math.max(least, point[2] - sag * Math.sin(Math.PI * t) ** 2)
    return point
  })
}

// The video cable hangs from the monitor's side port to the desk and runs under the PC's flank.
const fillet = G.fillet as unknown as (points: Point3[], radius: number, perArc: number, options: object) => Point3[]
export const VIDEO_ROUTE = fillet(
  [VIDEO_START, [125, -41, 70], [127.5, -41, 46], [129.5, -41, 6.4], [PC.x, -41, 6.4]],
  4.2,
  8,
  { P, tube: 1.35 },
)
export const DECK_ROUTE = cableRoute(DECK_CABLE_START, [1, 0, 0], DECK_CABLE_END, [0, -1, 0], [6, 13], 3, 1.3)

export interface Piece {
  body: string
  shine: string
  shade: string
  edges: string
  wide: boolean
  mid: Point3
}

export const VIDEO_CABLE = tubePieces(VIDEO_ROUTE, 1.35, P, { maxLength: 18 }) as unknown as Piece[]
export const DECK_CABLE = tubePieces(DECK_ROUTE, 1.1, P, { maxLength: 18 }) as unknown as Piece[]

// Hit areas and look targets, in viewBox units.
export const JO_BOX = (() => {
  const points = [
    at([HEAD.x0 - 4, HEAD_Y, HEAD.z0]),
    at([HEAD.x1 + 4, HEAD_Y, HEAD.z0]),
    at([HEAD.x0 - 4, HEAD_Y, BALL[2] + 4]),
    at([HEAD.x1 + 4, HEAD_Y, BALL[2] + 4]),
    at([HEAD.x0, LIP_FRONT, LEDGE.top]),
    at([HEAD.x1, LIP_FRONT, LEDGE.top]),
  ]
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
})()
export const FACE_AT = at([JX, FACE_Y, HEAD_MID + 2])
export const CONTROL_AT = {
  bluetooth: at([TOGGLE_X[0]!, TOGGLE_Y, PIVOT_Z]),
  wifi: at([TOGGLE_X[1]!, TOGGLE_Y, PIVOT_Z]),
  dark: at([TOGGLE_X[2]!, TOGGLE_Y, PIVOT_Z]),
  volume: at([(SLIDE.x0 + SLIDE.x1) / 2, SLIDER_Y[0]!, DECK_TOP]),
  brightness: at([(SLIDE.x0 + SLIDE.x1) / 2, SLIDER_Y[1]!, DECK_TOP]),
}
export const CHAT_BOX = CHAT
export const BUBBLE_BOX = BUBBLE
export const CHAT_SHAPE = flat(CHAT.x0, CHAT.z0, CHAT.x1, CHAT.z1, CHAT.r)
