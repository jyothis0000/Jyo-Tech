import * as React from 'react'
import { IsoFigure, Line, Solid } from '../../components/iso/react/draw.tsx'
import { asksForStillness, follow, useInView, useLoop, useReadout } from '../../components/iso/react/live.tsx'
import type { SolidPaths } from '../../components/iso/iso-kit.ts'
import { BATCHES, DONE, LAND, SCAN_END, SECTIONS, readoutOf, scanAt, sectionText, spokenOf, type ScanPose } from './model.ts'
import { PANEL_ART, TILE_HULLS, TOKENS, type TokenArt } from './geometry.ts'
import { cardOf, place, tokenAt, type CardPaths } from './frame.ts'
import { HEIGHT, WIDTH } from './view.ts'

const TOUR_FIRST = 1400
const TOUR_BACK = 3600
const DWELL = 1.5
const TOUR_LOOP = SCAN_END + SECTIONS.length * DWELL + 1.6
const COUNT_EASE = 0.22
const CLEAR = 0.4

interface CardNodes {
  group: SVGGElement | null
  fill: SVGPathElement | null
  shades: (SVGPathElement | null)[]
  top: SVGPathElement | null
  crease: SVGPathElement | null
  edge: SVGPathElement | null
  lines: SVGPathElement | null
  free: SVGPathElement | null
  u: number
  alpha: number
}

interface TokenNodes {
  node: SVGGElement | null
  at: string
  alpha: number
  lit: boolean
}

interface Screen {
  counts: Element[]
  tiles: Element[]
  exports: Element[]
  sources: Map<string, Element>
  progress: SVGPathElement | null
  button: Element | null
  label: Element | null
}

interface State {
  t: number
  scanning: boolean
  touring: boolean
  tour: number
  selected: number
  shown: number[]
  clear: number
  bar: number
  spoken: string
  source: string | null
}

const inside = ([x, y]: [number, number], hull: [number, number][]) => {
  let hit = false
  for (let a = 0, b = hull.length - 1; a < hull.length; b = a++) {
    const [ax, ay] = hull[a]!
    const [bx, by] = hull[b]!
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) hit = !hit
  }
  return hit
}

const flag = (node: Element | null | undefined, name: string, on: boolean) => {
  if (!node || node.hasAttribute(name) === on) return
  if (on) node.setAttribute(name, '')
  else node.removeAttribute(name)
}

function TokenBody({ art }: { art: TokenArt }) {
  return (
    <Solid paths={art.paths} tone="hi" crease="lo">
      {art.voids ? <path className="wh-void" d={art.voids} /> : null}
      <Line d={art.closed} tone="mid" />
      <Line d={art.open} tone="mid" />
      <Line d={art.free} tone="mid" free />
    </Solid>
  )
}

const REST_CARDS = [0, 1, 2].map((file) => cardOf(file, 1))
const PROGRESS_X = PANEL_ART.progressFrom

function writeCard(nodes: CardNodes, card: CardPaths) {
  const paths: SolidPaths = card.paths
  nodes.fill?.setAttribute('d', paths.fill)
  paths.shades.forEach((d, index) => nodes.shades[index]?.setAttribute('d', d))
  nodes.top?.setAttribute('d', paths.top)
  nodes.crease?.setAttribute('d', paths.crease)
  nodes.edge?.setAttribute('d', paths.outline)
  nodes.lines?.setAttribute('d', card.lines)
  nodes.free?.setAttribute('d', card.free)
}

interface Props {
  label: string
  defs: React.ReactNode
  cableBack: React.ReactNode
  desk: React.ReactNode
  stand: React.ReactNode
  monitor: React.ReactNode
  trayBack: React.ReactNode
  trayFront: React.ReactNode
  keyboard: React.ReactNode
  mouse: React.ReactNode
}

export function HarvestLive(props: Props) {
  const { anchor: root, say } = useReadout<HTMLDivElement>()
  const status = React.useRef<HTMLSpanElement | null>(null)
  const screen = React.useRef<Screen | null>(null)
  const tokens = React.useRef<TokenNodes[]>(BATCHES.map(() => ({ node: null, at: '', alpha: 0, lit: false })))
  const cards = React.useRef<CardNodes[]>(
    [0, 1, 2].map(() => ({ group: null, fill: null, shades: [null, null, null, null], top: null, crease: null, edge: null, lines: null, free: null, u: 1, alpha: 1 })),
  )
  const state = React.useRef<State>({
    t: SCAN_END,
    scanning: false,
    touring: false,
    tour: 0,
    selected: -1,
    shown: DONE.counts.slice(),
    clear: 0,
    bar: 0,
    spoken: spokenOf(DONE, -1),
    source: null,
  })
  const [hovering, setHovering] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [idle, setIdle] = React.useState(true)
  const quiet = React.useRef(0)
  const visible = useInView(root)

  React.useEffect(() => {
    const node = root.current
    if (!node) return
    const all = (selector: string) => [...node.querySelectorAll(selector)]
    screen.current = {
      counts: all('[data-count]'),
      tiles: all('[data-tile]'),
      exports: all('[data-export]'),
      sources: new Map(all('[data-src]').map((element) => [element.getAttribute('data-src')!, element])),
      progress: node.querySelector<SVGPathElement>('[data-part="progress"]'),
      button: node.querySelector('[data-part="button"]'),
      label: node.querySelector('[data-part="button-text"]'),
    }
  }, [root])

  const announce = React.useCallback(
    (pose: ScanPose) => {
      const s = state.current
      const spoken = spokenOf(pose, s.selected)
      if (spoken === s.spoken) return
      s.spoken = spoken
      if (status.current && document.activeElement === root.current) status.current.textContent = spoken
    },
    [root],
  )

  const draw = React.useCallback(
    (pose: ScanPose) => {
      const s = state.current
      const view = screen.current
      pose.tokens.forEach((u, index) => {
        const nodes = tokens.current[index]!
        const shown = u >= 0 && u < 2
        const { at, alpha } = shown ? tokenAt(index, u) : { at: null, alpha: 0 }
        const where = at ? place(at) : nodes.at
        if (where !== nodes.at) {
          nodes.node?.setAttribute('transform', where)
          nodes.at = where
        }
        const level = Math.round(alpha * 100) / 100
        if (level !== nodes.alpha && nodes.node) {
          nodes.node.style.display = level > 0 ? '' : 'none'
          nodes.node.style.opacity = level < 1 ? `${level}` : ''
          nodes.alpha = level
        }
        const lit = index === pose.lit
        if (lit !== nodes.lit) {
          flag(nodes.node, 'data-lit', lit)
          nodes.lit = lit
        }
      })
      pose.files.forEach((u, file) => {
        const nodes = cards.current[file]!
        const target = u < 0 ? 1 : u
        const alpha = u < 0 ? s.clear : Math.min(1, u / 0.06)
        if (target !== nodes.u) {
          writeCard(nodes, target >= 1 ? REST_CARDS[file]! : cardOf(file, target))
          nodes.u = target
        }
        const level = Math.round(alpha * 100) / 100
        if (level !== nodes.alpha && nodes.group) {
          nodes.group.style.display = level > 0 ? '' : 'none'
          nodes.group.style.opacity = level < 1 ? `${level}` : ''
          nodes.alpha = level
        }
      })
      if (view) {
        s.shown.forEach((value, index) => {
          const text = `${Math.round(value)}`
          const node = view.counts[index]
          if (node && node.textContent !== text) node.textContent = text
        })
        view.tiles.forEach((tile, index) => {
          flag(tile, 'data-on', index === s.selected)
          const landed = BATCHES.some(([section], batch) => section === index && s.t >= LAND[batch]! && s.t < LAND[batch]! + 0.45)
          flag(tile, 'data-hit', landed && s.scanning)
        })
        view.exports.forEach((button, index) => {
          const u = pose.files[index]!
          flag(button, 'data-on', u >= 0 && u < 0.35)
        })
        if (pose.source !== s.source) {
          if (s.source) flag(view.sources.get(s.source), 'data-on', false)
          if (pose.source) flag(view.sources.get(pose.source), 'data-on', true)
          s.source = pose.source
        }
        if (view.progress) {
          view.progress.setAttribute('opacity', `${Math.round(s.bar * 100) / 100}`)
          view.progress.setAttribute('transform', `translate(${PROGRESS_X} 0) scale(${Math.max(0.001, pose.progress).toFixed(3)} 1) translate(${-PROGRESS_X} 0)`)
        }
        flag(view.button, 'data-on', s.scanning)
        const label = s.scanning ? 'Scanning…' : 'Scan page'
        if (view.label && view.label.textContent !== label) view.label.textContent = label
      }
      const onTiles = s.shown.map(Math.round)
      say(s.selected >= 0 ? sectionText(s.selected, onTiles[s.selected]) : readoutOf(onTiles.reduce((sum, count) => sum + count, 0)))
      announce(pose)
    },
    [announce, say],
  )

  const select = React.useCallback((index: number) => {
    state.current.selected = index
  }, [])

  const tick = React.useCallback(
    (dt: number, calm: boolean) => {
      const s = state.current
      if (s.touring) {
        s.tour = (s.tour + dt) % TOUR_LOOP
        if (s.tour < SCAN_END) {
          if (!s.scanning && s.t >= SCAN_END && s.tour < 0.2) {
            s.t = 0
            s.scanning = true
            s.clear = 1
          }
          select(-1)
        } else {
          const step = Math.floor((s.tour - SCAN_END) / DWELL)
          select(step < SECTIONS.length ? step : -1)
        }
      }
      if (s.scanning) {
        s.t = calm ? SCAN_END : Math.min(SCAN_END, s.t + dt)
        if (s.t >= SCAN_END) s.scanning = false
      }
      const pose = scanAt(s.t)
      s.clear = calm ? 0 : Math.max(0, s.clear - dt / CLEAR)
      s.bar = follow(s.bar, s.scanning ? 1 : 0, dt, 0.25, calm)
      let moving = s.bar !== (s.scanning ? 1 : 0)
      s.shown = s.shown.map((value, index) => {
        const next = follow(value, pose.counts[index]!, dt, COUNT_EASE, calm)
        if (next !== pose.counts[index]) moving = true
        return next
      })
      draw(pose)
      return s.touring || s.scanning || moving || s.clear > 0
    },
    [draw, select],
  )

  const kick = useLoop(tick, visible)

  const scan = React.useCallback(() => {
    const s = state.current
    if (s.scanning) return
    const calm = asksForStillness()
    s.t = calm ? SCAN_END : 0
    s.scanning = !calm
    s.clear = s.scanning ? 1 : 0
    select(-1)
    kick()
  }, [kick, select])

  const engaged = hovering || focused

  const rest = React.useCallback(() => {
    window.clearTimeout(quiet.current)
    quiet.current = window.setTimeout(() => setIdle(true), TOUR_BACK)
  }, [])

  React.useEffect(() => () => window.clearTimeout(quiet.current), [])

  const touring = visible && idle && !engaged

  React.useEffect(() => {
    const s = state.current
    if (!touring || asksForStillness()) {
      s.touring = false
      return
    }
    const timer = window.setTimeout(() => {
      s.tour = s.scanning ? s.t : 0
      s.touring = true
      kick()
    }, TOUR_FIRST)
    return () => {
      window.clearTimeout(timer)
      s.touring = false
    }
  }, [touring, kick])

  const wake = () => {
    state.current.touring = false
    setIdle(false)
    if (!engaged) rest()
  }

  const tileAt = (clientX: number, clientY: number) => {
    const svg = root.current?.querySelector('svg')
    const box = svg?.getBoundingClientRect()
    if (!box || !box.width) return -1
    const point: [number, number] = [((clientX - box.left) / box.width) * WIDTH, ((clientY - box.top) / box.height) * HEIGHT]
    return TILE_HULLS.findIndex((hull) => inside(point, hull as [number, number][]))
  }

  const show = (index: number) => {
    if (state.current.selected === index) return
    select(index)
    kick()
  }

  return (
    <div
      ref={root}
      className="wh-fig"
      role="group"
      tabIndex={0}
      aria-label="WebHarvest in Chrome's side panel on a desk monitor. Enter or Space scans the page into six count tiles; left and right arrows read each tile."
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        window.clearTimeout(quiet.current)
        setHovering(true)
        setIdle(false)
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return
        wake()
        show(tileAt(event.clientX, event.clientY))
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return
        setHovering(false)
        if (!focused) rest()
        show(-1)
      }}
      onPointerDown={(event) => {
        wake()
        const tile = tileAt(event.clientX, event.clientY)
        if (tile >= 0) show(tile)
        else scan()
      }}
      onFocus={() => {
        window.clearTimeout(quiet.current)
        setFocused(true)
        setIdle(false)
        if (status.current) status.current.textContent = state.current.spoken
      }}
      onBlur={() => {
        setFocused(false)
        if (!hovering) rest()
      }}
      onKeyDown={(event) => {
        const s = state.current
        const count = SECTIONS.length
        let next: number | null = null
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (event.repeat) return
          wake()
          scan()
          return
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = s.selected < 0 ? 0 : (s.selected + 1) % count
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = s.selected < 0 ? count - 1 : (s.selected + count - 1) % count
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = count - 1
        else if (event.key === 'Escape') next = -1
        if (next === null) return
        event.preventDefault()
        wake()
        show(next)
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.defs}
        {props.cableBack}
        {props.desk}
        {props.stand}
        {props.monitor}
        {props.trayBack}
        {REST_CARDS.map((card, file) => {
          const nodes = cards.current[file]!
          return (
            <g key={file} ref={(node) => void (nodes.group = node)} className="iso-solid wh-file">
              <path ref={(node) => void (nodes.fill = node)} className="iso-fill" d={card.paths.fill} />
              {[0, 1, 2, 3].map((shade) => (
                <path key={shade} ref={(node) => void (nodes.shades[shade] = node)} className="iso-shade" data-shade={shade} d={card.paths.shades[shade] ?? ''} />
              ))}
              <path ref={(node) => void (nodes.top = node)} className="iso-top" d={card.paths.top} />
              <path ref={(node) => void (nodes.crease = node)} className="iso-line iso-crease" data-tone="lo" d={card.paths.crease} />
              <path ref={(node) => void (nodes.lines = node)} className="iso-line" data-tone="mid" d={card.lines} />
              <path ref={(node) => void (nodes.free = node)} className="iso-line" data-tone="mid" data-free="" d={card.free} />
              <path ref={(node) => void (nodes.edge = node)} className="iso-line iso-edge" data-tone="hi" d={card.paths.outline} />
            </g>
          )
        })}
        {props.trayFront}
        {props.keyboard}
        {props.mouse}
        <g>
          {BATCHES.map(([section], index) => (
            <g key={index} ref={(node) => void (tokens.current[index]!.node = node)} className="wh-token" style={{ display: 'none' }}>
              <TokenBody art={TOKENS[SECTIONS[section]!.kind]} />
            </g>
          ))}
        </g>
      </IsoFigure>
      <span ref={status} className="wh-sr" role="status" aria-live="polite" />
    </div>
  )
}
