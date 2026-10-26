import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from '../../components/iso/iso-kit.ts'
import { LAYERS } from './model.ts'

export const WIDTH = 600
export const HEIGHT = 440
export const AZIMUTH = 60

export const MAT: Plan = { x: -168, y: -114, w: 318, d: 222, r: 12 }
export const MAT_H = 1.4

// Laptop base: rubber feet, then the case from z = FOOT to DECK.
export const BASE: Plan = { x: -120, y: -80, w: 240, d: 160, r: 9 }
export const FOOT = 1.8
export const DECK = 11
export const KEY_H = 1

// Lid frame: u along x, v up the lid from the hinge axis, s out of the screen (s = 0 on the bezel).
export const RECLINE = 14
const t = (RECLINE * Math.PI) / 180
export const UP: Point3 = [0, -Math.sin(t), Math.cos(t)]
export const OUT: Point3 = [0, Math.cos(t), Math.sin(t)]
export const HINGE_R = 3.2
export const AXIS: Point3 = [0, BASE.y + 6, DECK + HINGE_R]
export const LID_T = 5.4
// The axis sits in the middle of the lid's thickness.
export const ORIGIN: Point3 = [0, AXIS[1] + OUT[1] * LID_T * 0.5, AXIS[2] + OUT[2] * LID_T * 0.5]
export const LID: Plan = { x: -118, y: HINGE_R + 0.4, w: 236, d: 150, r: 7 }
export const GLASS: Plan = { x: -108, y: 15, w: 216, d: 128, r: 2.5 }
export const GLASS_S = -0.7

export function lid(u: number, v: number, s: number): Point3 {
  return [
    ORIGIN[0] + u + UP[0] * v + OUT[0] * s,
    ORIGIN[1] + UP[1] * v + OUT[1] * s,
    ORIGIN[2] + UP[2] * v + OUT[2] * s,
  ]
}

// Chrome window, in lid (u, v).
export const TABS = { v0: 132, v1: 143 }
export const BAR = { v0: 120, v1: 132 }
export const PAGE = { v0: 15, v1: 120 }
export const ICON: Plan = { x: 69.5, y: 123, w: 6, d: 6, r: 1.4 }
export const POPUP: Plan = { x: 24, y: 27, w: 78, d: 93.5, r: 1.6 }
export const ROW_H = 11.2

// The plates are the page's main area, left of the popup; each lifts to its own place in the fan.
export const PLATE: Plan = { x: -102, y: 24, w: 114, d: 78, r: 2.4 }
export const PLATE_T = 2.6
export const TAB_W = 12
export const TAB_H = 5.5
export const tabX = (index: number) => PLATE.x + 7 + index * (TAB_W + 3)
// Final offset of each plate from its rest pose in the screen: out of the screen, the front
// ones lower and further left, so each plate behind shows a strip along its top and right.
export const OUT_AT = (index: number) => 16 + (LAYERS - 1 - index) * 12.5
export const DROP_AT = (index: number) => (LAYERS - 1 - index) * 4.4 - 6
export const SLIDE_AT = (index: number) => (LAYERS - 1 - index) * 2.2
export const PULL = 13

export const plateMove = (index: number, share: number, pull: number): Point3 => {
  const s = OUT_AT(index) * share
  const v = -DROP_AT(index) * share + PULL * pull
  const u = -SLIDE_AT(index) * share
  return [u + UP[0] * v + OUT[0] * s, UP[1] * v + OUT[1] * s, UP[2] * v + OUT[2] * s]
}

const plateCorners = (index: number) => {
  const [dx, dy, dz] = plateMove(index, 1, 0)
  return [
    [PLATE.x, PLATE.y],
    [PLATE.x + PLATE.w, PLATE.y],
    [PLATE.x, PLATE.y + PLATE.d + TAB_H + PULL],
    [PLATE.x + PLATE.w, PLATE.y + PLATE.d + TAB_H + PULL],
  ].map(([u, v]) => {
    const [x, y, z] = lid(u!, v!, PLATE_T)
    return [x + dx, y + dy, z + dz] as Point3
  })
}

export const P = fitProjection(
  [
    ...boxCorners(MAT, -MAT_H, 0),
    lid(LID.x, LID.y + LID.d, 0),
    lid(LID.x + LID.w, LID.y + LID.d, 0),
    ...plateCorners(0),
    ...plateCorners(LAYERS - 1),
  ],
  WIDTH,
  HEIGHT,
  { pad: 20, azimuth: AZIMUTH },
)

export const at = (point: Point3): Flat => iso(point, P)
export const onLid = (u: number, v: number, s: number) => at(lid(u, v, s))

const thousandth = (value: number) => Math.round(value * 1000) / 1000

// Maps local (u, -v) onto the lid plane at s, for text and fills drawn in the screen.
export function planeMatrix(s: number) {
  const o = onLid(0, 0, s)
  const a = onLid(1, 0, s)
  const b = onLid(0, 1, s)
  return `matrix(${[a[0] - o[0], a[1] - o[1], o[0] - b[0], o[1] - b[1], o[0], o[1]].map(thousandth).join(' ')})`
}
