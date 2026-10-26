// StackPicker 1.1.0 on a laptop running Chrome. Every name and number comes from the
// extension's own source: src/detect.js (the seven kinds of evidence), src/popup/main.js
// (the popup groups results by category, in CATEGORY_ORDER) and src/technologies/*.json
// (3,599 fingerprints; each layer below is a real entry with a real rule of that kind).
//
// Parts (about 120, grouped as built):
// desk     mat + halo + stitch line
// base     4 rubber feet, bottom case + top case seam, bevelled deck, thumb notch, status LED,
//          keyboard well, 78 keys in 6 rows, 2 speaker grilles, trackpad (edge, inner rim),
//          side ports (2 USB-C, USB-A with its tongue, audio jack), vent slots, hinge spine
//          (barrel, 2 hinge knuckles, 4 screws)
// lid      shell, bezel, screen recess walls, glass, webcam + lens ring, 4 bumper pads
// chrome   tab strip, tab (favicon, title rule, close cross), new-tab cross, 3 window buttons,
//          toolbar, back/forward/reload, address pill (lock, URL rule, star), puzzle icon,
//          StackPicker icon (the coloured part), profile disc, menu dots
// page     header (logo, nav rules), hero (heading rules, button, picture with sun and hills),
//          3 product cards (image, rules, price, button), footer (column rules)
// popup    shadow, panel, brand mark, name, count badge, divider, 7 rows (category, name)
// plates   7 × (halo, body, index tab with notches, texture panel with its own texture,
//          4 corner screws with rings, label plate with rules and 2 screws)

export interface Layer {
  name: string
  category: string
  evidence: string
  found: string
}

// Front of the fan (top of the stack) to the back (the wire): a WordPress shop,
// one layer per kind of evidence.
export const STACK: Layer[] = [
  { name: 'Google Analytics', category: 'Analytics', evidence: '_ga cookie', found: 'its _ga cookie' },
  { name: 'Yoast SEO', category: 'Marketing', evidence: 'page HTML', found: 'its comment in the page HTML' },
  { name: 'WooCommerce', category: 'E-Commerce', evidence: 'script URL', found: 'a /plugins/woocommerce/ script URL' },
  { name: 'WordPress', category: 'CMS', evidence: 'meta tag', found: 'its generator meta tag' },
  { name: 'jQuery', category: 'JS Library', evidence: 'JS global', found: 'the window.jQuery global' },
  { name: 'React', category: 'JS Framework', evidence: 'DOM property', found: 'a __reactFiber DOM property' },
  { name: 'Cloudflare', category: 'CDN', evidence: 'cf-ray header', found: 'the cf-ray response header' },
]

export const LAYERS = STACK.length
export const FINGERPRINTS = 3599
const COUNT = FINGERPRINTS.toLocaleString('en-US')

// The popup lists categories in the extension's CATEGORY_ORDER, not in stack order.
const CATEGORY_ORDER = ['CMS', 'E-Commerce', 'Website Builder', 'JS Framework', 'JS Library', 'UI / CSS', 'Backend Framework', 'Backend Language', 'Web Server', 'Hosting', 'CDN', 'Analytics', 'Advertising', 'Marketing']
export const ROWS = STACK.map((_, index) => index).sort((a, b) => CATEGORY_ORDER.indexOf(STACK[a]!.category) - CATEGORY_ORDER.indexOf(STACK[b]!.category))

export const REST_TEXT = `${COUNT} fingerprints · in browser`
export const OPEN_TEXT = `${LAYERS} layers · ${COUNT} fingerprints`
export const layerText = (index: number) => `${index + 1}/${LAYERS} ${STACK[index]!.name} · ${STACK[index]!.evidence}`

// One value opens everything: the popup appears first, then the plates lift, front plate
// (top of the stack) first. Each plate's share is a monotone function of `open`, and a
// plate nearer the front always has the larger share, so the plates never cross.
export const SPREAD = 0.9
const smooth = (t: number) => {
  const u = Math.min(1, Math.max(0, t))
  return u * u * (3 - 2 * u)
}
export const shareOf = (open: number, index: number) => smooth((open - 0.12) * (1 + SPREAD) / 0.88 - (SPREAD * index) / (LAYERS - 1))
export const popupOf = (open: number) => smooth(open / 0.12)

export function readoutOf(open: number, opening: boolean, lit: number) {
  if (open < 0.004) return REST_TEXT
  // A plate counts as up once it is past halfway, which is how it reads on screen.
  const up = STACK.filter((_, index) => shareOf(open, index) > 0.5).length
  if (open > 0.996 || (opening && shareOf(open, LAYERS - 1) > 0.98)) return lit < 0 ? OPEN_TEXT : layerText(lit)
  return opening ? `picking apart · ${up}/${LAYERS} layers` : `settling back · ${up}/${LAYERS} up`
}

export function spokenOf(open: boolean, index: number) {
  if (!open) return `Chrome with a shop page open. ${COUNT} fingerprints wait inside the extension.`
  if (index < 0) return `The page picked apart into ${LAYERS} layers.`
  const { name, category, found } = STACK[index]!
  return `Layer ${index + 1} of ${LAYERS}, ${category}: ${name}, found by ${found}.`
}

// Idle tour, in seconds: click the icon, let the layers rise, read each for 1.2 s,
// let them settle back, rest, loop.
export const TOUR_CLICK = 1
export const TOUR_READ = 3.4
export const TOUR_DWELL = 1.2
const TOUR_CLOSE = TOUR_READ + LAYERS * TOUR_DWELL + 0.5
export const TOUR = TOUR_CLOSE + 3.2

export function tourAt(t: number) {
  const at = t % TOUR
  const step = Math.floor((at - TOUR_READ) / TOUR_DWELL)
  return {
    open: at >= TOUR_CLICK && at < TOUR_CLOSE,
    lit: at >= TOUR_READ && step < LAYERS ? step : -1,
    press: at >= TOUR_CLICK && at < TOUR_CLICK + 0.25,
  }
}
