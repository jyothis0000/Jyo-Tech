import {
  cameraOf,
  corners,
  cylinder,
  depthOf,
  haloOf,
  insetPlan,
  pathOf,
  planOutline,
  ring,
  roundedPlan,
  slabOf,
  onTop,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from '../../components/iso/iso-kit.ts'
import * as G from '../../components/iso/lathe.mjs'
import { tubePieces } from '../../components/iso/tube.mjs'
import type { Kind } from './model.ts'
import {
  BAR,
  BASE,
  BASE_H,
  BUTTON,
  CABLE_R,
  CABLE_X,
  CARDS,
  CASE,
  CLIP_Z,
  COLUMN,
  DESK,
  DESK_H,
  EXPORTS,
  FOOT_H,
  FOOTER,
  FRONT,
  GLASS,
  GLASS_Y,
  KB,
  KB_TOP,
  KB_Z,
  MAT,
  MAT_H,
  MOUSE,
  NECK_PLATE,
  P,
  PAGE,
  PANEL,
  PANEL_INNER,
  PROGRESS,
  ROWS,
  SCROLL,
  TABLE,
  TABS,
  TILES,
  TRAY,
  TRAY_BACK_H,
  TRAY_FLOOR,
  TRAY_FRONT_H,
  TRAY_WALL,
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
const fillet = G.fillet as unknown as (points: Point3[], radius: number, perArc: number, options: object) => Point3[]

// A rounded rectangle in a face's local (h, -z) coordinates, closed: slots, windows, screen boxes.
export const flat = (h0: number, z0: number, h1: number, z1: number, r: number, steps = 4) =>
  pathOf(roundedPlan({ x: h0, y: z0, w: h1 - h0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z] as Flat), true)
const box = (b: { x0: number; x1: number; z0: number; z1: number; r?: number }, steps = 4) => flat(b.x0, b.z0, b.x1, b.z1, b.r ?? 0, steps)
const rule = (x0: number, x1: number, z: number) => `M${x0} ${-z}H${x1}`
const ALONG_X = G.frameOf([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1])

// An opening in a vertical face, its inner walls shaded by facing (desk-computer's recess).
export interface Recess {
  front: string
  back: string
  shape: string
  tops: string
  sides: string[]
}

function recessOf(o: { x0: number; x1: number; z0: number; z1: number; r: number; depth: number }, plane: number): Recess {
  const points = roundedPlan({ x: o.x0, y: o.z0, w: o.x1 - o.x0, d: o.z1 - o.z0, r: o.r }, 6)
  const world = (h: number, z: number, back: number): Point3 => [h, plane - back, z]
  const { sinA } = cameraOf(P)
  const ch = (o.x0 + o.x1) / 2
  const cz = (o.z0 + o.z1) / 2
  const tops: string[] = []
  const sides: string[][] = [[], [], [], []]
  points.forEach(([ah, az], index) => {
    const [bh, bz] = points[(index + 1) % points.length]!
    const length = Math.hypot(bh - ah, bz - az) || 1
    let [nh, nz] = [(bz - az) / length, -(bh - ah) / length]
    if (nh * (ch - (ah + bh) / 2) + nz * (cz - (az + bz) / 2) < 0) [nh, nz] = [-nh, -nz]
    if (depthOf([nh, 0, nz], P) <= 1e-6) return
    const quad = pathOf([at(world(ah, az, 0)), at(world(bh, bz, 0)), at(world(bh, bz, o.depth)), at(world(ah, az, o.depth))], true)
    if (nz >= Math.abs(nh)) tops.push(quad)
    else sides[Math.min(3, Math.max(0, Math.floor(((nh * -sinA + 1) / 2) * 4)))]!.push(quad)
  })
  return { front: onFaceY(plane), back: onFaceY(plane - o.depth), shape: flat(o.x0, o.z0, o.x1, o.z1, o.r, 6), tops: tops.join(''), sides: sides.map((list) => list.join('')) }
}

/* ---------- desk ---------- */

const DESK_SCREWS = corners(DESK, 10)
export const DESK_ART = {
  halo: haloOf(DESK, -DESK_H - FOOT_H, DESK_H, P),
  feet: byDepth(corners(DESK, 24)).map(([x, y]) => [round(x, y, 7, -DESK_H - FOOT_H, 1.6, 28), round(x, y, 5.4, -DESK_H - FOOT_H + 1.6, FOOT_H - 1.6, 28)]),
  slab: solid(DESK, -DESK_H, DESK_H, 8, 1.6),
  groove: planOutline(insetPlan(DESK, 5), 0, P),
  screwRings: join(DESK_SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: DESK_SCREWS.map(([x, y]) => at([x, y, 0])),
  mat: solid(MAT, 0, MAT_H, 6),
  stitch: planOutline(insetPlan(MAT, 2.4), MAT_H, P, 6),
}

/* ---------- stand and cable ---------- */

const NECK_Z = BASE_H + 1.6
export const STAND_ART = {
  halo: haloOf(BASE, 0, 4, P),
  base: solid(BASE, 0, BASE_H, 8, 1),
  groove: planOutline(insetPlan(BASE, 4.5), BASE_H, P, 8),
  plate: solid(NECK_PLATE, BASE_H, 1.6, 4, 0.4),
  plateScrews: [-1, 1].map((side) => at([side * (NECK_PLATE.w / 2 - 3), NECK_PLATE.y + NECK_PLATE.d - 2.8, NECK_Z])),
  column: solid(COLUMN, NECK_Z, 150 - NECK_Z, 4, 0.6),
  clip: solid({ x: CABLE_X - 3.4, y: COLUMN.y + COLUMN.d, w: 6.8, d: CABLE_R * 2 + 1.5, r: 1 }, CLIP_Z[0], CLIP_Z[1] - CLIP_Z[0], 3, 0.4),
  clipScrew: at([CABLE_X, COLUMN.y + COLUMN.d + CABLE_R * 2 + 1.5, CLIP_Z[1] - 1.3]),
}

const CY = COLUMN.y + COLUMN.d + CABLE_R + 0.05
const EDGE_X = 118
const CABLE_TOP = 64
const ROUTE = fillet(
  [
    [CABLE_X, CY, CABLE_TOP],
    [CABLE_X, CY, BASE_H + CABLE_R],
    [BASE.x + BASE.w + 1.5, CY, BASE_H + CABLE_R],
    [BASE.x + BASE.w + 9, CY, CABLE_R],
    [EDGE_X, CY, CABLE_R],
    [EDGE_X, DESK.y + 2, CABLE_R],
    [EDGE_X, DESK.y - CABLE_R - 0.3, -1.5],
    [EDGE_X, DESK.y - CABLE_R - 0.3, -30],
  ],
  3.6,
  8,
  { P, tube: CABLE_R },
)
// The clip wraps the cable: the run is gapped where it passes through.
const CLIP_GAP: [number, number] = [CABLE_TOP - CLIP_Z[1], CABLE_TOP - CLIP_Z[0]]
export interface Piece {
  body: string
  shine: string
  shade: string
  edges: string
  wide: boolean
  mid: Point3
}
const PIECES = (tubePieces as unknown as (...args: unknown[]) => Piece[])(ROUTE, CABLE_R, P, { maxLength: 18, gaps: [CLIP_GAP], caps: [false, false] })
export const CABLE_UNDER = PIECES.filter((piece) => piece.mid[1] < DESK.y - 0.5)
export const CABLE_OVER = PIECES.filter((piece) => piece.mid[1] >= DESK.y - 0.5)
export const CABLE_TIE = solid({ x: EDGE_X - 3, y: DESK.y + 1.2, w: 6, d: 3.4, r: 0.8 }, 0, CABLE_R * 2 + 0.6, 3, 0.3)

/* ---------- monitor ---------- */

const CASE_PLAN: Plan = { x: CASE.x0, y: CASE.y0, w: CASE.x1 - CASE.x0, d: CASE.y1 - CASE.y0, r: 3 }
const key = (z: number) => G.frameAlong([CASE.x1, (CASE.y0 + CASE.y1) / 2, z], [1, 0, 0])
export const MONITOR_ART = {
  case: solid(CASE_PLAN, CASE.z0, CASE.z1 - CASE.z0, 6, 1.2),
  vents: join(Array.from({ length: 21 }, (_, index) => planOutline({ x: -81 + index * 8, y: CASE.y0 + 2.4, w: 2.2, d: 5.2, r: 1.1 }, CASE.z1, P, 3))),
  face: onFaceY(FRONT),
  logo: flat(-7, 49.6, 7, 52.4, 1.4),
  camera: flat(-1.5, 191.6, 1.5, 194.4, 1.4),
  led: at([CASE.x1 - 10, FRONT, 51]),
  side: onFaceX(CASE.x1),
  keyFrame: flat(-(CASE.y1 - 2.2), 55, -(CASE.y0 + 2.2), 93, 2.4),
  keys: [60, 67, 74, 81].map((z) => turned(G.disc(0, 0.9, 1.5, key(z), P))),
  power: turned(G.disc(0, 1.2, 1.9, key(88), P)),
  powerRing: G.circleOf(key(88), 1.2, 1.1, P),
}

export const GLASS_RECESS = recessOf(GLASS, FRONT)

/* ---------- the screen: Chrome with the WebHarvest side panel, in glass coordinates ---------- */

const T = TABS
const mid = (a: number, b: number) => (a + b) / 2
const TAB_Z = mid(T.z0, T.z1) - 0.4
const BAR_Z = mid(BAR.z0, BAR.z1)
const cross = (x: number, z: number, s: number) => `M${x - s} ${-(z - s)}L${x + s} ${-(z + s)}M${x - s} ${-(z + s)}L${x + s} ${-(z - s)}`
const arrow = (x: number, z: number, dir: number) => `M${x + dir * 2.2} ${-z}H${x - dir * 2.2}M${x - dir * 0.6} ${-(z + 1.6)}L${x - dir * 2.2} ${-z}L${x - dir * 0.6} ${-(z - 1.6)}`
const circle = (x: number, z: number, r: number) => `M${x - r} ${-z}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

export const CHROME = {
  tabs: flat(GLASS.x0, T.z0, GLASS.x1, T.z1, 0),
  active: flat(-116, T.z0 - 1, -64, T.z1 - 1.4, 1.8),
  favicons: flat(-113.6, TAB_Z - 1.5, -110.6, TAB_Z + 1.5, 0.8) + flat(-58.6, TAB_Z - 1.5, -55.6, TAB_Z + 1.5, 0.8),
  titles: rule(-107.5, -80, TAB_Z),
  dimTitles: rule(-52.5, -33, TAB_Z),
  tabMarks: cross(-68.5, TAB_Z, 1.1) + `M${-23.5} ${-TAB_Z}h4M${-21.5} ${-(TAB_Z - 2)}v-4` + `M${-27} ${-(TAB_Z - 2.4)}v-4.6`,
  windowMarks: `M${95} ${-TAB_Z}h4` + flat(104, TAB_Z - 2, 108, TAB_Z + 2, 0.3) + cross(115, TAB_Z, 1.8),
  bar: flat(GLASS.x0, BAR.z0, GLASS.x1, BAR.z1, 0),
  nav: arrow(-113, BAR_Z, 1) + arrow(-105, BAR_Z, -1),
  reload: `M${-94.2} ${-(BAR_Z + 1.6)}A2.3 2.3 0 1 0 ${-94.2} ${-(BAR_Z - 1.6)}M${-94.2} ${-(BAR_Z + 1.6)}l-0.2 -1.6M${-94.2} ${-(BAR_Z + 1.6)}l-1.6 0.4`,
  omnibox: flat(-89, BAR.z0 + 2.2, 54, BAR.z1 - 2.2, 2.9, 6),
  lock: flat(-85.8, BAR_Z - 1.6, -83, BAR_Z + 0.6, 0.4) + `M${-85.1} ${-(BAR_Z + 0.6)}v-1a0.75 0.75 0 0 1 1.5 0v1`,
  star: `M${48.5} ${-(BAR_Z + 2.1)}l0.65 1.35 1.5 0.2-1.1 1.05 0.27 1.5-1.32-0.72-1.32 0.72 0.27-1.5-1.1-1.05 1.5-0.2Z`,
  puzzle: flat(60.6, BAR_Z - 2, 64.6, BAR_Z + 2, 0.6) + circle(62.6, BAR_Z + 2.6, 0.9) + circle(65.2, BAR_Z, 0.9),
  harvest: flat(68.6, BAR.z0 + 1.4, 77.4, BAR.z1 - 1.4, 2.2),
  harvestAt: [73, BAR_Z] as Flat,
  avatar: circle(104, BAR_Z, 2.5),
  menu: [113.8, 115.2, 116.6].map((x) => circle(115.2, BAR_Z - 1.6 + (x - 113.8) * 1.15, 0.38)).join(''),
  edge: rule(GLASS.x0, GLASS.x1, BAR.z0),
}

const CARD_ART = CARDS.map((c) => ({
  card: box(c),
  image: flat(c.x0 + 2, c.z1 - 13, c.x1 - 2, c.z1 - 2, 0.8),
  hill: pathOf(
    [
      [c.x0 + 2, -(c.z1 - 13)],
      [c.x0 + 2, -(c.z1 - 10.5)],
      [c.x0 + 11, -(c.z1 - 5.5)],
      [c.x0 + 17, -(c.z1 - 9)],
      [c.x0 + 22, -(c.z1 - 6.5)],
      [c.x1 - 2, -(c.z1 - 11)],
      [c.x1 - 2, -(c.z1 - 13)],
    ],
    true,
  ),
  sun: circle(c.x1 - 9, c.z1 - 5, 1.5),
  title: rule(c.x0 + 3, c.x1 - 9, c.z0 + 10) + rule(c.x0 + 3, c.x1 - 18, c.z0 + 7.4),
  price: flat(c.x0 + 3, c.z0 + 3.4, c.x0 + 15, c.z0 + 5.6, 0.6),
  cart: flat(c.x1 - 11, c.z0 + 2.6, c.x1 - 3, c.z0 + 6.4, 1.4),
}))

const TABLE_COLS = [0.34, 0.58, 0.8].map((share) => TABLE.x0 + (TABLE.x1 - TABLE.x0) * share)
const TABLE_ROWS = [TABLE.z1 - 4.5, TABLE.z1 - 9, TABLE.z1 - 13.5]

export const PAGE_ART = {
  page: flat(PAGE.x0, PAGE.z0, SCROLL.x1 + 1, PAGE.z1, 0),
  logo: flat(-115, 164.6, -110, 169.6, 1.2),
  name: rule(-107.6, -94, 167.1),
  nav: [
    [-72, -62],
    [-58, -46],
    [-42, -33],
    [-29, -19],
  ]
    .map(([a, b]) => rule(a!, b!, 167.1))
    .join(''),
  cart: flat(5.4, 165.4, 10.6, 168.8, 0.6) + `M${6.2} ${-168.8}v-1.2a1.8 1.8 0 0 1 3.6 0v1.2`,
  headEdge: rule(PAGE.x0, SCROLL.x0, 162.5),
  heading: flat(-114, 153.6, -72, 157.2, 0.6),
  subhead: flat(-114, 150.4, -92, 151.8, 0.5),
  sort: flat(-8, 150.6, 10, 156, 1),
  sortMark: `M${5} ${-154.2}l1.5 1.5 1.5-1.5`,
  cards: CARD_ART,
  table: box(TABLE),
  tableHead: flat(TABLE.x0, TABLE_ROWS[0]!, TABLE.x1, TABLE.z1, 0),
  tableLines: join([...TABLE_COLS.map((x) => `M${x} ${-TABLE.z0}V${-TABLE.z1}`), ...TABLE_ROWS.map((z) => rule(TABLE.x0, TABLE.x1, z))]),
  text: join([
    [89, -56, 10],
    [85.4, -56, 6],
    [81.8, -56, 9],
    [78.2, -56, 2],
    [74.6, -56, -14],
  ].map(([z, a, b]) => rule(a!, b!, z!))),
  footer: flat(PAGE.x0, FOOTER.z0, SCROLL.x0 - 0.1, FOOTER.z1, 0),
  links: join([-114, -94, -74].flatMap((x) => [rule(x, x + 14, 64.6), rule(x, x + 10, 61.6), rule(x, x + 12, 58.6)])),
  mail: flat(-39, 63.2, -34.6, 66, 0.3) + `M${-39} ${-66}L${-36.8} ${-64.4}L${-34.6} ${-66}`,
  phone: flat(-38, 57.9, -35.6, 61.4, 0.6),
  contacts: rule(-32, -6, 64.6) + rule(-32, -14, 59.6),
  track: flat(SCROLL.x0, PAGE.z0 + 1.2, SCROLL.x1, PAGE.z1 - 1.2, 1.6),
  thumb: flat(SCROLL.x0 + 0.6, 138, SCROLL.x1 - 0.6, 168.6, 1),
}

const I = PANEL_INNER
const HEAD_Z = 167.2
export const PANEL_ART = {
  panel: flat(PANEL.x0, PANEL.z0, PANEL.x1, PANEL.z1, 0),
  divider: `M${PANEL.x0} ${-PANEL.z0}V${-PANEL.z1}`,
  markAt: [I.x0 + 2.6, HEAD_Z] as Flat,
  nameAt: [I.x0 + 7.4, HEAD_Z - 1.5] as Flat,
  hostAt: [I.x1 - 8.4, HEAD_Z - 1.1] as Flat,
  close: cross(I.x1 - 2, HEAD_Z, 1.3),
  tabAt: [
    [I.x0 + 0.6, 157],
    [I.x0 + 15.6, 157],
  ] as Flat[],
  tabLine: flat(I.x0, 154.4, I.x0 + 10.4, 155.2, 0.4),
  tabEdge: rule(PANEL.x0, PANEL.x1, 154.4),
  title: rule(I.x0, I.x0 + 66, 151.2),
  sub: rule(I.x0, I.x0 + 50, 148.2),
  button: box(BUTTON, 5),
  buttonAt: [mid(BUTTON.x0, BUTTON.x1) + 3, BUTTON.z0 + 3.4] as Flat,
  buttonIcon: (() => {
    const x = mid(BUTTON.x0, BUTTON.x1) - 16
    const z = mid(BUTTON.z0, BUTTON.z1)
    return `M${x - 2.2} ${-z}A2.2 2.2 0 0 1 ${x + 1.6} ${-(z + 1.5)}M${x + 2.2} ${-z}A2.2 2.2 0 0 1 ${x - 1.6} ${-(z - 1.5)}M${x + 1.9} ${-(z + 2.8)}v1.6h-1.6M${x - 1.9} ${-(z - 2.8)}v-1.6h1.6`
  })(),
  progress: box({ ...PROGRESS, r: 0.5 }),
  progressFrom: PROGRESS.x0,
  tiles: TILES.map((tile) => box(tile, 4)),
  rows: ROWS.map((top) => ({
    thumb: flat(I.x0, top - 5.2, I.x0 + 5.2, top, 0.6),
    lines: rule(I.x0 + 7.6, I.x0 + 56, top - 1.6) + rule(I.x0 + 7.6, I.x0 + 38, top - 3.9),
    price: flat(I.x1 - 13, top - 2.4, I.x1, top - 0.8, 0.5),
  })),
  rowEdge: rule(PANEL.x0, PANEL.x1, 73.4),
  exports: EXPORTS.map((button) => box(button, 4)),
}

// The leaf mark from WebHarvest's own icon (24-unit box), placed by translate and scale.
export const MARK = {
  stem: 'M12 21V11',
  leaves: 'M12 11c0-4 3-7 8-7 0 5-3 8-8 7ZM12 14c0-3-2.5-5.5-7-5.5 0 4 2.5 6 7 5.5Z',
}
export const markAt = ([x, z]: Flat, size: number) => `translate(${x - size / 2} ${-z - size / 2}) scale(${size / 24})`

/* ---------- keyboard ---------- */

type Row = [string, number][]
const KEY_ROWS: Row[] = [
  [['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['Backspace', 2]],
  [['Tab', 1.5], ['q', 1], ['w', 1], ['e', 1], ['r', 1], ['t', 1], ['y', 1], ['u', 1], ['i', 1], ['o', 1], ['p', 1], ['[', 1], [']', 1], ['\\', 1.5]],
  [['Caps', 1.75], ['a', 1], ['s', 1], ['d', 1], ['f', 1], ['g', 1], ['h', 1], ['j', 1], ['k', 1], ['l', 1], [';', 1], ["'", 1], ['Enter', 2.25]],
  [['Shift', 2.25], ['z', 1], ['x', 1], ['c', 1], ['v', 1], ['b', 1], ['n', 1], ['m', 1], [',', 1], ['.', 1], ['/', 1], ['ShiftRight', 2.75]],
  [['Ctrl', 1.25], ['Win', 1.25], ['Alt', 1.25], ['Space', 6.25], ['AltRight', 1.25], ['Fn', 1.25], ['Menu', 1.25], ['CtrlRight', 1.25]],
]
const ROW_H = [5, 4.6, 4.2, 3.8, 3.4]
const KEYS_X = KB.x + (KB.w - U * 15) / 2
const KEYS_Y = KB.y + (KB.d - U * 5) / 2 + 0.6

export const KEYS = KEY_ROWS.flatMap((row, r) => {
  let x = KEYS_X
  return row.map(([name, width]) => {
    const plan = { x: x + 0.65, y: KEYS_Y + r * U + 0.65, w: width * U - 1.3, d: U - 1.3, r: 1.2 }
    x += width * U
    return { name, cap: solid(plan, KB_TOP, ROW_H[r]!, 3, 0.4), dish: planOutline(insetPlan(plan, 1.5), KB_TOP + ROW_H[r]!, P, 3) }
  })
})

export const KEYBOARD_ART = {
  halo: haloOf(KB, MAT_H, 4, P),
  feet: byDepth(corners(KB, 8)).map(([x, y]) => round(x, y, 2.6, MAT_H, KB_Z - MAT_H, 16)),
  base: solid(KB, KB_Z, KB_TOP - KB_Z, 6, 1),
  well: planOutline({ x: KEYS_X - 1.3, y: KEYS_Y - 1.3, w: U * 15 + 2.6, d: U * 5 + 2.6, r: 2 }, KB_TOP, P, 4),
  screws: [at([KB.x + 3.4, KB.y + 2.2, KB_TOP]), at([KB.x + KB.w - 3.4, KB.y + 2.2, KB_TOP])],
  lamps: [0, 1, 2].map((index) => at([KB.x + KB.w - 14 + index * 4, KB.y + 2.2, KB_TOP])),
}

/* ---------- mouse ---------- */

// An ellipsoid shell sunk a little into the mat, shown above the mat only, with button seams and the wheel.
const MOUSE_F = G.frameAlong([MOUSE.x, MOUSE.y, MAT_H - MOUSE.sink], [0, 1, 0])
const mouseR = (s: number) => MOUSE.b * Math.sqrt(Math.max(0, 1 - (s / MOUSE.a) ** 2))
const mouseSlope = (s: number) => (-MOUSE.b * s) / (MOUSE.a ** 2 * Math.sqrt(Math.max(4e-3, 1 - (s / MOUSE.a) ** 2)))
const MOUSE_PROFILE = Array.from({ length: 33 }, (_, index) => {
  const s = -MOUSE.a + (2 * MOUSE.a * index) / 32
  return [s, mouseR(s), 1]
})
const onShell = (s: number, across: number): Point3 => [MOUSE.x + across, MOUSE.y + s, MAT_H - MOUSE.sink + Math.sqrt(Math.max(0, mouseR(s) ** 2 - across ** 2))]
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
const MOUSE_CLIP = (() => {
  const low = FOOTPRINT.map(([x, y]) => at([x, y, MAT_H]))
  return pathOf(G.hullOf([...low, ...FOOTPRINT.map(([x, y]) => at([x, y, MAT_H + 30]))]) as Flat[], true)
})()

export const MOUSE_ART = {
  halo: haloOf({ x: MOUSE.x - 6, y: MOUSE.y - 9, w: 12, d: 18, r: 6 }, MAT_H, 3, P),
  base: pathOf(FOOTPRINT.map(([x, y]) => at([x, y, MAT_H])), true),
  clip: MOUSE_CLIP,
  shell: turned((G.lathe as (...args: unknown[]) => unknown)(MOUSE_PROFILE, MOUSE_F, P, { smooth: { slope: mouseSlope, radius: mouseR } })),
  seams: join([
    G.arcOf(MOUSE_F, CROSS_S, mouseR(CROSS_S), P, { slope: mouseSlope(CROSS_S), from: Math.asin(MOUSE.sink / mouseR(CROSS_S)), to: Math.PI - Math.asin(MOUSE.sink / mouseR(CROSS_S)) }),
    pathOf([at(onShell(CROSS_S, 0)), at(onShell(WHEEL.s1, 0))]),
    seamForward,
  ]),
  slot: stadiumOn(WHEEL.s0, WHEEL.s1, WHEEL.half),
  wheel: stadiumOn(WHEEL.s0 + 0.5, WHEEL.s1 - 0.5, WHEEL.half - 0.4),
}

/* ---------- export tray ---------- */

const [FLOOR0, FLOOR1] = TRAY_FLOOR
const Y0 = TRAY.y
const Y1 = TRAY.y + TRAY.d
const SIDE: Plane[] = [
  [Y0, FLOOR1],
  [Y1, FLOOR1],
  [Y1, TRAY_FRONT_H + FLOOR1],
  [Y1 - 6, TRAY_FRONT_H + FLOOR1],
  [Y0, TRAY_BACK_H + FLOOR1],
]
const sideWall = (x: number) => turned(G.prismOf(ALONG_X, SIDE, x, x + TRAY_WALL, P))
const HOLDER = { x0: TRAY.x + TRAY.w / 2 - 9, x1: TRAY.x + TRAY.w / 2 + 9, z0: FLOOR1 + 0.9, z1: FLOOR1 + TRAY_FRONT_H - 1 }
export const TRAY_ART = {
  halo: haloOf(TRAY, 0, 4, P),
  feet: byDepth(corners(TRAY, 3)).map(([x, y]) => round(x, y, 1.6, 0, FLOOR0, 14)),
  floor: solid(TRAY, FLOOR0, FLOOR1 - FLOOR0, 4, 0.3),
  ribs: join([0.3, 0.5, 0.7].map((share) => onTop([[TRAY.x + TRAY_WALL, Y0 + TRAY.d * share], [TRAY.x + TRAY.w - TRAY_WALL, Y0 + TRAY.d * share]], FLOOR1, P))),
  back: solid({ x: TRAY.x + TRAY_WALL, y: Y0, w: TRAY.w - TRAY_WALL * 2, d: TRAY_WALL, r: 0.3 }, FLOOR1, TRAY_BACK_H, 2, 0.3),
  far: sideWall(TRAY.x),
  near: sideWall(TRAY.x + TRAY.w - TRAY_WALL),
  front: solid({ x: TRAY.x + TRAY_WALL, y: Y1 - TRAY_WALL, w: TRAY.w - TRAY_WALL * 2, d: TRAY_WALL, r: 0.3 }, FLOOR1, TRAY_FRONT_H, 2, 0.3),
  rivets: [Y0 + 3, Y1 - 3].map((y) => at([TRAY.x + TRAY.w, y, FLOOR1 + 2])),
  face: onFaceY(Y1),
  holder: flat(HOLDER.x0, HOLDER.z0, HOLDER.x1, HOLDER.z1, 0.6),
  holderCard: flat(HOLDER.x0 + 1.2, HOLDER.z0 + 0.6, HOLDER.x1 - 1.2, HOLDER.z1 - 0.9, 0.3),
  holderRules: rule(HOLDER.x0 + 3, HOLDER.x1 - 4, HOLDER.z0 + 2.2),
  holderDots: [HOLDER.x0 - 1.6, HOLDER.x1 + 1.6].map((x) => at([x, Y1, mid(HOLDER.z0, HOLDER.z1)])),
}

/* ---------- tokens ---------- */

interface Shape {
  outline: Plane[]
  closed: Plane[][]
  open: Plane[][]
  free: Plane[][]
  voids: Plane[][]
}

const quad = (x0: number, y0: number, x1: number, y1: number): Plane[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const ring2 = (cx: number, cy: number, r: number, steps = 14): Plane[] =>
  Array.from({ length: steps }, (_, index) => [cx + r * Math.cos((index / steps) * Math.PI * 2), cy + r * Math.sin((index / steps) * Math.PI * 2)])
const pill = (x0: number, x1: number, r: number, steps = 8): Plane[] => [
  ...Array.from({ length: steps + 1 }, (_, index): Plane => {
    const angle = Math.PI / 2 + (index / steps) * Math.PI
    return [x0 + r * Math.cos(angle), r * Math.sin(angle)]
  }),
  ...Array.from({ length: steps + 1 }, (_, index): Plane => {
    const angle = -Math.PI / 2 + (index / steps) * Math.PI
    return [x1 + r * Math.cos(angle), r * Math.sin(angle)]
  }),
]
const shift = (points: Plane[], dx: number, dy: number): Plane[] => points.map(([x, y]) => [x + dx, y + dy])

const SHAPES: Record<Kind, Shape> = {
  tag: {
    outline: [[-6, -4], [3, -4], [6, 0], [3, 4], [-6, 4]],
    closed: [ring2(2.8, 0, 0.9, 12)],
    open: [],
    free: [[[-4.4, -1.4], [0, -1.4]], [[-4.4, 1.2], [-1.4, 1.2]]],
    voids: [],
  },
  frame: {
    outline: roundedPlan({ x: -5.6, y: -4.5, w: 11.2, d: 9, r: 0.6 }, 2),
    closed: [quad(-4.3, -3.2, 4.3, 3.2), ring2(1.8, -1.2, 0.8, 10)],
    open: [[[-4.3, 2.2], [-1.6, -0.6], [0.4, 1.2], [2, 0], [4.3, 2.2]]],
    free: [],
    voids: [],
  },
  link: {
    outline: pill(-3, 3, 3.6),
    closed: [shift(pill(-0.8, 0.8, 2.3), -2.2, 0), shift(pill(-0.8, 0.8, 2.3), 2.2, 0)],
    open: [],
    free: [],
    voids: [shift(pill(-0.8, 0.8, 1.1), -2.2, 0), shift(pill(-0.8, 0.8, 1.1), 2.2, 0)],
  },
  grid: {
    outline: roundedPlan({ x: -5.2, y: -4.5, w: 10.4, d: 9, r: 0.5 }, 2),
    closed: [quad(-4, -3.3, 4, 3.3)],
    open: [[[-1.33, -3.3], [-1.33, 3.3]], [[1.33, -3.3], [1.33, 3.3]], [[-4, -1.1], [4, -1.1]], [[-4, 1.1], [4, 1.1]]],
    free: [],
    voids: [],
  },
  card: {
    outline: roundedPlan({ x: -6, y: -4, w: 12, d: 8, r: 1 }, 3),
    closed: [ring2(-3, 0, 1.7, 14)],
    open: [],
    free: [[[-0.4, -1.2], [4, -1.2]], [[-0.4, 1.2], [2.6, 1.2]]],
    voids: [],
  },
  label: {
    outline: roundedPlan({ x: -6, y: -3.6, w: 12, d: 7.2, r: 1.6 }, 3),
    closed: [],
    open: [[[-2.8, -3.6], [-2.8, 3.6]]],
    free: [[[-1.4, -1.2], [4.2, -1.2]], [[-1.4, 1.2], [2.4, 1.2]]],
    voids: [],
  },
}

export type Frame3 = { o: Point3; a: Point3; u: Point3; v: Point3 }
export const onFrame = (F: Frame3, s: number, [u, v]: Plane): Point3 => [
  F.o[0] + F.a[0] * s + F.u[0] * u + F.v[0] * v,
  F.o[1] + F.a[1] * s + F.u[1] * u + F.v[1] * v,
  F.o[2] + F.a[2] * s + F.u[2] * u + F.v[2] * v,
]

export interface TokenArt {
  paths: Paths
  closed: string
  open: string
  free: string
  voids: string
}

export const TOKEN_H = 2.2
const TOKEN_SCALE = 1.2
// Half width and half height of each token on the glass, for the launch check.
export const TOKEN_HALF = Object.fromEntries(
  (Object.keys(SHAPES) as Kind[]).map((kind) => [kind, [0, 1].map((axis) => Math.max(...SHAPES[kind].outline.map((point) => Math.abs(point[axis]!))) * TOKEN_SCALE)]),
) as Record<Kind, number[]>
// Tokens stand parallel to the glass (thickness toward the viewer), built at the origin and moved whole.
const UPRIGHT: Frame3 = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] }

export const TOKENS = Object.fromEntries(
  (Object.keys(SHAPES) as Kind[]).map((kind) => {
    const raw = SHAPES[kind]
    const grow = (points: Plane[]) => points.map(([u, v]): Plane => [u * TOKEN_SCALE, v * TOKEN_SCALE])
    const line = (points: Plane[], closed: boolean) => pathOf(points.map((point) => at(onFrame(UPRIGHT, TOKEN_H, point))), closed)
    const art: TokenArt = {
      paths: turned(G.prismOf(UPRIGHT, grow(raw.outline), 0, TOKEN_H, P)),
      closed: join(raw.closed.map((points) => line(grow(points), true))),
      open: join(raw.open.map((points) => line(grow(points), false))),
      free: join(raw.free.map((points) => line(grow(points), false))),
      voids: join(raw.voids.map((points) => line(grow(points), true))),
    }
    return [kind, art]
  }),
) as Record<Kind, TokenArt>

/* ---------- hit areas ---------- */

export const TILE_HULLS = TILES.map((tile) =>
  [
    [tile.x0, tile.z0],
    [tile.x1, tile.z0],
    [tile.x1, tile.z1],
    [tile.x0, tile.z1],
  ].map(([x, z]) => at([x!, GLASS_Y, z!])),
)

