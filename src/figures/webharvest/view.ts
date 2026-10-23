import { boxCorners, fitProjection, iso, sideMatrix, type Plan, type Point3 } from '../../components/iso/iso-kit.ts'
import { SECTIONS, type Source } from './model.ts'

export const WIDTH = 640
export const HEIGHT = 440
export const AZIMUTH = 63

export const DESK: Plan = { x: -146, y: -96, w: 296, d: 180, r: 10 }
export const DESK_H = 9
export const FOOT_H = 5
export const MAT: Plan = { x: -124, y: 8, w: 236, d: 64, r: 6 }
export const MAT_H = 0.8

// Monitor: the case front faces +y, the glass sits in a shallow recess.
export const CASE = { x0: -126, x1: 126, y0: -40, y1: -30, z0: 46, z1: 196 }
export const FRONT = CASE.y1
export const GLASS = { x0: -120, x1: 120, z0: 56, z1: 190, r: 1.6, depth: 1.2 }
export const GLASS_Y = FRONT - GLASS.depth
export const BASE: Plan = { x: -44, y: -88, w: 88, d: 58, r: 12 }
export const BASE_H = 4
export const NECK_PLATE: Plan = { x: -15, y: -75, w: 30, d: 18, r: 3 }
export const COLUMN: Plan = { x: -10, y: -70, w: 20, d: 12, r: 3 }
export const CABLE_R = 1.3
export const CABLE_X = 4
export const CLIP_Z: [number, number] = [21, 26]

// Chrome on the glass, in the glass's own (x, z) coordinates.
export const TABS = { z0: 181.5, z1: GLASS.z1 }
export const BAR = { z0: 171.5, z1: TABS.z0 }
export const PAGE = { x0: GLASS.x0, x1: 15, z0: GLASS.z0, z1: BAR.z0 }
export const SCROLL = { x0: 15.7, x1: 18.9 }
export const PANEL = { x0: 19.9, x1: GLASS.x1, z0: GLASS.z0, z1: BAR.z0 }
export const PAD = 4
const INNER = { x0: PANEL.x0 + PAD, x1: PANEL.x1 - PAD }
export const PANEL_INNER = INNER
export const BUTTON = { x0: INNER.x0, x1: INNER.x1, z0: 133.5, z1: 143.5, r: 2 }
export const PROGRESS = { x0: INNER.x0, x1: INNER.x1, z0: 130.4, z1: 131.4 }
const GAP = 3
const TILE_W = (INNER.x1 - INNER.x0 - GAP) / 2
export const TILES = SECTIONS.map((_, index) => {
  const x0 = INNER.x0 + (index % 2) * (TILE_W + GAP)
  const z1 = 126.5 - Math.floor(index / 2) * 13
  return { x0, x1: x0 + TILE_W, z0: z1 - 11, z1, r: 1.6 }
})
export const ROWS = [86.4, 80]
const EXPORT_W = (INNER.x1 - INNER.x0 - GAP * 2) / 3
export const EXPORTS = [0, 1, 2].map((col) => {
  const x0 = INNER.x0 + col * (EXPORT_W + GAP)
  return { x0, x1: x0 + EXPORT_W, z0: 60.5, z1: 70.5, r: 1.6 }
})

// Product cards on the page: three columns, two rows.
const CARD_X0 = PAGE.x0 + 6
const CARD_GAP = 4
export const CARD_W = (PAGE.x1 - 4 - CARD_X0 - CARD_GAP * 2) / 3
export const CARDS = [0, 1, 2, 3, 4, 5].map((index) => {
  const x0 = CARD_X0 + (index % 3) * (CARD_W + CARD_GAP)
  const z1 = index < 3 ? 148 : 120.5
  return { x0, x1: x0 + CARD_W, z0: z1 - 25, z1, r: 1.2 }
})
export const TABLE = { x0: PAGE.x0 + 6, x1: -62, z0: 73, z1: 91 }
export const FOOTER = { z0: GLASS.z0, z1: 68.5 }

// Where each kind of token lifts out of the page (glass x, z).
const card = (index: number, part: 'image' | 'price') => {
  const c = CARDS[index]!
  return part === 'image' ? [(c.x0 + c.x1) / 2, c.z1 - 7.5] : [c.x0 + 9, c.z0 + 4.4]
}
export const SOURCES: Record<Source, [number, number]> = {
  tab: [-100, 185],
  head: [-104, 167],
  nav: [-52, 167],
  card0: card(0, 'price') as [number, number],
  card1: card(1, 'image') as [number, number],
  card2: card(2, 'price') as [number, number],
  card3: card(3, 'image') as [number, number],
  card4: card(4, 'image') as [number, number],
  card5: card(5, 'price') as [number, number],
  table: [(TABLE.x0 + TABLE.x1) / 2, (TABLE.z0 + TABLE.z1) / 2],
  footer: [-96, 62],
  mail: [-28, 64.6],
  phone: [-28, 61.2],
}

// The export tray on the desk under the panel, and where each file card comes to rest in it.
export const TRAY: Plan = { x: 54, y: -26, w: 56, d: 28, r: 1.6 }
export const TRAY_FLOOR: [number, number] = [1, 2.4]
export const TRAY_WALL = 1.4
export const TRAY_BACK_H = 11
export const TRAY_FRONT_H = 5
export const FILE_REST: Point3[] = [0, 1, 2].map((index) => [TRAY.x + 12 + index * 16, TRAY.y + TRAY.d / 2 - 1, TRAY_FLOOR[1]])

export const KB: Plan = { x: -116, y: 14, w: 138, d: 52, r: 4 }
export const KB_Z = 1.6 + MAT_H
export const KB_TOP = KB_Z + 6.6
export const U = 8.6

export const MOUSE = { x: 82, y: 42, a: 11.5, b: 6.8, sink: 1.3 }

export const P = fitProjection(
  [...boxCorners(DESK, -DESK_H - FOOT_H, 0), ...boxCorners({ x: CASE.x0, y: CASE.y0, w: CASE.x1 - CASE.x0, d: CASE.y1 - CASE.y0, r: 0 }, CASE.z0, CASE.z1)],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: AZIMUTH },
)

export const at = (point: Point3) => iso(point, P)

// Local (x, -z) on a face whose normal is +y.
export const onFaceY = (y: number) => sideMatrix([0, y], 0, P, 'left')
export const onFaceX = (x: number) => sideMatrix([x, 0], 0, P, 'right')
