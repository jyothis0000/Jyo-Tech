import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import ChromeButton from '../components/ChromeButton'
import { CHROME_STORE_URL_STACKPICKER, CHROME_STORE_URL_WEBHARVEST } from '../constants'
import stackpickerLogo from '../../store-assets/stackpicker-logo.png'
import webharvestLogo from '../../store-assets/webharvest-logo.png'

const stackpickerFeatures = [
  'Frontend frameworks & libraries',
  'CMS platforms',
  'E-commerce solutions',
  'Analytics & tracking',
  'CDN & hosting',
  'Infrastructure',
]

const webharvestFeatures = [
  'Images & SVGs',
  'Color palettes',
  'Typography details',
  'Links & metadata',
  'Page content',
  'Website assets',
]

export default function Home() {
  return (
    <>
      <PageMeta
        title="jyo tech"
        description="Simple browser extensions for discovering, inspecting, and extracting useful information from websites."
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Chrome Extensions
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl text-balance">
          Tools for understanding the web.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
          Simple browser extensions for discovering, inspecting, and extracting useful information from websites.
        </p>
      </section>

      {/* Product cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* StackPicker */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition hover:border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <img src={stackpickerLogo} alt="StackPicker Logo" className="h-full w-full object-contain rounded-lg" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">StackPicker</h2>
              <p className="mt-2 text-zinc-400">See the technology stack behind any website.</p>

              <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4">
                {stackpickerFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ChromeButton href={CHROME_STORE_URL_STACKPICKER} accent="indigo" />
                <Link
                  to="/stackpicker"
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </div>

          {/* WebHarvest */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition hover:border-emerald-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <img src={webharvestLogo} alt="WebHarvest Logo" className="h-full w-full object-contain rounded-lg" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">WebHarvest</h2>
              <p className="mt-2 text-zinc-400">Harvest website assets, design, content, and publicly accessible data.</p>

              <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4">
                {webharvestFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ChromeButton href={CHROME_STORE_URL_WEBHARVEST} accent="emerald" />
                <Link
                  to="/webharvest"
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom tagline */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-widest text-zinc-600">Built for developers &amp; designers</p>
          <p className="mt-4 text-xl font-medium text-zinc-300">
            Inspect any website. Understand its stack. Extract its assets.
          </p>
        </div>
      </section>
    </>
  )
}

