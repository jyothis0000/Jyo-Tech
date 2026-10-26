// WebHarvest 0.3.0 on a desk monitor: Chrome with the side panel open, one scan of a sample shop page.
// Facts: README.md, src/panel/index.html (header, Data/Design tabs, Scan page, tally tiles, CSV/JSON/Word
// footer), src/panel/panel.js (SECTIONS order and labels), src/panel/parse.js (product sources).
//
// Parts (Figure, ~85 kinds; repeated parts counted once):
//  desk      plate, 4 feet (flange + foot), groove, corner screws + rings, desk mat + stitch
//  stand     base plate + groove, neck plate + screws, column, cable clip, monitor cable (tube) over the desk edge
//  monitor   case with bevel, top vent slots, glass recess walls, chin logo, power LED, 4 side keys + power key
//  chrome    tab strip: 2 tabs, favicon, close marks, new-tab mark, window controls; toolbar: back, forward,
//            reload, address bar, lock, star, puzzle, WebHarvest icon (lit), avatar, menu dots
//  page      header: logo, 4 nav links, cart; heading; 6 product cards (image + glyph, title, price, cart
//            button); table; paragraph; footer: link columns, mail + phone lines; scrollbar
//  panel     divider, leaf mark + name, close, Data/Design tabs, title lines, Scan page button + icon,
//            progress bar, 6 count tiles, 3 result rows, CSV/JSON/Word buttons
//  keyboard  base, feet, key well, 61 keys with dishes
//  mouse     shell, button seams, wheel slot + wheel
//  tray      feet, floor, back wall, two sloped side walls, front wall, label holder + rules, rivets
//  moving    tokens: price tag, framed tile, chain link, gridded tile, card, label (14); file cards CSV, JSON, Word

export type Kind = 'tag' | 'frame' | 'link' | 'grid' | 'card' | 'label'

export interface Section {
  name: string
  count: number
  note: string
  kind: Kind
}

const INTERNAL_LINKS = 71

export const SECTIONS: Section[] = [
  { name: 'Products', count: 20, note: 'from JSON-LD', kind: 'tag' },
  { name: 'Images', count: 24, note: 'img, CSS, og:image', kind: 'frame' },
  { name: 'Links', count: 96, note: `${INTERNAL_LINKS} internal`, kind: 'link' },
  { name: 'Tables', count: 1, note: 'copy or CSV', kind: 'grid' },
  { name: 'Contacts', count: 3, note: '2 emails, 1 phone', kind: 'card' },
  { name: 'SEO & meta', count: 18, note: 'title, OG, robots', kind: 'label' },
]

export const TOTAL = SECTIONS.reduce((sum, section) => sum + section.count, 0)
export const FILES = ['CSV', 'JSON', 'Word']

// Batches in page order, head to footer: [section, items, where on the page it lifts from].
// Each batch flies to its tile as one token; the tiles count the items.
export type Source = 'tab' | 'head' | 'nav' | 'card0' | 'card1' | 'card2' | 'card3' | 'card4' | 'card5' | 'table' | 'footer' | 'mail' | 'phone'
export const BATCHES: [number, number, Source][] = [
  [5, 9, 'tab'],
  [5, 9, 'head'],
  [0, 7, 'card0'],
  [1, 8, 'card1'],
  [2, 32, 'nav'],
  [0, 7, 'card2'],
  [1, 8, 'card3'],
  [2, 32, 'card4'],
  [0, 6, 'card5'],
  [1, 8, 'card4'],
  [2, 32, 'footer'],
  [3, 1, 'table'],
  [4, 2, 'mail'],
  [4, 1, 'phone'],
]

// Timeline of one scan, in seconds.
const FIRST = 0.55
const GAP = 0.4
export const FLIGHT = 1.25
const SETTLE = 0.3
const FILE_GAP = 0.32
export const FILE_FLIGHT = 1.05
export const LAUNCH = BATCHES.map((_, index) => FIRST + index * GAP)
export const LAND = LAUNCH.map((t) => t + FLIGHT)
const HARVESTED = LAND[LAND.length - 1]! + 0.25
export const FILE_LAUNCH = FILES.map((_, index) => HARVESTED + 0.25 + index * FILE_GAP)
export const SCAN_END = FILE_LAUNCH[FILE_LAUNCH.length - 1]! + FILE_FLIGHT + 0.3

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export interface ScanPose {
  // Flight share per token: < 0 waiting, 0..1 in flight, then 1 + settle share until it has sunk in.
  tokens: number[]
  files: number[]
  counts: number[]
  done: number
  progress: number
  lit: number
  source: Source | null
  finished: boolean
}

export function scanAt(t: number): ScanPose {
  const counts = SECTIONS.map(() => 0)
  let lit = -1
  const tokens = BATCHES.map(([section, items], index) => {
    if (t >= LAND[index]!) counts[section]! += items
    if (t >= LAUNCH[index]! && t < LAND[index]!) lit = index
    if (t < LAUNCH[index]!) return -1
    if (t < LAND[index]!) return (t - LAUNCH[index]!) / FLIGHT
    return 1 + clamp((t - LAND[index]!) / SETTLE)
  })
  const launching = BATCHES.findIndex((_, index) => t >= LAUNCH[index]! - 0.12 && t < LAUNCH[index]! + 0.4)
  return {
    tokens,
    files: FILE_LAUNCH.map((start) => (t < start ? -1 : clamp((t - start) / FILE_FLIGHT))),
    counts,
    done: counts.reduce((sum, count) => sum + count, 0),
    progress: clamp(t / HARVESTED),
    lit,
    source: launching >= 0 ? BATCHES[launching]![2] : null,
    finished: t >= SCAN_END,
  }
}

export const DONE = scanAt(SCAN_END)

export const RESTING = `Harvested · ${TOTAL} items · ${SECTIONS.length} sections`
export const sectionText = (index: number, landed = SECTIONS[index]!.count) => {
  const section = SECTIONS[index]!
  return landed < section.count ? `${section.name} ${landed} of ${section.count}` : `${section.name} ${section.count} · ${section.note}`
}
// Takes the items the tiles show, so the readout never runs ahead of the counters.
export const readoutOf = (done: number) => (done >= TOTAL ? RESTING : `Scanning · ${done} of ${TOTAL} items`)
export const spokenOf = (pose: ScanPose, selected: number) => {
  if (selected >= 0) {
    const section = SECTIONS[selected]!
    const landed = pose.counts[selected]!
    return landed < section.count ? `${section.name}: ${landed} of ${section.count} so far` : `${section.name}: ${section.count}, ${section.note}`
  }
  return pose.done === TOTAL ? `Harvested ${TOTAL} items in ${SECTIONS.length} sections, ready to export as CSV, JSON or Word` : 'Scanning the page'
}
