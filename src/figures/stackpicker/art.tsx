import { Fragment } from 'react'
import { Dots, Line, Solid } from '../../components/iso/react/draw'
import { LaptopLive } from './live'
import { LAYERS, ROWS, STACK } from './model'
import { BASE_ART, CAT_SIZE, CHROME_ART, DESK_ART, HEAD_V, HINGE_ART, KEY_ART, LID_ART, NAME_SIZE, PAGE_ART, PLATE_ART, PLATE_SHADOW, POPUP_ART, chipOf, rowTop } from './geometry'
import { GLASS_S, POPUP, planeMatrix } from './view'

export const BRAND = 'sp-brand'
export const POPUP_CLIP = 'sp-popup-clip'
const RULE = 'sp-rule'

const LABEL =
  'A laptop open on a desk mat, running Chrome on a shop page. The StackPicker icon sits in the toolbar; clicked, its popup lists seven technologies and the page lifts out of the screen as seven plates, one per layer of its stack.'

const DEFS = (
  <defs key="defs">
    <linearGradient id={BRAND} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style={{ stopColor: 'var(--brand-a, #5b5bd6)' }} />
      <stop offset="1" style={{ stopColor: 'var(--brand-b, #4cc3e6)' }} />
    </linearGradient>
    <linearGradient id={RULE} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style={{ stopColor: 'var(--brand-a, #5b5bd6)' }} />
      <stop offset="0.55" style={{ stopColor: 'var(--brand-b, #4cc3e6)' }} />
      <stop offset="1" style={{ stopColor: 'var(--brand-b, #4cc3e6)', stopOpacity: 0 }} />
    </linearGradient>
    <clipPath id={POPUP_CLIP}>
      <rect x={POPUP.x + 0.8} y={-(POPUP.y + POPUP.d) + 1.4} width={POPUP.w - 1.6} height={POPUP.d - 2.2} />
    </clipPath>
  </defs>
)

const DESK = (
  <g key="desk">
    <path className="iso-halo" d={DESK_ART.halo} />
    <Solid paths={DESK_ART.mat} tone="lo" crease="faint" />
    <Line d={DESK_ART.stitch} tone="faint" />
  </g>
)

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" />
    ))}
    <Solid paths={BASE_ART.case} tone="mid" inner={<Line d={BASE_ART.seam} tone="faint" />} />
    <Line d={BASE_ART.notch} tone="lo" />
    <Dots points={BASE_ART.led} size={0.7} tone="hi" />
    <path className="sp-hole" d={BASE_ART.holes} />
    <Line d={BASE_ART.holes} tone="lo" />
    <path className="sp-ink" d={BASE_ART.tongue} />
    <Line d={BASE_ART.jackRing} tone="faint" />
    <path className="sp-hole" d={BASE_ART.vents} />
    <Line d={BASE_ART.vents} tone="lo" />
    <Line d={BASE_ART.well} tone="lo" />
    <Line d={BASE_ART.wellInner} tone="faint" />
    <Line d={BASE_ART.grilles} tone="faint" />
    <Dots points={BASE_ART.grilleDots} size={0.42} tone="lo" />
    <Solid paths={BASE_ART.sticker} tone="lo" crease="none" />
    <Line d={BASE_ART.stickerLine} tone="faint" />
    <Line d={BASE_ART.stickerRules} tone="lo" free />
    <Line d={BASE_ART.stickerMark} tone="lo" />
    <Line d={BASE_ART.pad} tone="lo" />
    <Line d={BASE_ART.padInner} tone="faint" />
  </g>
)

const KEYS = (
  <g key="keys">
    {KEY_ART.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
  </g>
)

const LID = (
  <g key="lid">
    <Solid paths={LID_ART.shell} tone="mid" crease="faint" />
    <path className="iso-top" d={LID_ART.walls.top} />
    {LID_ART.walls.shades.map((d, shade) => (d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null))}
    <path className="sp-glass" d={LID_ART.glass} />
    <Line d={LID_ART.rimBack} tone="faint" />
    <path className="sp-hole" d={LID_ART.bumpers} />
    <Line d={LID_ART.bumpers} tone="lo" />
    <Line d={LID_ART.camRing} tone="faint" />
    <path className="sp-hole" d={LID_ART.cam} />
    <Line d={LID_ART.cam} tone="lo" />
  </g>
)

const CHROME = (
  <g key="chrome">
    <path className="sp-strip" d={CHROME_ART.strip} />
    <path className="sp-bar" d={CHROME_ART.bar} />
    <Line d={CHROME_ART.barLine} tone="faint" />
    <path className="sp-ink" d={CHROME_ART.tabInk} />
    <path className="sp-ink sp-dim" d={CHROME_ART.tabsInk} />
    <path className="sp-ink sp-dim" d={CHROME_ART.maxBox} fillRule="evenodd" />
    <path className="sp-ink" d={CHROME_ART.nav} />
    <path className="sp-ink sp-dim" d={CHROME_ART.navDim} />
    <path className="sp-field" d={CHROME_ART.field} />
    <path className="sp-ink" d={CHROME_ART.fieldInk} />
    <path className="sp-ink sp-dim" d={CHROME_ART.puzzle} />
    <path className="sp-ink" d={CHROME_ART.profile} />
    <path className="sp-ink" d={CHROME_ART.menu} />
  </g>
)

const ICON = (
  <g key="icon" data-part="icon">
    <path className="sp-brand" d={CHROME_ART.icon} fill={`url(#${BRAND})`} />
    <path className="sp-mark" d={CHROME_ART.iconMarks} />
  </g>
)

const PAGE = (
  <g key="page">
    <path className="sp-sheet" d={PAGE_ART.sheet} />
    <path className="sp-band" d={PAGE_ART.bands} />
    <path className="sp-card" d={PAGE_ART.cards} />
    <path className="sp-pic" d={PAGE_ART.picture} />
    <path className="sp-pic" d={PAGE_ART.cardPics} />
    <path className="sp-pic-ink" d={PAGE_ART.pictureInk} />
    <path className="sp-pic-ink" d={PAGE_ART.cardPicInk} />
    <path className="sp-ink" d={PAGE_ART.ink} />
  </g>
)

const POPUP_ART_JSX = (
  <g key="popup">
    <path className="iso-halo sp-shadow" d={POPUP_ART.shadow} />
    <path className="sp-pop" d={POPUP_ART.panel} />
    <path className="sp-head" d={POPUP_ART.header} />
    <path d={POPUP_ART.rule} fill={`url(#${RULE})`} />
    <path d={POPUP_ART.mark} fill={`url(#${BRAND})`} />
    <path className="sp-mark" d={POPUP_ART.markInk} />
    <path className="sp-badge" d={POPUP_ART.badge} />
    <path className="sp-ink sp-dim" d={POPUP_ART.host} />
    {ROWS.map((layer, row) => (
      <g key={layer} className="sp-row" data-layer={layer}>
        <path className="sp-row-accent" d={POPUP_ART.rows[row]!.accent} fill={`url(#${BRAND})`} />
        <path className="sp-chip" d={POPUP_ART.rows[row]!.chip} />
        <path className="sp-chip-edge" d={POPUP_ART.rows[row]!.chip} />
        <path className="sp-dot" d={POPUP_ART.rows[row]!.dot} />
      </g>
    ))}
    <g transform={planeMatrix(GLASS_S)} className="sp-type">
      <g clipPath={`url(#${POPUP_CLIP})`}>
        <text className="sp-type-hi" x={POPUP.x + 11.4} y={-(HEAD_V + 4.3)} fontSize={4.2}>
          StackPicker
        </text>
        <text className="sp-type-badge" x={POPUP.x + 46.7} y={-(HEAD_V + 4.75)} fontSize={2.9} textAnchor="middle">
          {LAYERS}
        </text>
        {ROWS.map((layer, row) => {
          const chip = chipOf(row)
          return (
            <g key={layer} className="sp-row-type" data-layer={layer}>
              <text className="sp-type-lo sp-type-cat" x={POPUP.x + 4.4} y={-(rowTop(row) - 3)} fontSize={CAT_SIZE}>
                {STACK[layer]!.category.toUpperCase()}
              </text>
              <text className="sp-type-mid" x={chip.x + 6.6} y={-(chip.y + chip.d / 2 - 1.45)} fontSize={NAME_SIZE}>
                {STACK[layer]!.name}
              </text>
            </g>
          )
        })}
      </g>
    </g>
    <Line d={POPUP_ART.outline} tone="mid" />
  </g>
)

const PLATES = PLATE_ART.map((plate, index) => (
  <g key={index} className="sp-plate" data-layer={index}>
    <path className="iso-halo sp-plate-halo" d={plate.body.fill} />
    <Solid className="sp-body" paths={plate.body} tone="mid" crease="faint" />
    <Solid className="sp-body" paths={plate.tab} tone="mid" crease="faint" />
    <path className="sp-tab-face" d={plate.tabFace} fill={`url(#${BRAND})`} />
    <Dots points={plate.notches} size={0.5} tone="hi" />
    <path className="sp-pins" d={plate.pins} />
    <Line d={plate.pins} tone="lo" />
    <Line d={plate.panel} tone="lo" />
    {plate.texture.lines ? <Line d={plate.texture.lines} tone="lo" className="sp-tex" /> : null}
    {plate.texture.filled ? <path className="sp-face" d={plate.texture.shapes} /> : null}
    {plate.texture.shapes ? <Line d={plate.texture.shapes} tone="lo" className="sp-tex" /> : null}
    {plate.texture.free ? <Line d={plate.texture.free} tone="lo" className="sp-tex" free /> : null}
    {plate.texture.dots ? <Dots points={plate.texture.dots} size={0.42} tone="mid" /> : null}
    <Line d={plate.screwRings} tone="lo" />
    <Dots points={plate.screws} size={0.45} tone="mid" />
    <Solid paths={plate.label} tone="lo" crease="faint" />
    <Line d={plate.labelRules} tone="lo" free />
    <Dots points={plate.labelScrews} size={0.4} tone="mid" />
  </g>
))

export function LaptopArt() {
  return (
    <LaptopLive
      label={LABEL}
      defs={DEFS}
      under={
        <Fragment key="under">
          {DESK}
          {BASE}
          {KEYS}
        </Fragment>
      }
      shadow={<path key="shadow" className="iso-halo sp-plate-shadow" d={PLATE_SHADOW} />}
      screen={
        <Fragment key="screen">
          {LID}
          {CHROME}
        </Fragment>
      }
      page={PAGE}
      icon={ICON}
      press={<path key="press" className="sp-press" d={CHROME_ART.press} />}
      popup={POPUP_ART_JSX}
      hinge={
        <g key="hinge">
          {HINGE_ART.parts.map((paths, index) => (
            <Solid key={index} paths={paths} tone="mid" />
          ))}
          <Dots points={HINGE_ART.screws} size={0.45} />
        </g>
      }
      plates={PLATES}
    />
  )
}
