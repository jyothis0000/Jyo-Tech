import * as React from 'react'
import type { Flat, SolidPaths } from '../../components/iso/iso-kit.ts'
import { IsoFigure } from '../../components/iso/react/draw.tsx'
import { asksForStillness, follow, useInView, useLoop, useReadout } from '../../components/iso/react/live.tsx'
import { leverOf } from './frame.ts'
import { BUBBLE_BOX, CHAT_BOX, CHAT_SHAPE, CONTROL_AT, FACE_AT, GLASS_PLANE, JO_BOX, KNOB_ART, SLIDE } from './geometry.ts'
import {
  READY,
  REMINDER,
  REMIND_FOR,
  REMIND_READOUT,
  REMIND_SPOKEN,
  SLIDERS,
  SLOTS,
  SNOOZE,
  START,
  STOPS,
  TOGGLES,
  MEETING_LEAD,
  TYPE_AT,
  askFor,
  askLength,
  beatOf,
  holdOf,
  reminderOf,
  type Ask,
  type Control,
  type Settings,
} from './model.ts'
import { HEIGHT, JX, RISE, WIDTH, shift } from './view.ts'

const TOUR_FIRST = 1.4
const TOUR_BACK = 3600
const GAP = 0.8
const KEY_DIP = 1.6
const FONT = 4.4
const SMALL = 3.4

interface Run {
  slot: number
  ask: Ask | null
  from: Settings
  t: number
  keep: boolean
  measured: boolean
  spoke: boolean
  carry: boolean
  cut: boolean
}

interface Nodes {
  jo: SVGGElement | null
  eyes: SVGGElement[]
  glow: SVGCircleElement | null
  light: SVGGElement | null
  led: SVGPathElement | null
  keys: SVGGElement[]
  levers: SVGPathElement[][]
  lamps: SVGGElement[]
  knobs: SVGGElement[]
  chat: SVGGElement | null
  typed: SVGTextElement | null
  cursor: SVGRectElement | null
  user: SVGGElement | null
  userBox: SVGPathElement | null
  userText: SVGTextElement | null
  reply: SVGGElement | null
  replyBox: SVGPathElement | null
  replyText: SVGTextElement | null
  bubble: SVGGElement | null
  desktop: SVGGElement | null
  winDark: SVGPathElement | null
  status: HTMLSpanElement | null
}

const C = CHAT_BOX
const B = BUBBLE_BOX
const TEXT_X = C.x0 + 7.4
const INPUT = { x0: C.x0 + 4, x1: C.x1 - 13, z0: C.z0 + 4.5, z1: C.z0 + 13.5 }
const USER = { z0: C.z1 - 27, z1: C.z1 - 17 }
const REPLY = { z0: C.z1 - 41, z1: C.z1 - 31 }

const box = (x0: number, z0: number, x1: number, z1: number, r = 2.6) => {
  const w = Math.max(x1 - x0, r * 2)
  return `M${x0 + r} ${-z1}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${z1 - z0 - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(z1 - z0 - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`
}

// The reminder bubble, with its tail pointing down at Bunny's head.
const TAIL = JX
const BUBBLE_SHAPE = `M${B.x0 + B.r} ${-B.z1}H${B.x1 - B.r}A${B.r} ${B.r} 0 0 1 ${B.x1} ${-B.z1 + B.r}V${-B.z0 - B.r}A${B.r} ${B.r} 0 0 1 ${B.x1 - B.r} ${-B.z0}H${TAIL + 3.4}L${TAIL} ${-B.z0 + 5}L${TAIL - 3.4} ${-B.z0}H${B.x0 + B.r}A${B.r} ${B.r} 0 0 1 ${B.x0} ${-B.z0 - B.r}V${-B.z1 + B.r}A${B.r} ${B.r} 0 0 1 ${B.x0 + B.r} ${-B.z1}Z`
const TICK = (x: number, z: number) => `M${x} ${-z}l1.1 1.1 2.2-2.6 .6.5-2.8 3.2-1.7-1.7Z`
const SEND = `M${C.x1 - 8.4} ${-(C.z0 + 9)}m-3.3 0a3.3 3.3 0 1 0 6.6 0a3.3 3.3 0 1 0-6.6 0Z`

const tenth = (value: number) => Math.round(value * 100) / 100
const toggleOn = (settings: Settings, name: (typeof TOGGLES)[number]) => (settings[name] ? 1 : 0)
const sliderShare = (value: number) => value / 100

function shownOf(run: Run | null, settings: Settings, control: Control) {
  const value = (s: Settings) => (control === 'volume' || control === 'brightness' ? sliderShare(s[control]) : s[control] ? 1 : 0)
  if (!run || !run.ask || run.ask.control !== control) return value(settings)
  const move = beatOf(run.ask.said, run.t, run.keep).move
  return value(run.from) + (value(run.ask.next) - value(run.from)) * move
}

// The lit control is always the one the picked (or running) command moves, so Enter asks what is lit.
const litOf = (slot: number): Control | null => (slot === REMINDER ? null : SLOTS[slot]!)

function saidOf(slot: number, settings: Settings) {
  return slot === REMINDER ? 'meeting reminder' : askFor(SLOTS[slot]!, settings).said
}

function writeSolid(paths: SVGPathElement[], solid: SolidPaths) {
  const list = [solid.fill, ...[0, 1, 2, 3].map((index) => solid.shades[index] ?? ''), solid.top, solid.crease, solid.outline]
  list.forEach((d, index) => paths[index]?.setAttribute('d', d))
}

function LiveSolid({ paths, kind, lit = false }: { paths: SolidPaths; kind: string; lit?: boolean }) {
  return (
    <g className="iso-solid" data-lever={kind} data-lit={lit ? '' : undefined} data-seamless={paths.seamless ? '' : undefined}>
      <path className="iso-fill" d={paths.fill} />
      {[0, 1, 2, 3].map((shade) => (
        <path key={shade} className="iso-shade" data-shade={shade} d={paths.shades[shade] ?? ''} />
      ))}
      <path className="iso-top" d={paths.top} />
      <path className="iso-line iso-crease" data-tone="faint" d={paths.crease} />
      <path className="iso-line iso-edge" data-tone="mid" d={paths.outline} />
    </g>
  )
}

interface Props {
  label: string
  desk: React.ReactNode
  monitor: React.ReactNode
  ledgeBack: React.ReactNode
  jo: React.ReactNode
  ledgeFront: React.ReactNode
  hands: React.ReactNode
  video: React.ReactNode
  pc: React.ReactNode
  keyboard: React.ReactNode
  mouse: React.ReactNode
  deck: React.ReactNode
  deckLine: React.ReactNode
}

export function JoLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const root = anchor
  const visible = useInView(root)
  const nodes = React.useRef<Nodes | null>(null)
  const levers = React.useMemo(() => TOGGLES.map((name, index) => leverOf(index, toggleOn(START, name))), [])
  const state = React.useRef({
    settings: START,
    run: null as Run | null,
    pick: 0,
    // An arrow pick holds until the next ask: the tour doesn't move it on, and its "next" readout
    // waits for the running ask's reply instead of being written over.
    userPick: false,
    next: '',
    lit: null as Control | null,
    look: [0, 0] as Flat,
    rise: 0,
    riseTo: 0,
    glow: 0.45,
    clock: 0,
    pointer: null as Flat | null,
    touring: false,
    wait: TOUR_FIRST,
    hovering: false,
    focused: false,
    shown: { bluetooth: -1, wifi: -1, dark: -1, theme: -1, bright: -1 } as Record<string, number>,
    typed: -1,
    readout: READY,
    // What the chat and the reminder bubble showed last frame, and that level fading out, so a run
    // cut short by another one closes its window instead of dropping it.
    chatShown: 0,
    chatOut: 0,
    bubbleShown: 0,
    bubbleOut: 0,
  })
  const quiet = React.useRef(0)

  const start = React.useCallback((slot: number, keep: boolean) => {
    const s = state.current
    const ask = slot === REMINDER ? null : askFor(SLOTS[slot]!, s.settings)
    const was = s.run?.ask ? beatOf(s.run.ask.said, s.run.t, s.run.keep).open : 0
    s.run = { slot, ask, from: s.settings, t: keep ? (ask ? askLength(ask.said) : REMIND_FOR / 2) : 0, keep, measured: false, spoke: false, carry: Boolean(ask) && was > 0.5, cut: false }
    if (ask) s.settings = ask.next
    s.pick = slot
    s.lit = litOf(slot)
    s.userPick = false
    s.next = ''
    s.typed = -1
  }, [])

  const draw = React.useCallback(() => {
    const n = nodes.current
    const s = state.current
    if (!n) return
    const run = s.run
    const beat = run?.ask ? beatOf(run.ask.said, run.t, run.keep) : null
    const remind = run && !run.ask ? reminderOf(run.t, run.keep) : null

    n.jo?.setAttribute('transform', s.rise > 0.001 ? shift([0, 0, RISE * s.rise]) : '')
    const look = `translate(${tenth(s.look[0] * 1.9)} ${tenth(s.look[1] * 1.5)})`
    n.eyes.forEach((eye) => eye.setAttribute('transform', look))

    const dip = beat ? beat.keys : 0
    n.keys.forEach((key) => {
      key.setAttribute('transform', dip > 0.001 ? shift([0, 0, -KEY_DIP * dip]) : '')
      key.toggleAttribute('data-down', dip > 0.5)
    })

    if (n.chat) {
      const open = Math.max(beat ? (run?.carry && run.t < 0.45 ? 1 : beat.open) : 0, s.chatOut)
      s.chatShown = open
      n.chat.style.opacity = open.toFixed(3)
      n.chat.style.visibility = open > 0.002 ? '' : 'hidden'
      const grow = 0.9 + 0.1 * open
      n.chat.setAttribute('transform', `translate(${C.x1} ${-C.z0}) scale(${tenth(grow)}) translate(${-C.x1} ${C.z0})`)
    }
    if (run?.ask && beat) {
      const { said, reply } = run.ask
      if (!run.measured && n.userText && n.replyText && n.userBox && n.replyBox) {
        n.userText.textContent = said
        n.replyText.textContent = reply
        const userWidth = n.userText.getComputedTextLength() + 6
        const replyWidth = n.replyText.getComputedTextLength() + 11
        n.userText.setAttribute('x', `${tenth(C.x1 - 4 - userWidth + 3)}`)
        n.userBox.setAttribute('d', box(C.x1 - 4 - userWidth, USER.z0, C.x1 - 4, USER.z1))
        n.replyBox.setAttribute('d', box(C.x0 + 4, REPLY.z0, C.x0 + 4 + replyWidth, REPLY.z1))
        run.measured = true
      }
      if (beat.typed !== s.typed && n.typed && n.cursor) {
        s.typed = beat.typed
        n.typed.textContent = said.slice(0, beat.typed)
        n.cursor.setAttribute('x', `${tenth(TEXT_X + (beat.typed ? n.typed.getComputedTextLength() : 0) + 0.5)}`)
      }
      n.cursor?.style.setProperty('opacity', beat.sent > 0.5 ? '0' : '')
      n.user?.style.setProperty('opacity', beat.sent.toFixed(3))
      n.reply?.style.setProperty('opacity', beat.reply.toFixed(3))
    }
    if (n.bubble) {
      const show = Math.max(remind ? remind.show : 0, s.bubbleOut)
      s.bubbleShown = show
      n.bubble.style.opacity = show.toFixed(3)
      n.bubble.style.visibility = show > 0.002 ? '' : 'hidden'
    }

    TOGGLES.forEach((name, index) => {
      const on = shownOf(run, s.settings, name)
      if (Math.abs(on - (s.shown[name] ?? -1)) > 1e-4) {
        s.shown[name] = on
        const { rod, ball } = leverOf(index, on)
        writeSolid(n.levers[index * 2]!, rod)
        writeSolid(n.levers[index * 2 + 1]!, ball)
      }
      n.lamps[index]?.toggleAttribute('data-on', on > 0.5)
    })
    SLIDERS.forEach((name, index) => {
      const share = shownOf(run, s.settings, name)
      n.knobs[index]?.setAttribute('transform', shift([(SLIDE.x1 - SLIDE.x0) * share, 0, 0]))
    })
    const theme = shownOf(run, s.settings, 'dark')
    if (theme !== s.shown.theme) {
      s.shown.theme = theme
      n.winDark?.style.setProperty('opacity', theme.toFixed(3))
    }
    const bright = shownOf(run, s.settings, 'brightness')
    if (bright !== s.shown.bright) {
      s.shown.bright = bright
      n.desktop?.style.setProperty('opacity', (0.4 + 0.6 * bright).toFixed(3))
    }
    const lit = s.lit
    n.levers.forEach((paths, index) => paths[0]?.parentElement?.toggleAttribute('data-lit', lit === TOGGLES[Math.floor(index / 2)]))
    n.knobs.forEach((knob, index) => knob.firstElementChild?.toggleAttribute('data-lit', lit === SLIDERS[index]))

    n.light?.setAttribute('data-status', remind ? 'remind' : 'ready')
    n.glow?.setAttribute('data-status', remind ? 'remind' : 'ready')
    n.glow?.style.setProperty('opacity', s.glow.toFixed(3))
    n.led?.toggleAttribute('data-on', Boolean(beat?.running))

    let readout = s.readout
    if (beat && run?.ask) {
      if (beat.reply > 0.5) readout = run.ask.readout
      else if (beat.sent > 0.5) readout = `rule matched · ${run.ask.control === 'wifi' ? 'wi-fi' : run.ask.control === 'dark' ? 'dark mode' : run.ask.control}`
      else if (beat.typed > 0) readout = `typing · ${run.ask.said.slice(0, beat.typed)}`
      else if (run.t < TYPE_AT) readout = 'alt+space · chat opens'
      if (beat.reply > 0.5 && !run.spoke && n.status) {
        n.status.textContent = run.ask.spoken
        run.spoke = true
      }
    } else if (remind && run) {
      readout = REMIND_READOUT
      if (!run.spoke && n.status) {
        n.status.textContent = REMIND_SPOKEN
        run.spoke = true
      }
    }
    if (s.next && (!run || !beat || beat.reply > 0.5)) readout = s.next
    s.readout = readout
    say(readout)
  }, [say])

  const tick = React.useCallback(
    (dt: number, calm: boolean) => {
      const s = state.current
      s.clock += dt
      if (s.touring && !s.run && !calm) {
        s.wait -= dt
        if (s.wait <= 0) start(s.pick, false)
      }
      const run = s.run
      let busy = false
      if (run) {
        run.t += dt
        const end = run.ask ? askLength(run.ask.said) : REMIND_FOR
        if (run.cut && !run.keep) {
          const [from, to] = run.ask ? holdOf(run.ask.said) : [0.35, REMIND_FOR - 0.35]
          if (run.t >= from && run.t < to) run.t = to
        }
        if (!run.keep && run.t >= end) {
          s.run = null
          if (!s.userPick) {
            s.pick = (run.slot + 1) % STOPS
            s.lit = litOf(s.pick)
          }
          s.wait = GAP
        } else busy = !run.keep || run.t < end
      }
      const now = s.run
      const beat = now?.ask ? beatOf(now.ask.said, now.t, now.keep) : null
      let aim: Flat = [0, 0.12]
      if (s.pointer) {
        const dx = (s.pointer[0] - FACE_AT[0]) / 70
        const dy = (s.pointer[1] - FACE_AT[1]) / 70
        const length = Math.hypot(dx, dy)
        aim = length > 1 ? [dx / length, dy / length] : [dx, dy]
      } else if (beat && now?.ask) {
        const target = beat.sent > 0 && beat.reply < 1 ? CONTROL_AT[now.ask.control] : beat.typed > 0 ? ([FACE_AT[0] - 60, FACE_AT[1] - 8] as Flat) : null
        if (target) {
          const dx = target[0] - FACE_AT[0]
          const dy = target[1] - FACE_AT[1]
          const length = Math.hypot(dx, dy) || 1
          aim = [dx / length, (dy / length) * 0.9]
        }
      } else if (now && !now.ask) aim = [0.1, -0.9]
      else if (!s.run && s.lit && (s.touring || s.focused)) {
        const target = CONTROL_AT[s.lit]
        const dx = target[0] - FACE_AT[0]
        const dy = target[1] - FACE_AT[1]
        const length = Math.hypot(dx, dy) || 1
        aim = [dx / length, dy / length]
      }
      s.look = [follow(s.look[0], aim[0], dt, 0.14, calm), follow(s.look[1], aim[1], dt, 0.14, calm)]
      s.rise = follow(s.rise, s.riseTo, dt, 0.2, calm)
      const pulsing = !calm && Boolean((beat && beat.running) || (now && !now.ask))
      const glowTo = pulsing ? 0.55 + 0.45 * Math.sin(s.clock * Math.PI * 2 * 0.9) ** 2 : now ? 0.7 : 0.45
      s.glow = pulsing ? glowTo : follow(s.glow, glowTo, dt, 0.25, calm)
      const fade = (level: number) => {
        const next = follow(level, 0, dt, 0.1, calm)
        return next < 0.003 ? 0 : next
      }
      s.chatOut = fade(s.chatShown)
      s.bubbleOut = fade(s.bubbleShown)
      draw()
      const still = s.look[0] === aim[0] && s.look[1] === aim[1] && s.rise === s.riseTo && s.glow === glowTo
      return busy || s.touring || !still || s.chatOut > 0 || s.bubbleOut > 0
    },
    [draw, start],
  )

  const kick = useLoop(tick, visible)

  React.useEffect(() => {
    const node = root.current
    if (!node) return
    const all = <T extends Element>(selector: string) => [...node.querySelectorAll<T>(selector)]
    nodes.current = {
      jo: node.querySelector('[data-part="jo"]'),
      eyes: all<SVGGElement>('[data-eye]'),
      glow: node.querySelector('[data-part="glow"]'),
      light: node.querySelector('.jo-light'),
      led: node.querySelector('[data-part="led"]'),
      keys: ['Alt', 'Space'].map((name) => node.querySelector<SVGGElement>(`[data-key="${name}"]`)!).filter(Boolean),
      levers: all<SVGGElement>('[data-lever]').map((group) => [...group.querySelectorAll<SVGPathElement>('path')]),
      lamps: all<SVGGElement>('.jo-lamp'),
      knobs: all<SVGGElement>('[data-knob]'),
      chat: node.querySelector('[data-part="chat"]'),
      typed: node.querySelector('[data-part="typed"]'),
      cursor: node.querySelector('[data-part="cursor"]'),
      user: node.querySelector('[data-part="user"]'),
      userBox: node.querySelector('[data-part="user-box"]'),
      userText: node.querySelector('[data-part="user-text"]'),
      reply: node.querySelector('[data-part="reply"]'),
      replyBox: node.querySelector('[data-part="reply-box"]'),
      replyText: node.querySelector('[data-part="reply-text"]'),
      bubble: node.querySelector('[data-part="bubble"]'),
      desktop: node.querySelector('[data-part="desktop"]'),
      winDark: node.querySelector('[data-part="win-dark"]'),
      status: node.querySelector('[data-part="status"]'),
    }
    const s = state.current
    if (asksForStillness()) start(0, true)
    else s.touring = true
    draw()
    return () => window.clearTimeout(quiet.current)
  }, [draw, start, root])

  const hold = () => {
    const s = state.current
    s.touring = false
    window.clearTimeout(quiet.current)
  }

  const resume = () => {
    window.clearTimeout(quiet.current)
    quiet.current = window.setTimeout(() => {
      const s = state.current
      if (s.hovering || s.focused || asksForStillness()) return
      s.touring = true
      s.wait = 0.4
      kick()
    }, TOUR_BACK)
  }

  const ask = (slot: number) => {
    const s = state.current
    const run = s.run
    if (run?.ask && !run.keep && beatOf(run.ask.said, run.t).move < 1) return
    if (run && !run.ask && slot === REMINDER) return
    start(slot, asksForStillness())
    kick()
  }

  const toView = (clientX: number, clientY: number): Flat | null => {
    const svg = root.current?.querySelector('svg')
    const rect = svg?.getBoundingClientRect()
    if (!rect || !rect.width) return null
    return [((clientX - rect.left) / rect.width) * WIDTH, ((clientY - rect.top) / rect.height) * HEIGHT]
  }

  const point = (event: React.PointerEvent) => {
    const s = state.current
    const at = toView(event.clientX, event.clientY)
    if (!at) return
    s.pointer = at
    s.riseTo = at[0] > JO_BOX.x0 && at[0] < JO_BOX.x1 && at[1] > JO_BOX.y0 && at[1] < JO_BOX.y1 ? 1 : 0
    kick()
  }

  return (
    <div
      ref={anchor}
      className="jo-fig"
      tabIndex={0}
      role="group"
      aria-label="Bunny AI Assistant on a desk. Enter or Space asks Bunny the picked command, and the matching control on the deck moves. Left and Right arrows pick the command."
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        state.current.hovering = true
        hold()
      }}
      onPointerMove={(event) => {
        if (event.pointerType === 'mouse') point(event)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return
        const s = state.current
        s.hovering = false
        s.pointer = null
        s.riseTo = 0
        kick()
        resume()
      }}
      onClick={(event) => {
        const s = state.current
        hold()
        const control = (event.target as Element).closest('[data-control]')?.getAttribute('data-control') as Control | null
        const slot = control ? SLOTS.indexOf(control) : s.pick
        ask(slot < 0 ? s.pick : slot)
        if (!s.hovering && !s.focused) resume()
      }}
      onFocus={(event) => {
        if (!event.currentTarget.matches(':focus-visible')) return
        state.current.focused = true
        hold()
      }}
      onBlur={() => {
        state.current.focused = false
        resume()
      }}
      onKeyDown={(event) => {
        const s = state.current
        let step = 0
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') step = 1
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') step = -1
        if (step) {
          event.preventDefault()
          hold()
          s.pick = (s.pick + step + STOPS) % STOPS
          s.userPick = true
          s.lit = litOf(s.pick)
          s.next = `next · ${saidOf(s.pick, s.settings)}`
          draw()
          kick()
          return
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (event.repeat) return
          hold()
          ask(s.pick)
          return
        }
        if (event.key === 'Escape' && s.run && !s.run.keep) {
          s.run.cut = true
          kick()
        }
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.desk}
        {props.monitor}
        <g transform={GLASS_PLANE}>
          <g data-part="chat" style={{ opacity: 0, visibility: 'hidden' }}>
            <clipPath id="jo-chat-clip">
              <path d={CHAT_SHAPE} />
            </clipPath>
            <path className="jo-panel" d={CHAT_SHAPE} />
            <g clipPath="url(#jo-chat-clip)">
              <circle className="jo-ink" cx={C.x0 + 6.4} cy={-(C.z1 - 5.4)} r={2.4} />
              <path className="iso-line" data-tone="lo" data-free="" d={`M${C.x0 + 11.4} ${-(C.z1 - 5.4)}H${C.x0 + 30}`} />
              <path className="iso-line" data-tone="lo" d={`M${C.x0} ${-(C.z1 - 10.8)}H${C.x1}`} />
              <g data-part="user" style={{ opacity: 0 }}>
                <path className="jo-bubble-user" data-part="user-box" d={box(C.x1 - 40, USER.z0, C.x1 - 4, USER.z1)} />
                <text className="jo-text" data-part="user-text" x={C.x1 - 37} y={-(USER.z0 + 3.2)} fontSize={FONT} />
              </g>
              <g data-part="reply" style={{ opacity: 0 }}>
                <path className="jo-bubble" data-part="reply-box" d={box(C.x0 + 4, REPLY.z0, C.x0 + 50, REPLY.z1)} />
                <path className="jo-ink" d={TICK(C.x0 + 6.6, (REPLY.z0 + REPLY.z1) / 2 + 0.3)} />
                <text className="jo-text" data-part="reply-text" x={C.x0 + 12.4} y={-(REPLY.z0 + 3.2)} fontSize={FONT} />
              </g>
              <path className="jo-field" d={box(INPUT.x0, INPUT.z0, INPUT.x1, INPUT.z1, 2)} />
              <text className="jo-text" data-part="typed" x={TEXT_X} y={-(INPUT.z0 + 3.1)} fontSize={FONT} />
              <rect className="jo-cursor" data-part="cursor" x={TEXT_X + 0.5} y={-(INPUT.z1 - 1.8)} width={0.7} height={5.4} />
              <path className="jo-ink" d={SEND} />
            </g>
            <path className="iso-line" data-tone="mid" d={CHAT_SHAPE} />
          </g>
          <g data-part="bubble" style={{ opacity: 0, visibility: 'hidden' }}>
            <clipPath id="jo-bubble-clip">
              <path d={BUBBLE_SHAPE} />
            </clipPath>
            <path className="jo-panel" d={BUBBLE_SHAPE} />
            <g clipPath="url(#jo-bubble-clip)">
              <circle className="jo-ink" cx={B.x0 + 6.6} cy={-(B.z1 - 6.4)} r={2.2} />
              <text className="jo-text" x={B.x0 + 11.4} y={-(B.z1 - 8)} fontSize={FONT}>{`In ${MEETING_LEAD} min`}</text>
              <path className="iso-line" data-tone="lo" data-free="" d={`M${B.x0 + 5} ${-(B.z1 - 15.6)}H${B.x0 + 46}`} />
              <path className="jo-field" d={box(B.x0 + 4, B.z0 + 4, B.x0 + 38.6, B.z0 + 13)} />
              <text className="jo-text" x={B.x0 + 6.4} y={-(B.z0 + 7.1)} fontSize={SMALL}>
                Join meeting
              </text>
              <path className="jo-field" d={box(B.x0 + 41.6, B.z0 + 4, B.x1 - 4, B.z0 + 13)} />
              <text className="jo-text" x={B.x0 + 44} y={-(B.z0 + 7.1)} fontSize={SMALL}>
                {`Snooze ${SNOOZE} min`}
              </text>
            </g>
            <path className="iso-line" data-tone="mid" d={BUBBLE_SHAPE} />
          </g>
        </g>
        {props.ledgeBack}
        <g data-part="jo" className="jo-bot">
          {props.jo}
        </g>
        {props.ledgeFront}
        {props.hands}
        {props.video}
        {props.pc}
        {props.mouse}
        {props.keyboard}
        {props.deck}
        <g data-control="bluetooth" className="jo-control">
          <LiveSolid paths={levers[0]!.rod} kind="rod" />
          <LiveSolid paths={levers[0]!.ball} kind="ball" />
        </g>
        <g data-control="wifi" className="jo-control">
          <LiveSolid paths={levers[1]!.rod} kind="rod" />
          <LiveSolid paths={levers[1]!.ball} kind="ball" />
        </g>
        <g data-control="dark" className="jo-control">
          <LiveSolid paths={levers[2]!.rod} kind="rod" />
          <LiveSolid paths={levers[2]!.ball} kind="ball" />
        </g>
        {KNOB_ART.map((knob, index) => (
          <g key={index} data-knob="" data-control={SLIDERS[index]} className="jo-control" transform={shift([(SLIDE.x1 - SLIDE.x0) * sliderShare(START[SLIDERS[index]!]), 0, 0])}>
            <g className="iso-solid">
              <path className="iso-fill" d={knob.paths.fill} />
              {knob.paths.shades.map((d, shade) => (d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null))}
              <path className="iso-top" d={knob.paths.top} />
              <path className="iso-line iso-crease" data-tone="faint" d={knob.paths.crease} />
              <path className="iso-line iso-bevel" data-tone="faint" d={knob.paths.bevel ?? ''} />
              <path className="iso-line" data-tone="lo" d={knob.grip} />
              <path className="iso-line iso-edge" data-tone="mid" d={knob.paths.outline} />
            </g>
          </g>
        ))}
        {props.deckLine}
      </IsoFigure>
      <span className="jo-sr" role="status" aria-live="polite" data-part="status" />
    </div>
  )
}
