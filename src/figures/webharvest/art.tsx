import { Dots, Line, Solid } from '../../components/iso/react/draw.tsx'
import {
  CABLE_OVER,
  CABLE_TIE,
  CABLE_UNDER,
  CHROME,
  DESK_ART,
  GLASS_RECESS,
  KEYBOARD_ART,
  KEYS,
  MARK,
  MONITOR_ART,
  MOUSE_ART,
  PAGE_ART,
  PANEL_ART,
  STAND_ART,
  TRAY_ART,
  markAt,
  type Piece,
} from './geometry.ts'
import { FILES, SECTIONS } from './model.ts'
import { EXPORTS, TILES } from './view.ts'
import { HarvestLive } from './live.tsx'

function Tube({ piece }: { piece: Piece }) {
  return (
    <g className="tb">
      <path className="tb-body" d={piece.body} />
      {piece.wide ? <path className="tb-shine" d={piece.shine} /> : null}
      {piece.wide ? <path className="tb-shade" d={piece.shade} /> : null}
      <path className="iso-line tb-edge" data-tone="mid" d={piece.edges} />
    </g>
  )
}

const Mark = ({ at, size }: { at: [number, number]; size: number }) => (
  <g className="wh-mark" transform={markAt(at, size)}>
    <path className="wh-mark-stem" d={MARK.stem} />
    <path className="wh-mark-leaf" d={MARK.leaves} />
  </g>
)

const CABLE_BACK = (
  <g key="cable-under">
    {CABLE_UNDER.map((piece, index) => (
      <Tube key={index} piece={piece} />
    ))}
  </g>
)

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
    <Dots points={DESK_ART.screws} size={0.5} />
    <Solid paths={DESK_ART.mat} tone="lo" crease="none" />
    <Line d={DESK_ART.stitch} tone="faint" dotted />
  </g>
)

const STAND = (
  <g key="stand">
    <path className="iso-halo" d={STAND_ART.halo} />
    <Solid paths={STAND_ART.base} tone="mid" />
    <Line d={STAND_ART.groove} tone="lo" />
    <Solid paths={STAND_ART.plate} tone="mid" />
    <Dots points={STAND_ART.plateScrews} size={0.45} />
    <Solid paths={STAND_ART.column} tone="mid" />
    {CABLE_OVER.map((piece, index) => (
      <Tube key={index} piece={piece} />
    ))}
    <Solid paths={CABLE_TIE} tone="mid" />
    <Solid paths={STAND_ART.clip} tone="mid" />
    <Dots points={[STAND_ART.clipScrew]} size={0.45} />
  </g>
)

const PAGE = (
  <g key="page">
    <path className="wh-page" d={PAGE_ART.page} />
    <path className="wh-ink-hi" d={PAGE_ART.logo} />
    <Line d={PAGE_ART.name} tone="mid" free />
    <g data-src="nav">
      <Line d={PAGE_ART.nav} tone="mid" free />
    </g>
    <path className="wh-ui" d={PAGE_ART.cart} />
    <Line d={PAGE_ART.headEdge} tone="faint" />
    <g data-src="head">
      <path className="wh-ink-hi" d={PAGE_ART.heading} />
      <path className="wh-ink" d={PAGE_ART.subhead} />
    </g>
    <path className="wh-card" d={PAGE_ART.sort} />
    <Line d={PAGE_ART.sort} tone="lo" />
    <path className="wh-ui" d={PAGE_ART.sortMark} />
    {PAGE_ART.cards.map((card, index) => (
      <g key={index} data-src={`card${index}`}>
        <path className="wh-card" d={card.card} />
        <path className="wh-ink" d={card.image} />
        <path className="wh-ink-hi" d={card.hill} />
        <path className="wh-ink-hi" d={card.sun} />
        <Line d={card.title} tone="lo" free />
        <path className="wh-price" d={card.price} />
        <Line d={card.cart} tone="lo" />
        <Line className="wh-src-edge" d={card.card} tone="lo" />
      </g>
    ))}
    <g data-src="table">
      <path className="wh-ink" d={PAGE_ART.tableHead} />
      <Line d={PAGE_ART.tableLines} tone="lo" />
      <Line className="wh-src-edge" d={PAGE_ART.table} tone="mid" />
    </g>
    <Line d={PAGE_ART.text} tone="lo" free />
    <path className="wh-footer" d={PAGE_ART.footer} />
    <g data-src="footer">
      <Line d={PAGE_ART.links} tone="lo" free />
    </g>
    <g data-src="mail">
      <path className="wh-ui" d={PAGE_ART.mail} />
    </g>
    <g data-src="phone">
      <path className="wh-ui" d={PAGE_ART.phone} />
    </g>
    <Line d={PAGE_ART.contacts} tone="lo" free />
    <Line d={PAGE_ART.track} tone="faint" />
    <path className="wh-ink" d={PAGE_ART.thumb} />
  </g>
)

const BROWSER = (
  <g key="browser">
    <path className="wh-tabs" d={CHROME.tabs} />
    <path className="wh-bar" d={CHROME.active} />
    <g data-src="tab">
      <path className="wh-ink-hi" d={CHROME.favicons} />
      <Line d={CHROME.titles} tone="mid" free />
    </g>
    <Line d={CHROME.dimTitles} tone="lo" free />
    <path className="wh-ui" d={CHROME.tabMarks + CHROME.windowMarks} />
    <path className="wh-bar" d={CHROME.bar} />
    <path className="wh-ui" d={CHROME.nav + CHROME.reload} />
    <path className="wh-omni" d={CHROME.omnibox} />
    <path className="wh-ui" d={CHROME.lock + CHROME.star} />
    <text className="wh-text wh-url" x={-80.6} y={-(CHROME.harvestAt[1] - 1.05)} fontSize={3}>
      shop.example/collections/all
    </text>
    <path className="wh-ui" d={CHROME.puzzle} />
    <path className="wh-icon" d={CHROME.harvest} />
    <Mark at={CHROME.harvestAt} size={6.4} />
    <path className="wh-ink-hi" d={CHROME.avatar} />
    <path className="wh-dot" d={CHROME.menu} />
    <Line d={CHROME.edge} tone="lo" />
  </g>
)

const PANEL = (
  <g key="panel">
    <path className="wh-panel" d={PANEL_ART.panel} />
    <Line d={PANEL_ART.divider} tone="lo" />
    <Mark at={PANEL_ART.markAt} size={5.6} />
    <text className="wh-text" x={PANEL_ART.nameAt[0]} y={-PANEL_ART.nameAt[1]} fontSize={4.2} fontWeight={600}>
      WebHarvest
    </text>
    <text className="wh-text wh-dim" x={PANEL_ART.hostAt[0]} y={-PANEL_ART.hostAt[1]} fontSize={2.8} textAnchor="end">
      shop.example
    </text>
    <path className="wh-ui" d={PANEL_ART.close} />
    <text className="wh-text" x={PANEL_ART.tabAt[0]![0]} y={-PANEL_ART.tabAt[0]![1]} fontSize={3.4}>
      Data
    </text>
    <text className="wh-text wh-dim" x={PANEL_ART.tabAt[1]![0]} y={-PANEL_ART.tabAt[1]![1]} fontSize={3.4}>
      Design
    </text>
    <Line d={PANEL_ART.tabEdge} tone="faint" />
    <path className="wh-brand" d={PANEL_ART.tabLine} />
    <Line d={PANEL_ART.title} tone="mid" free />
    <Line d={PANEL_ART.sub} tone="lo" free />
    <g className="wh-button" data-part="button">
      <path className="wh-brand" d={PANEL_ART.button} />
      <path className="wh-button-ink wh-button-icon" d={PANEL_ART.buttonIcon} />
      <text className="wh-button-ink" data-part="button-text" x={PANEL_ART.buttonAt[0]} y={-PANEL_ART.buttonAt[1]} fontSize={4.2} fontWeight={600} textAnchor="middle">
        Scan page
      </text>
    </g>
    <path className="wh-ink" d={PANEL_ART.progress} />
    <path className="wh-brand" data-part="progress" d={PANEL_ART.progress} opacity={0} />
    {TILES.map((tile, index) => (
      <g key={index} className="wh-tile" data-tile={index}>
        <clipPath id={`wh-tile-${index}`}>
          <path d={PANEL_ART.tiles[index]} />
        </clipPath>
        <path className="wh-tile-face" d={PANEL_ART.tiles[index]} />
        <g clipPath={`url(#wh-tile-${index})`}>
          <text className="wh-text wh-dim wh-tile-name" x={tile.x0 + 2.4} y={-(tile.z0 + 3.9)} fontSize={3.8}>
            {SECTIONS[index]!.name}
          </text>
          <text className="wh-text wh-count" data-count={index} x={tile.x1 - 2.4} y={-(tile.z0 + 3.6)} fontSize={5.6} fontWeight={700} textAnchor="end">
            {SECTIONS[index]!.count}
          </text>
        </g>
        <Line className="wh-tile-edge" d={PANEL_ART.tiles[index]!} tone="lo" />
      </g>
    ))}
    {PANEL_ART.rows.map((row, index) => (
      <g key={index}>
        <path className="wh-ink" d={row.thumb} />
        <Line d={row.lines} tone="lo" free />
        <path className="wh-ink-hi" d={row.price} />
      </g>
    ))}
    <Line d={PANEL_ART.rowEdge} tone="faint" />
    {EXPORTS.map((button, index) => (
      <g key={index} className="wh-export" data-export={index}>
        <path className="wh-tile-face" d={PANEL_ART.exports[index]} />
        <text className="wh-text" x={(button.x0 + button.x1) / 2} y={-(button.z0 + 3.6)} fontSize={3.6} fontWeight={600} textAnchor="middle">
          {FILES[index]}
        </text>
        <Line className="wh-tile-edge" d={PANEL_ART.exports[index]!} tone="lo" />
      </g>
    ))}
  </g>
)

const MONITOR = (
  <g key="monitor">
    <Solid paths={MONITOR_ART.case} tone="mid" />
    <Line d={MONITOR_ART.vents} tone="faint" />
    <clipPath id="wh-glass">
      <path transform={GLASS_RECESS.front} d={GLASS_RECESS.shape} />
    </clipPath>
    <g clipPath="url(#wh-glass)">
      {GLASS_RECESS.tops ? <path className="iso-top" d={GLASS_RECESS.tops} /> : null}
      {GLASS_RECESS.sides.map((d, shade) => (d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null))}
      <g transform={GLASS_RECESS.back}>
        <path className="wh-glass" d={GLASS_RECESS.shape} />
        {PAGE}
        {BROWSER}
        {PANEL}
        <path className="wh-glare" d={`M-120 -190H-40L-120 -110Z`} fill="url(#wh-glare)" />
        <path className="iso-line" data-tone="faint" d={GLASS_RECESS.shape} />
      </g>
    </g>
    <g transform={GLASS_RECESS.front}>
      <path className="iso-line" data-tone="lo" d={GLASS_RECESS.shape} />
    </g>
    <g transform={MONITOR_ART.face}>
      <Line d={MONITOR_ART.logo} tone="lo" />
      <path className="wh-lens" d={MONITOR_ART.camera} />
      <Line d={MONITOR_ART.camera} tone="lo" />
    </g>
    <Dots points={[MONITOR_ART.led]} size={0.7} tone="hi" />
    <g transform={MONITOR_ART.side}>
      <Line d={MONITOR_ART.keyFrame} tone="faint" />
    </g>
    {MONITOR_ART.keys.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" />
    ))}
    <Solid paths={MONITOR_ART.power} tone="mid" />
    <Line d={MONITOR_ART.powerRing} tone="lo" />
  </g>
)

const TRAY_BACK = (
  <g key="tray-back">
    <path className="iso-halo" d={TRAY_ART.halo} />
    {TRAY_ART.feet.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" />
    ))}
    <Solid paths={TRAY_ART.floor} tone="mid" />
    <Line d={TRAY_ART.ribs} tone="faint" />
    <Solid paths={TRAY_ART.back} tone="mid" />
    <Solid paths={TRAY_ART.far} tone="mid" />
  </g>
)

const TRAY_FRONT = (
  <g key="tray-front">
    <Solid paths={TRAY_ART.near} tone="mid" />
    <Dots points={TRAY_ART.rivets} size={0.45} />
    <Solid paths={TRAY_ART.front} tone="mid" />
    <g transform={TRAY_ART.face}>
      <Line d={TRAY_ART.holder} tone="lo" />
      <path className="wh-card" d={TRAY_ART.holderCard} />
      <Line d={TRAY_ART.holderCard} tone="faint" />
      <Line d={TRAY_ART.holderRules} tone="lo" free />
    </g>
    <Dots points={TRAY_ART.holderDots} size={0.45} />
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
    <Dots points={KEYBOARD_ART.screws} size={0.45} />
    <Dots points={KEYBOARD_ART.lamps} size={0.55} tone="lo" />
    {KEYS.map((key) => (
      <g key={key.name}>
        <Solid paths={key.cap} tone="mid" />
        <Line d={key.dish} tone="faint" />
      </g>
    ))}
  </g>
)

const MOUSE = (
  <g key="mouse">
    <path className="iso-halo" d={MOUSE_ART.halo} />
    <Line d={MOUSE_ART.base} tone="mid" />
    <clipPath id="wh-mouse">
      <path d={MOUSE_ART.clip} />
    </clipPath>
    <g clipPath="url(#wh-mouse)">
      <Solid paths={MOUSE_ART.shell} tone="mid" crease="none" inner={<Line d={MOUSE_ART.seams} tone="lo" />} />
    </g>
    <path className="wh-hole" d={MOUSE_ART.slot} />
    <Line d={MOUSE_ART.slot} tone="lo" />
    <path className="wh-wheel" d={MOUSE_ART.wheel} />
  </g>
)

const DEFS = (
  <defs key="defs">
    <linearGradient id="wh-brand" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" className="wh-stop-a" />
      <stop offset="1" className="wh-stop-b" />
    </linearGradient>
    <linearGradient id="wh-glare" gradientUnits="userSpaceOnUse" x1={-120} y1={-190} x2={-90} y2={-160}>
      <stop offset="0" className="wh-glare-stop" />
      <stop offset="1" className="wh-glare-stop" stopOpacity={0} />
    </linearGradient>
  </defs>
)

const LABEL =
  'WebHarvest drawn as a desk monitor running Chrome with the WebHarvest side panel open beside a sample shop page. Scanning lifts the page apart into small tokens: price tags for products, framed tiles for images, chain links for links, a gridded tile for the table, cards for contacts and labels for SEO and meta tags. Each one arcs in front of the screen into its count tile in the panel, and when the scan is done three file cards, CSV, JSON and Word, drop into an export tray on the desk.'

export function WebHarvestArt() {
  return (
    <HarvestLive
      label={LABEL}
      defs={DEFS}
      cableBack={CABLE_BACK}
      desk={DESK}
      stand={STAND}
      monitor={MONITOR}
      trayBack={TRAY_BACK}
      trayFront={TRAY_FRONT}
      keyboard={KEYBOARD}
      mouse={MOUSE}
    />
  )
}

