import * as React from 'react'
import { Dots, FaceText, Line, Solid } from '../../components/iso/react/draw.tsx'
import {
  DECK_ART,
  DECK_CABLE,
  DESKTOP,
  DESK_ART,
  JO_ART,
  KEYBOARD_ART,
  KEYS,
  LEDGE_ART,
  MONITOR_ART,
  MOUSE_ART,
  PC_ART,
  SCREEN,
  VIDEO_CABLE,
  type Piece,
  type Recess,
} from './geometry.ts'
import { VERSION } from './model.ts'
import { JoLive } from './live.tsx'

function Tube({ piece, tone = 'mid' }: { piece: Piece; tone?: 'mid' | 'hi' | 'lo' }) {
  return (
    <g className="tb">
      <path className="tb-body" d={piece.body} />
      {piece.wide ? <path className="tb-shine" d={piece.shine} /> : null}
      {piece.wide ? <path className="tb-shade" d={piece.shade} /> : null}
      <path className="iso-line tb-edge" data-tone={tone} d={piece.edges} />
    </g>
  )
}

function Faded({ list, tone = 'lo' }: { list: { d: string; alpha: number }[]; tone?: 'lo' | 'faint' }) {
  const groups = new Map<number, string>()
  for (const { d, alpha } of list) {
    if (!d || !(alpha > 0.02)) continue
    const level = Math.min(1, Math.round(alpha * 20) / 20)
    groups.set(level, (groups.get(level) ?? '') + d)
  }
  return (
    <>
      {[...groups].map(([alpha, d]) => (
        <g key={alpha} opacity={alpha < 1 ? alpha : undefined}>
          <Line d={d} tone={tone} />
        </g>
      ))}
    </>
  )
}

function Hole({ id, recess, backClass, children }: { id: string; recess: Recess; backClass: string; children?: React.ReactNode }) {
  return (
    <>
      <clipPath id={id}>
        <path transform={recess.front} d={recess.shape} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {recess.tops ? <path className="iso-top" d={recess.tops} /> : null}
        {recess.sides.map((d, shade) => (d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null))}
        <g transform={recess.back}>
          <path className={backClass} d={recess.shape} />
          {children}
          <path className="iso-line" data-tone="faint" d={recess.shape} />
        </g>
      </g>
      <g transform={recess.front}>
        <path className="iso-line" data-tone="lo" d={recess.shape} />
      </g>
    </>
  )
}

const DESK = (
  <g key="desk">
    <path className="iso-halo" d={DESK_ART.halo} />
    {DESK_ART.feet.map((parts, index) => (
      <g key={index}>
        <Solid paths={parts[0]!} tone="lo" />
        <Solid paths={parts[1]!} tone="mid" />
      </g>
    ))}
    <Solid paths={DESK_ART.slab} tone="mid" />
    <Line d={DESK_ART.groove} tone="lo" />
    <Line d={DESK_ART.screwRings} tone="lo" />
    <Dots points={DESK_ART.screws} size={0.5} tone="mid" />
    <Solid paths={DESK_ART.mat} tone="lo" crease="none" />
    <Line d={DESK_ART.stitch} tone="faint" dotted />
    <Solid paths={DESK_ART.label} tone="lo" crease="none" />
    <Line d={DESK_ART.labelLine} tone="faint" />
    <Dots points={DESK_ART.labelScrews} size={0.45} tone="mid" />
    <FaceText transform={DESK_ART.labelText} size={3} tone="lo" anchor="middle">
      {`Bunny ${VERSION}`}
    </FaceText>
  </g>
)

const MONITOR = (
  <g key="monitor">
    <path className="iso-halo" d={MONITOR_ART.standHalo} />
    <Solid paths={MONITOR_ART.stand} tone="mid" />
    <Line d={MONITOR_ART.standGroove} tone="lo" />
    <Solid paths={MONITOR_ART.plate} tone="mid" />
    <Dots points={MONITOR_ART.plateScrews} size={0.45} tone="mid" />
    <Solid paths={MONITOR_ART.neck} tone="mid" />
    <g transform={MONITOR_ART.clipPlane}>
      <path className="jo-hole" d={MONITOR_ART.clipBack} />
      <Line d={MONITOR_ART.clip} tone="lo" />
    </g>
    <Solid paths={MONITOR_ART.case} tone="mid" />
    <Line d={MONITOR_ART.vents} tone="faint" />
    <Hole id="jo-glass-clip" recess={SCREEN} backClass="jo-glass">
      <linearGradient id="jo-glare" gradientUnits="userSpaceOnUse" x1={DESKTOP.glareFrom[0]} y1={DESKTOP.glareFrom[1]} x2={DESKTOP.glareTo[0]} y2={DESKTOP.glareTo[1]}>
        <stop offset="0" className="jo-glare-stop" />
        <stop offset="1" className="jo-glare-stop" stopOpacity={0} />
      </linearGradient>
      <g data-part="desktop">
        <path className="jo-win" d={DESKTOP.window} />
        <path className="jo-win" data-dark="" data-part="win-dark" d={DESKTOP.window} />
        <path className="jo-win-picture" d={DESKTOP.picture} />
        <path className="jo-icon" d={DESKTOP.buttons} />
        <Line d={DESKTOP.bar} tone="faint" />
        <Line d={DESKTOP.text} tone="lo" free />
        <Line d={DESKTOP.window} tone="lo" />
        <path className="jo-icon" d={DESKTOP.icons} />
        <Line d={DESKTOP.names} tone="lo" free />
      </g>
      <path className="jo-bloom" d={DESKTOP.bloom} />
      <path className="jo-glare" d={DESKTOP.glare} fill="url(#jo-glare)" />
    </Hole>
  </g>
)

const LEDGE_BACK = (
  <g key="ledge-back">
    <Solid paths={LEDGE_ART.cheekLeft} tone="mid" />
    <Solid paths={LEDGE_ART.floor} tone="mid" />
    <Solid paths={LEDGE_ART.leftCap} tone="mid" />
  </g>
)

const JO = (
  <g key="jo">
    <Solid paths={JO_ART.torso} tone="hi" />
    <Solid paths={JO_ART.earLeft} tone="hi" />
    <Solid paths={JO_ART.head} tone="hi" crease="lo" />
    <Solid paths={JO_ART.rim} tone="hi" crease="faint" />
    <Solid paths={JO_ART.screen} tone="lo" crease="none" className="jo-screen" />
    <g transform={JO_ART.facePlane}>
      {JO_ART.blush.map(({ cx, cy, rx, ry }, index) => (
        <ellipse key={index} className="jo-blush" cx={cx} cy={cy} rx={rx} ry={ry} />
      ))}
      {JO_ART.eyes.map(({ cx, cy }, index) => (
        <g key={index} data-eye="">
          <g className="jo-blink">
            <ellipse className="jo-eye" cx={cx} cy={cy} rx={JO_ART.eye.rx} ry={JO_ART.eye.ry} />
            <circle className="jo-sparkle" cx={cx - 1.2} cy={cy - 1.75} r={1} />
            <circle className="jo-sparkle" cx={cx + 1.1} cy={cy + 1.55} r={0.48} />
          </g>
        </g>
      ))}
      <path className="jo-smile" d={JO_ART.smile} />
    </g>
    <Solid paths={JO_ART.earRight} tone="hi" />
    <Line d={JO_ART.earTip} tone="mid" />
    <Solid paths={JO_ART.collar} tone="hi" />
    <Solid paths={JO_ART.stalk} tone="hi" crease="none" />
    <circle className="jo-glow" data-part="glow" cx={JO_ART.ballAt[0]} cy={JO_ART.ballAt[1]} r={7.5} />
    <g className="jo-light">
      <radialGradient id="jo-ball" gradientUnits="userSpaceOnUse" cx={JO_ART.ballAt[0]} cy={JO_ART.ballAt[1]} r={JO_ART.ballR} fx={JO_ART.ballLit[0]} fy={JO_ART.ballLit[1]}>
        <stop offset="0" className="jo-ball-core" />
        <stop offset="0.5" className="jo-ball-body" />
        <stop offset="1" className="jo-ball-rim" />
      </radialGradient>
      <circle className="jo-ball" cx={JO_ART.ballAt[0]} cy={JO_ART.ballAt[1]} r={JO_ART.ballR} fill="url(#jo-ball)" />
    </g>
  </g>
)

const LEDGE_FRONT = (
  <g key="ledge-front">
    <Solid paths={LEDGE_ART.rightCap} tone="mid" />
    <Solid paths={LEDGE_ART.lip} tone="mid" />
    <Solid paths={LEDGE_ART.cheekRight} tone="mid" />
    <g transform={LEDGE_ART.plane}>
      <path className="jo-icon" d={LEDGE_ART.start + LEDGE_ART.running} />
      <Line d={LEDGE_ART.pins + LEDGE_ART.tray} tone="lo" />
      <Line d={LEDGE_ART.clock} tone="lo" free />
    </g>
    <Line d={LEDGE_ART.search} tone="lo" />
  </g>
)

const HANDS = (
  <g key="hands">
    {JO_ART.hands.map((paths, index) => (
      <Solid key={index} paths={paths} tone="hi" inner={<Line d={JO_ART.fingers[index]!} tone="lo" />} />
    ))}
  </g>
)

const VIDEO = (
  <g key="video">
    <Solid paths={MONITOR_ART.port} tone="lo" />
    <Solid paths={MONITOR_ART.plug} tone="mid" />
    <Faded list={MONITOR_ART.plugRibs} />
    {VIDEO_CABLE.map((piece, index) => (
      <Tube key={index} piece={piece} />
    ))}
  </g>
)

const PC = (
  <g key="pc">
    <path className="iso-halo" d={PC_ART.halo} />
    {PC_ART.feet.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" />
    ))}
    <Solid paths={PC_ART.case} tone="mid" />
    <Line d={PC_ART.topVents} tone="faint" />
    <Dots points={PC_ART.topScrews} size={0.45} tone="mid" />
    <g transform={PC_ART.sidePlane}>
      <Line d={PC_ART.sidePanel} tone="faint" />
      <Line d={PC_ART.sideVents + PC_ART.sideVentsLow} tone="lo" />
      <Line d={PC_ART.netFrame} tone="lo" />
    </g>
    {PC_ART.screws.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" />
    ))}
    <Line d={PC_ART.screwSlots} tone="faint" />
    <Solid paths={PC_ART.tether} tone="mid" crease="none" />
    <Solid paths={PC_ART.rivet} tone="mid" />
    <Solid paths={PC_ART.cap} tone="mid" />
    <Solid paths={PC_ART.tab} tone="mid" />
    <Solid paths={PC_ART.bezel} tone="mid" />
    <g transform={PC_ART.facePlane}>
      <Line d={PC_ART.vents} tone="lo" />
      <path className="jo-led" data-part="led" d={PC_ART.led} />
    </g>
    <Hole id="jo-slot-clip" recess={PC_ART.slot} backClass="jo-hole" />
    <Solid paths={PC_ART.cartridge} tone="mid" />
    <Line d={PC_ART.cartRibs} tone="lo" />
    <g transform={PC_ART.cartPlane}>
      <Line d={PC_ART.cartGrip} tone="lo" />
    </g>
    <Solid paths={PC_ART.cartLabel} tone="lo" crease="none" />
    <Line d={PC_ART.cartLabelLine} tone="faint" />
    <Line d={PC_ART.cartRule} tone="lo" free />
    <Solid paths={PC_ART.eject} tone="mid" />
    <Solid paths={PC_ART.power} tone="mid" />
    <Line d={PC_ART.powerRing} tone="lo" />
    <Solid paths={PC_ART.frontPort} tone="lo" />
    <Solid paths={PC_ART.plug} tone="mid" />
  </g>
)

const KEYBOARD = (
  <g key="keyboard">
    <path className="iso-halo" d={KEYBOARD_ART.halo} />
    {KEYBOARD_ART.feet.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" />
    ))}
    <Solid paths={KEYBOARD_ART.base} tone="mid" />
    <Line d={KEYBOARD_ART.well} tone="lo" />
    <Dots points={KEYBOARD_ART.screws} size={0.45} tone="mid" />
    {KEYS.map((key) => {
      const cap = (
        <g key={key.name} className="jo-key" data-key={key.name}>
          <Solid paths={key.cap} tone="mid" />
          <Line d={key.dish} tone="faint" />
        </g>
      )
      if (!key.well) return cap
      return (
        <g key={key.name}>
          <clipPath id={`jo-key-${key.name}`}>
            <path d={key.well.clip} />
          </clipPath>
          <g clipPath={`url(#jo-key-${key.name})`}>{cap}</g>
          <path className="iso-line" data-tone="mid" d={key.well.lip} />
        </g>
      )
    })}
  </g>
)

const MOUSE = (
  <g key="mouse">
    <path className="iso-halo" d={MOUSE_ART.padHalo} />
    <Solid paths={MOUSE_ART.pad} tone="lo" crease="none" />
    <Line d={MOUSE_ART.stitch} tone="faint" dotted />
    <path className="iso-halo" d={MOUSE_ART.halo} />
    <Line d={MOUSE_ART.base} tone="mid" />
    <clipPath id="jo-mouse-clip">
      <path d={MOUSE_ART.clip} />
    </clipPath>
    <g clipPath="url(#jo-mouse-clip)">
      <Solid paths={MOUSE_ART.shell} tone="mid" crease="none" inner={<Line d={MOUSE_ART.seams} tone="lo" />} />
    </g>
    <path className="jo-hole" d={MOUSE_ART.slot} />
    <Line d={MOUSE_ART.slot} tone="lo" />
    <path className="jo-wheel" d={MOUSE_ART.wheel} />
  </g>
)

const DECK = (
  <g key="deck">
    <path className="iso-halo" d={DECK_ART.halo} />
    <Solid paths={DECK_ART.plinth} tone="lo" />
    <Solid paths={DECK_ART.body} tone="mid" />
    <Line d={DECK_ART.groove} tone="lo" />
    <Line d={DECK_ART.screwRings} tone="lo" />
    <Dots points={DECK_ART.screws} size={0.45} tone="mid" />
    {DECK_ART.sliders.map((slider, index) => (
      <g key={index}>
        <path className="jo-hole" d={slider.slotLine} />
        <Line d={slider.slotLine} tone="lo" />
        <Solid paths={slider.strip} tone="lo" crease="none" />
        <Line d={slider.minor} tone="lo" />
        <Line d={slider.major} tone="mid" />
        <Solid paths={slider.plate} tone="lo" crease="none" />
        <Line d={slider.rule} tone="lo" free />
      </g>
    ))}
    {DECK_ART.toggles.map((toggle, index) => (
      <g key={index}>
        <Solid paths={toggle.plate} tone="lo" crease="none" />
        <Line d={toggle.rule} tone="lo" free />
        <Solid paths={toggle.lamp} tone="lo" className="jo-lamp" />
        <Solid paths={toggle.nut} tone="mid" />
        <Solid paths={toggle.collar} tone="mid" />
      </g>
    ))}
    <Solid paths={DECK_ART.lock} tone="mid" />
    <Line d={DECK_ART.lockDish} tone="faint" />
    <Solid paths={DECK_ART.lockPlate} tone="lo" crease="none" />
    <Line d={DECK_ART.lockRule} tone="lo" free />
    <Solid paths={DECK_ART.port} tone="lo" />
  </g>
)

const DECK_LINE = (
  <g key="deck-line">
    <Solid paths={DECK_ART.plug} tone="mid" />
    {DECK_CABLE.map((piece, index) => (
      <Tube key={index} piece={piece} />
    ))}
  </g>
)

const LABEL =
  'Bunny AI Assistant as a desk diorama. Bunny, a small toy robot with a glowing face screen and an antenna light, peeks over the taskbar ledge of a monitor with its hands on the edge. Beside the monitor stands a mini PC holding the model cartridge, with its network port capped; in front are a keyboard, a mouse on its pad and a control deck with switches for Bluetooth, Wi-Fi and dark mode and sliders for volume and brightness. Asking Bunny opens a chat on the screen, a fixed rule runs on the PC, and the matching control on the deck moves.'

export function JoArt() {
  return (
    <JoLive
      label={LABEL}
      desk={DESK}
      monitor={MONITOR}
      ledgeBack={LEDGE_BACK}
      jo={JO}
      ledgeFront={LEDGE_FRONT}
      hands={HANDS}
      video={VIDEO}
      pc={PC}
      keyboard={KEYBOARD}
      mouse={MOUSE}
      deck={DECK}
      deckLine={DECK_LINE}
    />
  )
}
