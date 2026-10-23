import { boxCorners, fitProjection, iso, sideMatrix, type Flat, type Plan, type Point3 } from '../../components/iso/iso-kit.ts'

export const WIDTH = 600
export const HEIGHT = 430
export const AZIMUTH = 58

export const DESK: Plan = { x: -126, y: -96, w: 352, d: 186, r: 10 }
export const DESK_H = 9
export const FOOT_H = 5

// Monitor: the case front faces +y; the glass sits 1.4 back in the bezel.
export const CASE = { x0: -112, x1: 112, y0: -46, y1: -36, z0: 50, z1: 186 }
export const FRONT = CASE.y1
export const GLASS = { x0: -104, x1: 104, z0: 60, z1: 180, r: 3, depth: 1.4 }
export const GLASS_Y = FRONT - GLASS.depth
export const NECK: Plan = { x: -9, y: -54, w: 18, d: 8, r: 3 }
export const STAND: Plan = { x: -44, y: -86, w: 88, d: 54, r: 10 }

// The taskbar is a real ledge across the foot of the glass: a floor, a front lip and two end caps.
export const LEDGE = { x0: GLASS.x0, x1: GLASS.x1, y0: GLASS_Y, y1: -5.4, floor: GLASS.z0, floorTop: GLASS.z0 + 3, lip: 4, top: 73.5, cap: 3.4 }
export const LIP_FRONT = LEDGE.y1
export const LIP_BACK = LEDGE.y1 - LEDGE.lip

// Jo stands on the ledge floor behind the lip; head and hands show above it. Sizes are the
// robot model's (head 100 wide) times JS.
export const JS = 0.432
export const JX = 54
export const HEAD = { x0: JX - 50 * JS, x1: JX + 50 * JS, y0: -35.6, y1: -14.4, z0: 68, z1: 68 + 84 * JS, r: 31 * JS }
export const HEAD_MID = (HEAD.z0 + HEAD.z1) / 2
export const RIM_Y = HEAD.y1 + 1
export const FACE_Y = RIM_Y + 1
export const RISE = 3.4
export const ANTENNA = { z0: HEAD.z1, collar: 1.3, stalk: 6.4, ball: 3.5 }
export const BALL: Point3 = [JX, (HEAD.y0 + HEAD.y1) / 2, ANTENNA.z0 + ANTENNA.collar + ANTENNA.stalk + ANTENNA.ball - 0.5]
export const HANDS: Point3[] = [-1, 1].map((side) => [JX + side * 43 * JS, LIP_FRONT - 1.3, LEDGE.top + 2] as Point3)
export const HAND = { a: 12.6 * JS, b: 8.6 * JS }

// The chat box and the reminder bubble are drawn in the plane of the glass (local x, -z).
export const CHAT = { x0: -70, x1: 22, z0: 82, z1: 146, r: 4 }
export const BUBBLE = { x0: JX - 40, x1: JX + 42, z0: 125, z1: 164, r: 4 }

export const PC = { x: 160, y: -80, w: 48, d: 76, r: 4 }
export const PC_Z = 3.6
export const PC_TOP = 116
export const PC_FRONT = PC.y + PC.d
export const PC_BEZEL = 1.6
export const PC_FACE = PC_FRONT + PC_BEZEL
export const PC_SIDE = PC.x + PC.w

export const KB: Plan = { x: -98, y: 14, w: 150, d: 54, r: 4 }
export const KB_Z = 1.6
export const KB_TOP = 8.6
export const U = 9.2

export const DECK: Plan = { x: 62, y: 20, w: 118, d: 60, r: 5 }
export const DECK_Z = 2
export const DECK_TOP = 10

const PAD = 26

export const P = fitProjection(
  [
    ...boxCorners(DESK, -DESK_H - FOOT_H, 0),
    ...boxCorners({ x: CASE.x0, y: CASE.y0, w: CASE.x1 - CASE.x0, d: CASE.y1 - CASE.y0, r: 0 }, CASE.z0, CASE.z1),
  ],
  WIDTH,
  HEIGHT,
  { pad: PAD, azimuth: AZIMUTH },
)

export const at = (point: Point3) => iso(point, P)

const ORIGIN = at([0, 0, 0])
const minus = (a: Flat, b: Flat): Flat => [a[0] - b[0], a[1] - b[1]]
const fine = (value: number) => Math.round(value * 100) / 100
const EX = minus(at([1, 0, 0]), ORIGIN)
const EY = minus(at([0, 1, 0]), ORIGIN)
const EZ = minus(at([0, 0, 1]), ORIGIN)

export const shift = ([x, y, z]: Point3) => `translate(${fine(EX[0] * x + EY[0] * y + EZ[0] * z)} ${fine(EX[1] * x + EY[1] * y + EZ[1] * z)})`

// Local (x, -z) on a face whose normal is +y, and (-y, -z) on a face whose normal is +x.
export const onFaceY = (y: number) => sideMatrix([0, y], 0, P, 'left')
export const onFaceX = (x: number) => sideMatrix([x, 0], 0, P, 'right')

