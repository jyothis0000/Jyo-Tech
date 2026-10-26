import atom from '../assets/lab/atom.webp'
import bolt from '../assets/lab/bolt.webp'
import bubbles from '../assets/lab/bubbles.webp'
import burst from '../assets/lab/burst.webp'
import cloud from '../assets/lab/cloud.webp'
import flask from '../assets/lab/flask.webp'
import lightning from '../assets/lab/lightning.webp'
import question from '../assets/lab/question.webp'
import sparkles from '../assets/lab/sparkles.webp'
import splatGreen from '../assets/lab/splat-green.webp'
import splatPink from '../assets/lab/splat-pink.webp'
import testTube from '../assets/lab/test-tube.webp'

const art = { atom, bolt, bubbles, burst, cloud, flask, lightning, question, sparkles, splatGreen, splatPink, testTube }
export type Art = keyof typeof art

// A floating lab sticker. Purely decorative: hidden from screen readers, never takes clicks.
export default function Decor({ name, className = '' }: { name: Art; className?: string }) {
  return (
    <img
      src={art[name]}
      alt=""
      aria-hidden="true"
      loading="lazy"
      draggable={false}
      data-fx="float"
      className={`pointer-events-none select-none ${className}`}
    />
  )
}
