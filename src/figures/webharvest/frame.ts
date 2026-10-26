import { pathOf, translateAlong, type Plane, type Point3, type SolidPaths } from '../../components/iso/iso-kit.ts'
import * as G from '../../components/iso/lathe.mjs'
import { BATCHES } from './model.ts'
import { onFrame, type Frame3 } from './geometry.ts'
import { EXPORTS, FILE_REST, GLASS_Y, P, SOURCES, TILES, at } from './view.ts'

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) ** 2)
const smooth = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return u * u * (3 - 2 * u)
}

// A token lifts straight out of the page, arcs in front of the glass and settles onto its tile.
export const OUT = 30
const LIFT = 10

export const tileCentre = (section: number): Point3 => {
  const tile = TILES[section]!
  return [(tile.x0 + tile.x1) / 2, GLASS_Y, (tile.z0 + tile.z1) / 2]
}

export function tokenAt(index: number, u: number): { at: Point3; alpha: number } {
  const [section, , source] = BATCHES[index]!
  const [sx, sz] = SOURCES[source]
  const target = tileCentre(section)
  if (u >= 1) return { at: target, alpha: Math.max(0, 1 - (u - 1)) }
  const e = ease(u)
  const bulge = Math.sin(Math.PI * u)
  return {
    at: [sx + (target[0] - sx) * e, GLASS_Y + OUT * bulge, sz + (target[2] - sz) * e + LIFT * bulge],
    alpha: Math.min(1, u / 0.08),
  }
}

export const place = (point: Point3) => translateAlong(P, point)

/* ---------- file cards: out of the export buttons, tipping over into the tray ---------- */

export const CARD_T = 1
const OUTLINE: Plane[] = [
  [-5, -6.5],
  [2, -6.5],
  [5, -3.5],
  [5, 6.5],
  [-5, 6.5],
]
const brace = (side: number): Plane[] =>
  [
    [-1.2, -2.4],
    [-2.2, -1.9],
    [-2.2, 0.3],
    [-3.2, 1],
    [-2.2, 1.7],
    [-2.2, 3.9],
    [-1.2, 4.4],
  ].map(([u, v]) => [u! * side, v!] as Plane)
const GLYPHS: { closed: Plane[][]; open: Plane[][]; free: Plane[][] }[] = [
  {
    closed: [
      [
        [-3.2, -2],
        [3.2, -2],
        [3.2, 4.4],
        [-3.2, 4.4],
      ],
    ],
    open: [
      [[-1.07, -2], [-1.07, 4.4]],
      [[1.07, -2], [1.07, 4.4]],
      [[-3.2, 0.13], [3.2, 0.13]],
      [[-3.2, 2.27], [3.2, 2.27]],
    ],
    free: [],
  },
  { closed: [], open: [], free: [brace(1), brace(-1)] },
  {
    closed: [],
    open: [],
    free: [
      [[-3.2, -1.8], [3.2, -1.8]],
      [[-3.2, 0.2], [3.2, 0.2]],
      [[-3.2, 2.2], [2.2, 2.2]],
      [[-3.2, 4.2], [0.6, 4.2]],
    ],
  },
]
const FOLD: Plane[] = [
  [2, -6.5],
  [2, -3.5],
  [5, -3.5],
]
const HEAD: Plane[] = [
  [-3.2, -4.6],
  [0, -4.6],
]

export interface CardPaths {
  paths: SolidPaths
  lines: string
  free: string
}

export function cardFrame(file: number, u: number): Frame3 {
  const button = EXPORTS[file]!
  const from: Point3 = [(button.x0 + button.x1) / 2, GLASS_Y, (button.z0 + button.z1) / 2]
  const rest = FILE_REST[file]!
  const tilt = (Math.PI / 2) * smooth(0.12, 0.78, u)
  const forward = 1 - (1 - Math.min(1, u / 0.7)) ** 2
  const o: Point3 = [
    from[0] + (rest[0] - from[0]) * ease(u),
    from[1] + (rest[1] - from[1]) * forward,
    from[2] + (rest[2] - from[2]) * u * u + 7 * Math.sin(Math.PI * Math.min(1, u * 1.4)),
  ]
  const c = Math.cos(tilt)
  const s = Math.sin(tilt)
  return { o, a: [0, c, s], u: [1, 0, 0], v: [0, s, -c] }
}

export function cardOf(file: number, u: number): CardPaths {
  const F = cardFrame(file, u)
  const line = (points: Plane[], closed = false) => pathOf(points.map((point) => at(onFrame(F, CARD_T, point))), closed)
  const glyph = GLYPHS[file]!
  return {
    paths: G.prismOf(F, OUTLINE, 0, CARD_T, P) as SolidPaths,
    lines: [...glyph.closed.map((points) => line(points, true)), ...glyph.open.map((points) => line(points)), line(FOLD)].join(''),
    free: [...glyph.free.map((points) => line(points)), line(HEAD)].join(''),
  }
}

export const CARD_CORNERS = (file: number, u: number) => {
  const F = cardFrame(file, u)
  return [0, CARD_T].flatMap((s) => OUTLINE.map((point) => onFrame(F, s, point)))
}
