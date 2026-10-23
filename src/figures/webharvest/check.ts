// Self-check of the scan timeline and the moving parts: node src/figures/webharvest/check.ts
import { BATCHES, DONE, FILES, SCAN_END, SECTIONS, TOTAL, scanAt } from './model.ts'
import { CARD_CORNERS, tokenAt } from './frame.ts'
import { TOKEN_HALF } from './geometry.ts'
import { CASE, FRONT, GLASS, GLASS_Y, TRAY, TRAY_FLOOR } from './view.ts'

const fail = (message: string) => {
  throw new Error(`check failed: ${message}`)
}

let last = scanAt(0).counts
for (let t = 0; t <= SCAN_END; t += 0.01) {
  const pose = scanAt(t)
  pose.counts.forEach((count, index) => {
    if (count < last[index]!) fail(`${SECTIONS[index]!.name} count falls at ${t.toFixed(2)}`)
  })
  last = pose.counts
}
DONE.counts.forEach((count, index) => {
  if (count !== SECTIONS[index]!.count) fail(`${SECTIONS[index]!.name} ends at ${count}`)
})
if (DONE.done !== TOTAL) fail(`total ${DONE.done}`)

// Tokens leave and land on the glass and never go behind it or outside the screen's width.
BATCHES.forEach((_, index) => {
  for (let u = 0; u <= 1; u += 0.01) {
    const [x, y, z] = tokenAt(index, u).at
    if (y < GLASS_Y - 1e-6) fail(`token ${index} behind the glass at u ${u.toFixed(2)}`)
    if (x < GLASS.x0 || x > GLASS.x1 || z < GLASS.z0 || z > GLASS.z1 + 12) fail(`token ${index} strays at u ${u.toFixed(2)}`)
  }
  // While it still sits in the recess, the whole token must lie inside the glass, clear of the bezel.
  const [x, , z] = tokenAt(index, 0).at
  const half = TOKEN_HALF[SECTIONS[BATCHES[index]![0]]!.kind]
  if (x - half[0] < GLASS.x0 || x + half[0] > GLASS.x1 || z - half[1] < GLASS.z0 || z + half[1] > GLASS.z1) fail(`token ${index} starts in the bezel`)
})

// File cards: never inside the monitor case below the glass, and inside the tray once below its rim.
FILES.forEach((_, file) => {
  for (let u = 0; u <= 1; u += 0.005) {
    for (const [x, y, z] of CARD_CORNERS(file, u)) {
      const inCase = x > CASE.x0 && x < CASE.x1 && y < FRONT && z > CASE.z0 && z < GLASS.z0
      if (inCase) fail(`file ${file} enters the monitor chin at u ${u.toFixed(3)}`)
      const low = z < TRAY_FLOOR[1] + 5
      if (low && (x < TRAY.x + 1.4 || x > TRAY.x + TRAY.w - 1.4 || y < TRAY.y + 1.4 || y > TRAY.y + TRAY.d - 1.4)) fail(`file ${file} meets a tray wall at u ${u.toFixed(3)}`)
      if (z < TRAY_FLOOR[1] - 1e-6) fail(`file ${file} sinks into the tray floor at u ${u.toFixed(3)}`)
    }
  }
})

console.log(`check passed · ${BATCHES.length} tokens · ${TOTAL} items · scan ${SCAN_END.toFixed(2)} s`)
