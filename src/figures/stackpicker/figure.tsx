import { Plate } from '../../components/iso/react/draw'
import { LaptopArt } from './art'
import { FINGERPRINTS, REST_TEXT } from './model'
import './stackpicker.css'

export default function StackPickerFigure({ fig = 'Fig 1' }: { fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="A page, picked apart"
      hint="Click icon · ↑↓ layers"
      readout={REST_TEXT}
      keys={[
        { mark: 'raised', label: 'The page’s stack, one plate per layer' },
        { mark: 'lit', label: 'The layer you point at, and its popup row' },
      ]}
      caption={`One click on the toolbar icon and StackPicker reads the open page inside Chrome, matching it against ${FINGERPRINTS.toLocaleString('en-US')} fingerprints bundled in the extension. Each layer of this shop’s stack was found by a different kind of evidence, from a cookie to a response header, and nothing leaves the browser.`}
    >
      <LaptopArt />
    </Plate>
  )
}
