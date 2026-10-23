import { Plate } from '../../components/iso/react/draw.tsx'
import { WebHarvestArt } from './art.tsx'
import { RESTING, SECTIONS } from './model.ts'
import './wh.css'

const counted = SECTIONS.map((section) => `${section.count} ${section.name === 'SEO & meta' ? 'SEO & meta fields' : section.count === 1 ? section.name.slice(0, -1).toLowerCase() : section.name.toLowerCase()}`)

export default function WebHarvestFigure({ fig = 'Fig 2' }: { fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="WebHarvest · Scan page"
      hint="Click to scan · ← → tiles"
      readout={RESTING}
      keys={[
        { mark: 'lit', label: 'The item being harvested' },
        { mark: 'raised', label: 'Six count tiles in the side panel' },
        { mark: 'flat', label: 'CSV, JSON and Word in the tray' },
      ]}
      caption={`Press Scan page in the side panel and WebHarvest reads a sample shop page into six sections: ${counted.slice(0, -1).join(', ')} and ${counted.at(-1)}. Products come from JSON-LD, microdata or a built-in detector, each tagged with its source. It all runs in your browser, ready to export as CSV, JSON or Word.`}
    >
      <WebHarvestArt />
    </Plate>
  )
}
