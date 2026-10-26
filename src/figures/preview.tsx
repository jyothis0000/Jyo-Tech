import { lazy, Suspense, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

const figures = import.meta.glob<{ default: ComponentType }>('./*/figure.tsx')
const params = new URLSearchParams(location.search)
const name = params.get('fig') ?? ''
const width = Number(params.get('w')) || 900
const load = figures[`./${name}/figure.tsx`]
const Figure = load ? lazy(load) : () => <p>No figure "{name}". Have: {Object.keys(figures).join(', ')}</p>

createRoot(document.getElementById('root')!).render(
  <main style={{ maxWidth: width, margin: '0 auto', padding: 16 }}>
    <Suspense>
      <Figure />
    </Suspense>
  </main>,
)
