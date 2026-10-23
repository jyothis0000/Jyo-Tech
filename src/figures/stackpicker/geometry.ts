import {
  corners,
  cylinder,
  depthOf,
  dotGrid,
  haloOf,
  insetPlan,
  pathOf,
  planOutline,
  roundedPlan,
  sideSeam,
  slabOf,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from '../../components/iso/iso-kit.ts'
import * as G from '../../components/iso/lathe.mjs'
import { LAYERS, ROWS, STACK } from './model.ts'
import {
  AXIS,
  BAR,
  BASE,
  DECK,
  FOOT,
  GLASS,
  GLASS_S,
  HINGE_R,
  ICON,
  KEY_H,
  LID,
  LID_T,
  MAT,
  MAT_H,
  ORIGIN,
  OUT,
  P,
  PAGE,
  PLATE,
  PLATE_T,
  POPUP,
  ROW_H,
  TABS,
  TAB_H,
  TAB_W,
  UP,
  at,
  lid,
  onLid,
  tabX,
} from './view.ts'

type UV = [number, number]
const TAU = Math.PI * 2
const join = (paths: string[]) => paths.join('')
const prismOf = G.prismOf as (F: unknown, polygon: UV[], s0: number, s1: number, P: unknown) => SolidPaths
const toneOf = G.toneOf as (normal: Point3, P: unknown) => number
const discOf = G.disc as (s0: number, s1: number, r: number, F: unknown, P: unknown) => SolidPaths
const LID_FRAME = G.frameOf(ORIGIN, OUT, [1, 0, 0], UP)

// Paths in the lid plane at depth s, from lid (u, v) points.
const poly = (points: UV[], s: number, closed = true) => pathOf(points.map(([u, v]) => onLid(u, v, s)), closed)
const rr = (plan: Plan, s: number, steps = 4) => poly(roundedPlan(plan, steps), s)
const circle = (cu: number, cv: number, r: number, steps = 24): UV[] =>
  Array.from({ length: steps }, (_, i) => [cu + r * Math.cos((i / steps) * TAU), cv + r * Math.sin((i / steps) * TAU)])
const lidSolid = (points: UV[], s0: number, s1: number) => prismOf(LID_FRAME, points, s0, s1, P)
const lidSlab = (plan: Plan, s0: number, s1: number, steps = 4) => lidSolid(roundedPlan(plan, steps), s0, s1)

// A rectangle with only its top (or bottom) corners rounded.
function roundEnds(u0: number, u1: number, v0: number, v1: number, r: number, top: boolean, steps = 4): UV[] {
  const arc = (cu: number, cv: number, from: number): UV[] =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const angle = from + (i / steps) * (Math.PI / 2)
      return [cu + r * Math.cos(angle), cv + r * Math.sin(angle)]
    })
  return top
    ? [[u0, v0], [u1, v0], ...arc(u1 - r, v1 - r, 0), ...arc(u0 + r, v1 - r, Math.PI / 2)]
    : [...arc(u0 + r, v0 + r, Math.PI), ...arc(u1 - r, v0 + r, -Math.PI / 2), [u1, v1], [u0, v1]]
}
const rect = (u0: number, v0: number, u1: number, v1: number): UV[] => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
const bar = (u0: number, v0: number, u1: number, v1: number, s: number) => rr({ x: u0, y: v0, w: u1 - u0, d: v1 - v0, r: Math.min(v1 - v0, u1 - u0) / 2 }, s, 3)

const byDepth = (points: Plane[], z = 0) => [...points].sort((a, b) => depthOf([a[0], a[1], z], P) - depthOf([b[0], b[1], z], P))

// ---------------------------------------------------------------- desk mat and base

const SIDE = BASE.x + BASE.w
const FRONT = BASE.y + BASE.d
const onSide = (y: number, z: number) => at([SIDE, y, z])
const sideRound = (plan: Plan, steps = 3) => pathOf(roundedPlan(plan, steps).map(([y, z]) => onSide(y, z)), true)
const onFront = (x: number, z: number) => at([x, FRONT, z])

const WELL: Plan = { x: -102, y: -69, w: 204, d: 78, r: 3 }
const PAD: Plan = { x: -44, y: 21, w: 88, d: 50, r: 4 }
const GRILLE_X = [-115.4, 106]
const STICKER: Plan = { x: 62, y: 50, w: 24, d: 14, r: 1 }
const onTopLine = (a: Plane, b: Plane, z: number) => pathOf([at([a[0], a[1], z]), at([b[0], b[1], z])])

export const DESK_ART = {
  halo: haloOf(MAT, -MAT_H, MAT_H, P),
  mat: slabOf(MAT, -MAT_H, MAT_H, P, 8, 0.5),
  stitch: planOutline(insetPlan(MAT, 5), 0, P, 8),
}

export const BASE_ART = {
  halo: haloOf(BASE, 0, DECK, P),
  feet: byDepth(corners(BASE, 11)).map(([x, y]) => cylinder(x, y, 4.2, 0, FOOT, P, 24)),
  case: slabOf(BASE, FOOT, DECK - FOOT, P, 8, 1.2),
  seam: sideSeam(BASE, FOOT + 1.6, P, 8),
  notch: pathOf(Array.from({ length: 17 }, (_, i) => {
    const x = -16 + i * 2
    return onFront(x, DECK - 1.9 * (1 - (x / 16) ** 2))
  })),
  led: [onFront(92, FOOT + 4.6)] as Flat[],
  well: planOutline(WELL, DECK, P, 4),
  wellInner: planOutline(insetPlan(WELL, 1.3), DECK, P, 4),
  grilles: join(GRILLE_X.map((x) => planOutline({ x: x - 1.6, y: -67, w: 11, d: 74, r: 2.2 }, DECK, P, 4))),
  grilleDots: GRILLE_X.flatMap((x) => dotGrid(x + 1.1, -64.2, 3, 21, 3.4, DECK, P)),
  sticker: slabOf(STICKER, DECK, 0.3, P, 2),
  stickerLine: planOutline(insetPlan(STICKER, 1.2), DECK + 0.3, P, 2),
  stickerRules: join([0, 1, 2].map((i) => onTopLine([STICKER.x + 8.6, STICKER.y + 4 + i * 2.6], [STICKER.x + STICKER.w - 3 - i * 3, STICKER.y + 4 + i * 2.6], DECK + 0.3))),
  stickerMark: planOutline({ x: STICKER.x + 2.4, y: STICKER.y + 3, w: 4.6, d: 4.6, r: 0.6 }, DECK + 0.3, P, 2),
  pad: planOutline(PAD, DECK, P, 6),
  padInner: planOutline(insetPlan(PAD, 1.4), DECK, P, 6),
  // Right side: two USB-C, a USB-A with its tongue, vents and an audio jack.
  holes: join([
    sideRound({ x: -60, y: 4.6, w: 8, d: 2.8, r: 1.4 }),
    sideRound({ x: -48, y: 4.6, w: 8, d: 2.8, r: 1.4 }),
    sideRound({ x: -34, y: 4, w: 12, d: 4.2, r: 0.4 }),
    pathOf(circle(52, 6, 1.5, 20).map(([y, z]) => onSide(y, z)), true),
  ]),
  tongue: sideRound({ x: -33, y: 5.6, w: 10, d: 1.2, r: 0.2 }),
  jackRing: pathOf(circle(52, 6, 2.4, 24).map(([y, z]) => onSide(y, z)), true),
  vents: join(Array.from({ length: 9 }, (_, i) => sideRound({ x: -10 + i * 3.2, y: 4.2, w: 1.5, d: 4.6, r: 0.75 }))),
}

// ---------------------------------------------------------------- keyboard

const U = (WELL.w - 2) / 15
const KX = WELL.x + 1
interface KeyRow {
  y: number
  d: number
  keys: number[]
}
const ROWS_OF_KEYS: KeyRow[] = [
  { y: -68, d: 7.6, keys: Array(14).fill(15 / 14) },
  { y: -60.2, d: 13.2, keys: [...Array(13).fill(1), 2] },
  { y: -47, d: 13.2, keys: [1.5, ...Array(12).fill(1), 1.5] },
  { y: -33.8, d: 13.2, keys: [1.75, ...Array(11).fill(1), 2.25] },
  { y: -20.6, d: 13.2, keys: [2.25, ...Array(10).fill(1), 2.75] },
  { y: -7.4, d: 15.4, keys: [1, 1, 1, 1.25, 5.75, 1.25, 1, 1, 1, 1] },
]

const keyPlans: Plan[] = []
ROWS_OF_KEYS.forEach(({ y, d, keys }, row) => {
  let x = KX
  keys.forEach((width, index) => {
    const w = width * U
    const arrows = row === 5 && index >= 7
    if (arrows && index === 8) {
      // Up and down share one cell, each half as deep.
      keyPlans.push({ x: x + 0.7, y: y + 0.7, w: w - 1.4, d: d / 2 - 1, r: 1 })
      keyPlans.push({ x: x + 0.7, y: y + d / 2 + 0.3, w: w - 1.4, d: d / 2 - 1, r: 1 })
    } else if (arrows) {
      keyPlans.push({ x: x + 0.7, y: y + d / 2 + 0.3, w: w - 1.4, d: d / 2 - 1, r: 1 })
    } else keyPlans.push({ x: x + 0.7, y: y + 0.7, w: w - 1.4, d: d - 1.4, r: 1.2 })
    x += w
  })
})

export const KEY_ART = keyPlans
  .sort((a, b) => depthOf([a.x + a.w / 2, a.y + a.d / 2, 0], P) - depthOf([b.x + b.w / 2, b.y + b.d / 2, 0], P))
  .map((plan) => slabOf(plan, DECK, KEY_H, P, 3, 0.3))

// ---------------------------------------------------------------- hinge spine and lid

const SPINE = G.frameAlong(AXIS, [1, 0, 0])
export const HINGE_ART = {
  parts: [
    discOf(-98, -84, HINGE_R + 0.2, SPINE, P),
    discOf(-84, 84, HINGE_R - 0.3, SPINE, P),
    discOf(84, 98, HINGE_R + 0.2, SPINE, P),
  ],
  screws: [-91, 91].map((x) => at([x, AXIS[1] + HINGE_R * 0.55, AXIS[2] + HINGE_R * 0.95])) as Flat[],
}

// Inner walls of the screen recess, shaded by the way they face.
function recessWalls(plan: Plan, s0: number, s1: number) {
  const ring = roundedPlan(plan, 4)
  const cx = plan.x + plan.w / 2
  const cy = plan.y + plan.d / 2
  const view = G.viewOf(P) as Point3
  const buckets: string[][] = [[], [], [], [], []]
  ring.forEach(([au, av], index) => {
    const [bu, bv] = ring[(index + 1) % ring.length]!
    const length = Math.hypot(bu - au, bv - av) || 1
    let [nu, nv] = [(bv - av) / length, -(bu - au) / length]
    if (nu * (cx - (au + bu) / 2) + nv * (cy - (av + bv) / 2) < 0) [nu, nv] = [-nu, -nv]
    const normal: Point3 = [nu + UP[0] * nv, UP[1] * nv, UP[2] * nv]
    if (normal[0] * view[0] + normal[1] * view[1] + normal[2] * view[2] <= 0) return
    buckets[toneOf(normal, P)]!.push(pathOf([onLid(au, av, s0), onLid(bu, bv, s0), onLid(bu, bv, s1), onLid(au, av, s1)], true))
  })
  return { top: buckets[4]!.join(''), shades: buckets.slice(0, 4).map((list) => list.join('')) }
}

const CAM: UV = [0, 148.6]
export const LID_ART = {
  shell: lidSlab(LID, -LID_T, 0, 6),
  walls: recessWalls(GLASS, 0, GLASS_S),
  glass: rr(GLASS, GLASS_S),
  rim: rr(GLASS, 0),
  rimBack: rr(GLASS, GLASS_S),
  bumpers: join([[-110.6, 9], [110.6, 9], [-110.6, 148.5], [110.6, 148.5]].map(([u, v]) => poly(circle(u!, v!, 1.6, 16), 0))),
  cam: poly(circle(CAM[0], CAM[1], 1.1, 16), 0),
  camRing: poly(circle(CAM[0], CAM[1], 2, 20), 0),
}

// ---------------------------------------------------------------- Chrome, in the glass plane

const S = GLASS_S
const g = GLASS
const L = g.x
const R = g.x + g.w
const cross = (cu: number, cv: number, size: number, w: number) => {
  const a = size / 2
  const b = w / 2
  return poly([[cu - a, cv - a + b], [cu - a + b, cv - a], [cu + a, cv + a - b], [cu + a - b, cv + a]], S) +
    poly([[cu + a - b, cv - a], [cu + a, cv - a + b], [cu - a + b, cv + a], [cu - a, cv + a - b]], S)
}
const plus = (cu: number, cv: number, size: number, w: number) =>
  poly(rect(cu - size / 2, cv - w / 2, cu + size / 2, cv + w / 2), S) + poly(rect(cu - w / 2, cv - size / 2, cu + w / 2, cv + size / 2), S)
const arrow = (cu: number, cv: number, dir: 1 | -1) =>
  poly([[cu - 2.4 * dir, cv], [cu - 0.4 * dir, cv + 2], [cu - 0.4 * dir, cv + 0.55], [cu + 2.4 * dir, cv + 0.55], [cu + 2.4 * dir, cv - 0.55], [cu - 0.4 * dir, cv - 0.55], [cu - 0.4 * dir, cv - 2]], S)
function reload(cu: number, cv: number) {
  const outer: UV[] = []
  const inner: UV[] = []
  for (let i = 0; i <= 14; i++) {
    const angle = 0.75 + (i / 14) * 4.9
    outer.push([cu + 2.2 * Math.cos(angle), cv + 2.2 * Math.sin(angle)])
    inner.unshift([cu + 1.3 * Math.cos(angle), cv + 1.3 * Math.sin(angle)])
  }
  const tip = 0.75
  const head: UV[] = [[cu + 2.9 * Math.cos(tip), cv + 2.9 * Math.sin(tip) - 0.2], [cu + 0.6 * Math.cos(tip), cv + 0.6 * Math.sin(tip) + 0.4], [cu + 2.3, cv + 2.6]]
  return poly([...outer, ...inner], S) + poly(head, S)
}
function star(cu: number, cv: number, r: number) {
  return poly(Array.from({ length: 10 }, (_, i) => {
    const angle = Math.PI / 2 + (i / 10) * TAU
    const radius = i % 2 ? r * 0.45 : r
    return [cu + radius * Math.cos(angle), cv + radius * Math.sin(angle)] as UV
  }), S)
}

const TAB: [number, number] = [-100, -43]
const ICON_C: UV = [ICON.x + ICON.w / 2, ICON.y + ICON.d / 2]

export const CHROME_ART = {
  strip: poly(roundEnds(L, R, TABS.v0, TABS.v1, g.r, true), S),
  bar: poly(rect(L, BAR.v0, R, BAR.v1), S) + poly(roundEnds(TAB[0], TAB[1], BAR.v1 - 0.2, TABS.v1 - 1.6, 2.2, true), S),
  barLine: poly([[L, BAR.v0], [R, BAR.v0]], S, false),
  tabInk: join([
    rr({ x: -96, y: 134.5, w: 4, d: 4, r: 0.8 }, S),
    bar(-89, 136, -62, 137.2, S),
    cross(-48, 136.6, 3, 0.75),
  ]),
  tabsInk: join([plus(-36.5, 136.8, 3.6, 0.7), poly(rect(85, 137.1, 89, 137.8), S), cross(102.5, 137.4, 3.2, 0.7)]),
  maxBox: poly(rect(92, 135.4, 95.6, 139), S) + poly(rect(92.7, 136.1, 94.9, 138.3).reverse() as UV[], S),
  nav: join([arrow(-101.5, 126, 1), reload(-84, 126)]),
  navDim: arrow(-93, 126, -1),
  field: rr({ x: -77, y: 122.2, w: 132, d: 7.6, r: 3.8 }, S, 6),
  fieldInk: join([
    rr({ x: -73.4, y: 124.2, w: 2.8, d: 2.4, r: 0.4 }, S),
    poly([[-73, 126.6], [-73, 127.5], ...Array.from({ length: 9 }, (_, i) => [-72 + Math.cos(Math.PI - (i / 8) * Math.PI) * 1.0, 127.5 + Math.sin(Math.PI - (i / 8) * Math.PI) * 1.0] as UV), [-71, 126.6], [-71.5, 126.6], [-71.5, 127.5], ...Array.from({ length: 9 }, (_, i) => [-72 + Math.cos((i / 8) * Math.PI) * 0.5, 127.5 + Math.sin((i / 8) * Math.PI) * 0.5] as UV), [-72.5, 126.6]], S),
    bar(-67, 125.4, -28, 126.8, S),
    star(50.5, 126, 2.1),
  ]),
  puzzle: poly(rect(58.6, 123.8, 63, 128.2), S) + poly(circle(60.8, 128.6, 1, 12), S) + poly(circle(63.4, 126, 1, 12), S),
  press: poly(circle(ICON_C[0], ICON_C[1], 5, 28), S),
  icon: rr(ICON, S, 3),
  iconMarks: join([0, 1, 2].map((i) => rr({ x: ICON.x + 1.3 + i * 0.35, y: ICON.y + 1.1 + i * 1.35, w: ICON.w - 2.6 - i * 0.7, d: 0.8, r: 0.3 }, S, 2))),
  profile: poly(circle(85, 126, 2.4, 20), S),
  menu: join([124.4, 126, 127.6].map((v) => poly(circle(101, v, 0.45, 10), S))),
}

// The page: header, hero, three product cards and a footer. Shapes only, no words.
const CARDS = [[-100, -36.5], [-31.5, 31.5], [36.5, 100]]
export const PAGE_ART = {
  sheet: poly(roundEnds(L, R, PAGE.v0, PAGE.v1, g.r, false), S),
  bands: poly(rect(L, 110, R, PAGE.v1), S) + poly(roundEnds(L, R, PAGE.v0, 27, g.r, false), S),
  ink: join([
    rr({ x: -100, y: 112.4, w: 10, d: 5.2, r: 1 }, S),
    ...[30, 46, 62, 78].map((u) => bar(u, 114.5, u + 12, 115.7, S)),
    rr({ x: 88, y: 112.6, w: 12, d: 4.8, r: 2.4 }, S),
    bar(-100, 97.6, -30, 101.4, S),
    bar(-100, 92.2, -48, 96, S),
    bar(-100, 86.6, -22, 87.8, S),
    bar(-100, 83.4, -34, 84.6, S),
    rr({ x: -100, y: 76, w: 21, d: 4.8, r: 2.4 }, S),
    ...CARDS.flatMap(([u0, u1]) => [bar(u0! + 3, 44.4, u1! - 14, 45.8, S), bar(u0! + 3, 40.6, u1! - 26, 41.6, S), bar(u0! + 3, 35, u0! + 15, 36.6, S), rr({ x: u1! - 14, y: 34.6, w: 11, d: 3.8, r: 1.9 }, S)]),
    ...[-100, -60, -20].flatMap((u) => [bar(u, 22.6, u + 22, 23.6, S), bar(u, 19.8, u + 16, 20.8, S), bar(u, 17, u + 19, 18, S)]),
  ]),
  picture: rr({ x: -12, y: 76, w: 112, d: 30, r: 1.5 }, S),
  pictureInk: poly(circle(76, 98.4, 3.6, 24), S) + poly([[-12, 76], [-12, 80], [12, 94], [34, 83], [52, 91], [78, 79], [100, 87], [100, 76]], S),
  cards: join(CARDS.map(([u0, u1]) => rr({ x: u0!, y: 31.5, w: u1! - u0!, d: 39, r: 1.5 }, S))),
  cardPics: join(CARDS.map(([u0, u1]) => poly(roundEnds(u0!, u1!, 49, 70.5, 1.5, true), S))),
  cardPicInk: join(CARDS.map(([u0, u1]) => {
    const cu = (u0! + u1!) / 2
    return poly([[cu - 11, 51], [cu - 5, 61], [cu - 1, 56], [cu + 4, 64.5], [cu + 11, 51]], S)
  })),
}

// ---------------------------------------------------------------- popup

const PX0 = POPUP.x
const PX1 = POPUP.x + POPUP.w
const PTOP = POPUP.y + POPUP.d
export const HEAD_V = PTOP - 11.5
export const rowTop = (row: number) => HEAD_V - 2 - row * ROW_H
// As in the real popup: a small upper-case category heading over a chip with a dot and the name.
export const NAME_SIZE = 4.2
export const CAT_SIZE = 2.7
export const chipOf = (row: number): Plan => ({ x: PX0 + 4, y: rowTop(row) - ROW_H + 0.9, w: 9.4 + STACK[ROWS[row]!]!.name.length * NAME_SIZE * 0.6, d: 6.4, r: 1.6 })

export const POPUP_ART = {
  shadow: rr(POPUP, S, 3),
  panel: rr(POPUP, S, 3),
  header: poly(roundEnds(PX0, PX1, HEAD_V, PTOP, POPUP.r, true), S),
  // The header's gradient rule, fading out to the right (header::after in the popup's style.css).
  rule: poly(rect(PX0, HEAD_V - 0.3, PX1, HEAD_V + 0.3), S),
  mark: rr({ x: PX0 + 4, y: HEAD_V + 3, w: 5.6, d: 5.6, r: 1.3 }, S, 3),
  markInk: join([0, 1, 2].map((i) => rr({ x: PX0 + 5.1 + i * 0.3, y: HEAD_V + 4 + i * 1.25, w: 3.4 - i * 0.6, d: 0.7, r: 0.3 }, S, 2))),
  badge: rr({ x: PX0 + 43.5, y: HEAD_V + 3.6, w: 6.4, d: 4.4, r: 2.2 }, S, 4),
  host: bar(PX1 - 21, HEAD_V + 5.2, PX1 - 4, HEAD_V + 6.4, S),
  rows: Array.from({ length: LAYERS }, (_, row) => {
    const chip = chipOf(row)
    return {
      accent: rr({ x: PX0 + 0.8, y: rowTop(row) - ROW_H + 0.3, w: 1.4, d: ROW_H - 0.6, r: 0.6 }, S, 2),
      chip: rr(chip, S, 3),
      dot: poly(circle(chip.x + 3.6, chip.y + chip.d / 2, 1.1, 14), S),
    }
  }),
  outline: rr(POPUP, S, 3),
}

// ---------------------------------------------------------------- the plates

export const FRONT_S = GLASS_S + PLATE_T
const PANEL = { u0: PLATE.x + 5, u1: PLATE.x + PLATE.w - 5, v0: PLATE.y + 13, v1: PLATE.y + PLATE.d - 5 }

// Cut the line u·cos + v·sin = c to the panel rectangle.
function chord(angle: number, c: number): [UV, UV] | null {
  const { u0, u1, v0, v1 } = PANEL
  const [du, dv] = [-Math.sin(angle), Math.cos(angle)]
  const [pu, pv] = [Math.cos(angle) * c, Math.sin(angle) * c]
  let lo = -1e9
  let hi = 1e9
  for (const [p, d, a, b] of [[pu, du, u0, u1], [pv, dv, v0, v1]] as const) {
    if (Math.abs(d) < 1e-9) {
      if (p < a || p > b) return null
      continue
    }
    const t0 = (a - p) / d
    const t1 = (b - p) / d
    lo = Math.max(lo, Math.min(t0, t1))
    hi = Math.min(hi, Math.max(t0, t1))
  }
  if (hi - lo < 0.5) return null
  return [[pu + du * lo, pv + dv * lo], [pu + du * hi, pv + dv * hi]]
}

function hatch(angle: number, gap: number) {
  const { u0, u1, v0, v1 } = PANEL
  const ends = [[u0, v0], [u1, v0], [u0, v1], [u1, v1]].map(([u, v]) => u! * Math.cos(angle) + v! * Math.sin(angle))
  const from = Math.ceil(Math.min(...ends) / gap) * gap
  const out: string[] = []
  for (let c = from; c < Math.max(...ends); c += gap) {
    const cut = chord(angle, c)
    if (cut) out.push(poly(cut, FRONT_S, false))
  }
  return out.join('')
}

const W = PANEL.u1 - PANEL.u0
const H = PANEL.v1 - PANEL.v0
const wobble = (i: number) => 0.5 + 0.5 * Math.sin(i * 2.3 + Math.cos(i * 0.7) * 1.9)

interface Texture {
  lines: string
  shapes: string
  filled?: boolean
  free?: string
  dots?: Flat[]
}

function textureOf(index: number): Texture {
  const { u0, u1, v0, v1 } = PANEL
  switch (index) {
    case 0: {
      // Analytics: a bar chart standing on its baseline, with faint grid rules.
      const base = v0 + 4
      const count = 10
      const step = W / count
      return {
        lines: join([base, base + 14, base + 28, base + 42].map((v) => poly([[u0, v], [u1, v]], FRONT_S, false))),
        shapes: join(Array.from({ length: count }, (_, i) => poly(rect(u0 + i * step + 2.2, base, u0 + (i + 1) * step - 2.2, base + 8 + wobble(i) * (H - 16)), FRONT_S))),
        filled: true,
      }
    }
    case 1:
      // Marketing: a fine 45° hatch, like printed copy seen from afar.
      return { lines: hatch(Math.PI / 4, 3.2), shapes: '' }
    case 2:
      // E-commerce: a product grid.
      return { lines: hatch(0, 6.6) + hatch(Math.PI / 2, 6.6), shapes: '' }
    case 3: {
      // CMS: a heading and columns of text rules.
      const free: string[] = []
      const shapes = [poly(rect(u0 + 4, v1 - 9, u0 + 46, v1 - 4), FRONT_S), poly(rect(u0 + 54, v1 - 9, u1 - 4, v1 - 4), FRONT_S)]
      for (const [c0, c1] of [[u0 + 4, u0 + W / 2 - 3], [u0 + W / 2 + 3, u1 - 4]]) {
        for (let v = v1 - 14, i = 0; v > v0 + 3; v -= 3.4, i++) free.push(poly([[c0!, v], [c0! + (c1! - c0!) * (0.55 + 0.45 * wobble(i + c0!)), v]], FRONT_S, false))
      }
      return { lines: '', shapes: join(shapes), free: join(free) }
    }
    case 4: {
      // JS library: a perforated dot field.
      const dots: Flat[] = []
      for (let v = v0 + 2.4; v < v1 - 1; v += 3.4) for (let u = u0 + 2.4; u < u1 - 1; u += 3.4) dots.push(onLid(u, v, FRONT_S))
      return { lines: '', shapes: '', dots }
    }
    case 5: {
      // JS framework: a honeycomb of components.
      const r = 3.6
      const shapes: string[] = []
      for (let row = 0, v = v0 + r + 0.8; v < v1 - r; row++, v += r * 1.5 + 0.6) {
        for (let u = u0 + r + 1 + (row % 2) * (r * 0.9 + 0.3); u < u1 - r; u += r * 1.8 + 0.6) {
          shapes.push(poly(Array.from({ length: 6 }, (_, i) => [u + r * Math.cos(Math.PI / 6 + (i * Math.PI) / 3), v + r * Math.sin(Math.PI / 6 + (i * Math.PI) / 3)] as UV), FRONT_S))
        }
      }
      return { lines: '', shapes: join(shapes) }
    }
    default: {
      // CDN: rack units, each with its row of vent slots.
      const units = 4
      const h = H / units
      const rules: string[] = []
      const slots: string[] = []
      for (let i = 1; i < units; i++) rules.push(poly([[u0, v0 + i * h], [u1, v0 + i * h]], FRONT_S, false))
      for (let i = 0; i < units; i++) {
        for (let u = u0 + 4; u < u1 - 18; u += 3) slots.push(rr({ x: u, y: v0 + i * h + 3, w: 1.4, d: h - 6, r: 0.7 }, FRONT_S, 2))
        slots.push(poly(circle(u1 - 8, v0 + i * h + h / 2, 1.6, 14), FRONT_S))
      }
      return { lines: join(rules), shapes: join(slots) }
    }
  }
}

const LABEL = (index: number): Plan => ({ x: PLATE.x + 9, y: PLATE.y + 3.2, w: 30 + (index % 3) * 4, d: 6.6, r: 0.8 })

export const PLATE_ART = Array.from({ length: LAYERS }, (_, index) => {
  const tab = roundEnds(tabX(index), tabX(index) + TAB_W, PLATE.y + PLATE.d, PLATE.y + PLATE.d + TAB_H, 1.4, true)
  const label = LABEL(index)
  const screws: UV[] = [[PLATE.x + 2.6, PLATE.y + 2.6], [PLATE.x + PLATE.w - 2.6, PLATE.y + 2.6], [PLATE.x + 2.6, PLATE.y + PLATE.d - 2.6], [PLATE.x + PLATE.w - 2.6, PLATE.y + PLATE.d - 2.6]]
  const pins = Array.from({ length: 10 }, (_, i) => PLATE.x + PLATE.w - 46 + i * 3.8)
  return {
    body: lidSlab(PLATE, GLASS_S, FRONT_S, 4),
    tab: lidSolid(tab, GLASS_S, FRONT_S),
    tabFace: poly(tab, FRONT_S),
    notches: Array.from({ length: index + 1 }, (_, i) => onLid(tabX(index) + TAB_W / 2 + (i - index / 2) * 1.5, PLATE.y + PLATE.d + TAB_H / 2, FRONT_S)),
    panel: poly(rect(PANEL.u0, PANEL.v0, PANEL.u1, PANEL.v1), FRONT_S),
    texture: textureOf(index),
    screwRings: join(screws.map(([u, v]) => poly(circle(u, v, 1.3, 16), FRONT_S))),
    screws: screws.map(([u, v]) => onLid(u, v, FRONT_S)),
    label: lidSlab(label, FRONT_S, FRONT_S + 0.5, 3),
    labelRules: join([0, 1].map((i) => poly([[label.x + 5, label.y + 4.4 - i * 2.2], [label.x + label.w - (i ? 11 : 6), label.y + 4.4 - i * 2.2]], FRONT_S + 0.5, false))),
    labelScrews: [onLid(label.x + 2.2, label.y + label.d / 2, FRONT_S + 0.5), onLid(label.x + label.w - 2.2, label.y + label.d / 2, FRONT_S + 0.5)],
    pins: join(pins.map((u) => poly(rect(u, PLATE.y, u + 2.2, PLATE.y + 4.2), FRONT_S))),
  }
})

// A soft shadow on the deck under each lifted plate: the plate's footprint at rest, moved
// with the plate along the floor only (live.tsx drops the height from its offset).
const footA = lid(PLATE.x, PLATE.y, PLATE_T / 2)
const footB = lid(PLATE.x, PLATE.y + PLATE.d, PLATE_T / 2)
export const PLATE_SHADOW = haloOf(
  { x: PLATE.x + 4, y: Math.min(footA[1], footB[1]), w: PLATE.w - 8, d: Math.abs(footA[1] - footB[1]), r: 6 },
  DECK + KEY_H,
  0.4,
  P,
)
