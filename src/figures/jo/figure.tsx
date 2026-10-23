import { Plate } from '../../components/iso/react/draw.tsx'
import { JoArt } from './art.tsx'
import { DOWNLOAD, MODEL, READY } from './model.ts'
import './jo.css'

export default function JoFigure({ fig = 'Fig 3' }: { fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="Jo AI Assistant"
      hint="Click to ask · ← → pick"
      readout={READY}
      keys={[
        { mark: 'lit', label: 'The control the command moves' },
        { mark: 'green', label: 'Status light: mint ready, amber reminder' },
      ]}
      caption={`Jo peeks over the Windows taskbar with its hands on the edge. Ask in chat and fixed rules change the setting on your own PC. Questions go to ${MODEL}, the cartridge in the PC, which runs there after a one-time ${DOWNLOAD} download, so local chats never leave it.`}
    >
      <JoArt />
    </Plate>
  )
}
