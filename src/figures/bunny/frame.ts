import type { Point3, SolidPaths } from '../../components/iso/iso-kit.ts'
import * as G from '../../components/iso/lathe.mjs'
import { PIVOT_Z, TOGGLE_X, TOGGLE_Y } from './geometry.ts'
import { P } from './view.ts'

const LEVER = 9.5
const TILT = (26 * Math.PI) / 180

// A bat-handle toggle: on leans away from the reader, off leans toward them. Rebuilt per frame
// only while it flips (a turned rod and a ball cost well under a millisecond).
export function leverOf(index: number, on: number) {
  const angle = (1 - 2 * on) * TILT
  const dir: Point3 = [0, Math.sin(angle), Math.cos(angle)]
  const pivot: Point3 = [TOGGLE_X[index]!, TOGGLE_Y, PIVOT_Z - 0.5]
  const rod = G.solidOf([[0, 1.1], [LEVER, 0.8]], G.frameAlong(pivot, dir), P) as SolidPaths
  const ball = G.sphereOf(G.add3(pivot, G.mul3(dir, LEVER + 1)), 1.65, P) as SolidPaths
  return { rod, ball }
}
