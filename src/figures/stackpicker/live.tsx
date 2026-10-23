import * as React from 'react'
import { translateAlong } from '../../components/iso/iso-kit'
import { IsoFigure } from '../../components/iso/react/draw'
import { asksForStillness, follow, useInView, useLoop, useReadout } from '../../components/iso/react/live'
import { LAYERS, TOUR_READ, popupOf, readoutOf, shareOf, spokenOf, tourAt } from './model'
import { HEIGHT, P, WIDTH, plateMove } from './view'

const TOUR_FIRST = 1400
const TOUR_BACK = 3600
const OPEN_TIME = 1.9
const PULL_EASE = 0.2
const WORDPRESS = 3
const SHADOW = 0.7

interface State {
  open: number
  want: boolean
  pick: number
  pulls: number[]
  tour: number
}

interface Props {
  label: string
  defs: React.ReactNode
  under: React.ReactNode
  shadow: React.ReactNode
  screen: React.ReactNode
  page: React.ReactNode
  press: React.ReactNode
  icon: React.ReactNode
  popup: React.ReactNode
  hinge: React.ReactNode
  plates: React.ReactNode[]
}

const fine = (value: number) => `${Math.round(value * 1000) / 1000}`

function setOpacity(node: Element | null | undefined, value: number) {
  if (!node) return
  if (value >= 1) node.removeAttribute('opacity')
  else node.setAttribute('opacity', fine(value))
  node.setAttribute('visibility', value > 0 ? 'visible' : 'hidden')
}

export function LaptopLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const state = React.useRef<State>({ open: 0, want: false, pick: -1, pulls: Array(LAYERS).fill(0), tour: -1 })
  const shown = React.useRef({ shares: Array(LAYERS).fill(-1), pulls: Array(LAYERS).fill(-1), open: -1, lit: -2, spoken: '' })
  const plates = React.useRef<(SVGGElement | null)[]>([])
  const shadows = React.useRef<(SVGGElement | null)[]>([])
  const page = React.useRef<SVGGElement | null>(null)
  const popup = React.useRef<SVGGElement | null>(null)
  const press = React.useRef<SVGGElement | null>(null)
  const svg = React.useRef<SVGGElement | null>(null)
  const live = React.useRef<HTMLSpanElement | null>(null)
  const quiet = React.useRef({ idle: true, engaged: false, timer: 0 })
  const [hovering, setHovering] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [idle, setIdle] = React.useState(true)
  const visible = useInView(anchor)

  const draw = (opening: boolean) => {
    const s = state.current
    const was = shown.current
    for (let index = 0; index < LAYERS; index++) {
      const share = shareOf(s.open, index)
      const pull = s.pulls[index]!
      if (share === was.shares[index] && pull === was.pulls[index]) continue
      was.shares[index] = share
      was.pulls[index] = pull
      const node = plates.current[index]
      const move = plateMove(index, share, pull)
      node?.setAttribute('transform', translateAlong(P, move))
      setOpacity(node, Math.min(1, share / 0.1))
      // The shadow stays on the deck: it follows the plate across the floor only.
      shadows.current[index]?.setAttribute('transform', translateAlong(P, [move[0], move[1], 0]))
      setOpacity(shadows.current[index], SHADOW * share)
    }
    if (s.open !== was.open) {
      was.open = s.open
      const shown = popupOf(s.open)
      setOpacity(popup.current, shown)
      setOpacity(press.current, shown)
      page.current?.setAttribute('opacity', fine(1 - 0.45 * shareOf(s.open, LAYERS - 1)))
    }
    const lit = s.open > 0.99 ? s.pick : -1
    if (lit !== was.lit) {
      was.lit = lit
      svg.current?.querySelectorAll('[data-layer]').forEach((node) => {
        const on = Number((node as SVGElement).dataset.layer) === lit
        node.toggleAttribute('data-on', on)
        node.querySelectorAll(':scope > .sp-body').forEach((body) => body.toggleAttribute('data-lit', on))
      })
    }
    const spoken = spokenOf(s.want, s.want ? s.pick : -1)
    if (spoken !== was.spoken) {
      was.spoken = spoken
      anchor.current?.setAttribute('aria-valuenow', `${s.want ? s.pick + 1 : 0}`)
      anchor.current?.setAttribute('aria-valuetext', spoken)
    }
    say(readoutOf(s.open, opening, lit))
  }

  const kick = useLoop((dt, calm) => {
    const s = state.current
    if (s.tour >= 0) {
      s.tour += dt
      const plan = tourAt(s.tour)
      s.want = plan.open
      s.pick = plan.lit
    }
    const target = s.want ? 1 : 0
    // A steady ramp: each plate's own smoothstep eases it in and out.
    s.open = calm ? target : s.open + Math.max(-dt / OPEN_TIME, Math.min(dt / OPEN_TIME, target - s.open))
    let pulling = false
    s.pulls.forEach((pull, index) => {
      const next = follow(pull, s.want && index === s.pick ? 1 : 0, dt, PULL_EASE, calm)
      if (next !== (s.want && index === s.pick ? 1 : 0)) pulling = true
      s.pulls[index] = next
    })
    draw(s.want)
    return s.tour >= 0 || s.open !== target || pulling
  }, visible)

  React.useEffect(() => {
    if (!asksForStillness()) return
    const s = state.current
    s.want = true
    s.pick = WORDPRESS
    kick()
  }, [kick])

  const resume = React.useCallback(() => {
    quiet.current.idle = true
    setIdle(true)
  }, [])

  const engaged = hovering || focused

  React.useEffect(() => {
    const q = quiet.current
    q.engaged = engaged
    window.clearTimeout(q.timer)
    q.timer = engaged ? 0 : window.setTimeout(resume, TOUR_BACK)
  }, [engaged, resume])

  React.useEffect(() => {
    const q = quiet.current
    return () => window.clearTimeout(q.timer)
  }, [])

  const touring = visible && idle && !engaged

  React.useEffect(() => {
    if (!touring || asksForStillness()) return
    const s = state.current
    // Start the tour from where the figure is: closed starts at the click, open at the reading.
    const timer = window.setTimeout(() => {
      s.tour = s.want ? TOUR_READ : 0
      kick()
    }, TOUR_FIRST)
    return () => {
      window.clearTimeout(timer)
      s.tour = -1
    }
  }, [touring, kick])

  const wake = () => {
    const q = quiet.current
    if (q.idle) {
      q.idle = false
      setIdle(false)
    }
    window.clearTimeout(q.timer)
    q.timer = q.engaged ? 0 : window.setTimeout(resume, TOUR_BACK)
  }

  const take = () => {
    state.current.tour = -1
    wake()
  }

  const setOpen = (open: boolean) => {
    const s = state.current
    take()
    s.want = open
    if (live.current) live.current.textContent = open ? 'StackPicker open: the page lifts into seven layers' : 'Popup closed: the layers settle back into the page'
    kick()
  }

  const pick = (index: number) => {
    const s = state.current
    take()
    if (!s.want) setOpen(true)
    s.pick = Math.max(0, Math.min(LAYERS - 1, index))
    kick()
  }

  const layerOf = (target: EventTarget | null) => {
    const node = (target as Element | null)?.closest?.('[data-layer]') as SVGElement | null
    return node && state.current.open > 0.5 ? Number(node.dataset.layer) : null
  }

  return (
    <div
      ref={anchor}
      className="sp-fig"
      role="slider"
      tabIndex={0}
      aria-label="StackPicker on a laptop in Chrome: Enter or Space clicks the toolbar icon and lifts the page into its seven layers; Up and Down arrows step through them"
      aria-valuemin={0}
      aria-valuemax={LAYERS}
      aria-valuenow={0}
      aria-valuetext={spokenOf(false, -1)}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        setHovering(true)
        wake()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setHovering(false)
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return
        const layer = layerOf(event.target)
        if (layer !== null && layer !== state.current.pick) pick(layer)
      }}
      onPointerDown={(event) => {
        const layer = layerOf(event.target)
        if (layer !== null) pick(layer)
        else setOpen(!state.current.want)
      }}
      onFocus={() => {
        setFocused(true)
        wake()
      }}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        const s = state.current
        const key = event.key
        if (key === ' ' || key === 'Enter') {
          event.preventDefault()
          if (!event.repeat) setOpen(!s.want)
          return
        }
        let next: number | null = null
        if (key === 'ArrowDown' || key === 'ArrowRight') next = s.want && s.pick >= 0 ? s.pick + 1 : 0
        else if (key === 'ArrowUp' || key === 'ArrowLeft') next = s.want && s.pick >= 0 ? s.pick - 1 : LAYERS - 1
        else if (key === 'Home') next = 0
        else if (key === 'End') next = LAYERS - 1
        else if (key === 'Escape') {
          if (s.want) setOpen(false)
          return
        }
        if (next === null) return
        event.preventDefault()
        pick(next)
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        <g ref={svg}>
          {props.defs}
          {props.under}
          {props.plates.map((_, index) => (
            <g
              key={`shadow-${index}`}
              visibility="hidden"
              opacity="0"
              ref={(node) => {
                shadows.current[index] = node
              }}
            >
              {props.shadow}
            </g>
          ))}
          {props.screen}
          <g ref={page}>{props.page}</g>
          <g ref={press} visibility="hidden" opacity="0">
            {props.press}
          </g>
          {props.icon}
          <g ref={popup} visibility="hidden" opacity="0">
            {props.popup}
          </g>
          {props.hinge}
          {props.plates
            .map((plate, index) => (
              <g
                key={index}
                visibility="hidden"
                opacity="0"
                ref={(node) => {
                  plates.current[index] = node
                }}
              >
                {plate}
              </g>
            ))
            .reverse()}
        </g>
      </IsoFigure>
      <span ref={live} className="sp-live" aria-live="polite" />
    </div>
  )
}
