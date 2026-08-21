import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import ChromeButton from '../components/ChromeButton'
import FeatureCard from '../components/FeatureCard'
import { CHROME_STORE_URL_WEBHARVEST } from '../constants'
import logo from '../../store-assets/webharvest-logo.png'
import screenshot1 from '../../store-assets/webharvest-screenshot-1.png'
import screenshot2 from '../../store-assets/webharvest-screenshot-2.png'
import screenshot3 from '../../store-assets/webharvest-screenshot-3.png'

const screenshots = [
  { src: screenshot1, title: 'Media & Image Extraction', desc: 'Browse, preview, and save images & SVG vector assets loaded on any page.' },
  { src: screenshot2, title: 'Color & Typography Inspector', desc: 'Analyze hex color palettes, font families, line heights, and element styling.' },
  { src: screenshot3, title: 'Metadata & Link Explorer', desc: 'Inspect OpenGraph tags, page structure, links, and structured data.' },
]

const features = [
  { icon: '🖼️', title: 'Images', description: 'View and save all publicly loaded images on the current page.' },
  { icon: '◼', title: 'SVGs', description: 'Extract inline and linked SVG assets for use in your own projects.' },
  { icon: '🎨', title: 'Color Palette', description: 'Extract background, text, border, and brand colors used on the page.' },
  { icon: '✒️', title: 'Typography', description: 'Inspect font families, sizes, weights, and line heights in use.' },
  { icon: '🔗', title: 'Links', description: 'List all internal and external links on the page in one view.' },
  { icon: '🏷️', title: 'Metadata', description: 'Read page title, description, Open Graph tags, and structured data.' },
  { icon: '📄', title: 'Page Content', description: 'Capture headings, paragraphs, and structured text from the page.' },
  { icon: '📦', title: 'Other Assets', description: 'Discover stylesheets, scripts, fonts, and other publicly loaded resources.' },
]

const steps = [
  { n: '01', title: 'Open any website', body: 'Go to the site whose assets you want to inspect in Chrome.' },
  { n: '02', title: 'Click WebHarvest', body: 'Open the extension from your Chrome toolbar.' },
  { n: '03', title: 'Browse and export', body: 'Navigate through asset categories and copy or save what you need.' },
]

export default function WebHarvest() {
  return (
    <>
      <PageMeta
        title="WebHarvest"
        description="Extract images, colors, typography, links, metadata, and other publicly accessible assets from any website."
        path="/webharvest"
      />

      {/* Hero Banner */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
                <img src={logo} alt="WebHarvest Logo" className="h-full w-full object-contain rounded-xl" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Chrome Extension
                </div>
                <h2 className="text-sm font-medium text-zinc-400 mt-1">WebHarvest Official Tool</h2>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
              Harvest website assets and<br />
              <span className="text-emerald-400">design details.</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400 leading-relaxed">
              WebHarvest extracts publicly accessible assets from any page — images, colors, typography, links, metadata, and more — right in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ChromeButton href={CHROME_STORE_URL_WEBHARVEST} accent="emerald" size="lg" />
              <Link to="/webharvest/support" className="inline-flex items-center rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition">
                Support
              </Link>
            </div>
          </div>

          {/* Banner Right Image: Logo Showcase Card */}
          <div className="shrink-0 w-full md:w-80 lg:w-96">
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/60 via-zinc-900/80 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 transition duration-300 hover:border-emerald-500/60 hover:shadow-emerald-500/20">
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-emerald-500/20 bg-zinc-950/80 p-8 shadow-inner overflow-hidden">
                <img
                  src={logo}
                  alt="WebHarvest Extension Logo"
                  className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">WebHarvest Logo</h3>
                  <p className="text-xs text-zinc-400">Official Chrome Extension Icon</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-zinc-100">Extension Previews</h2>
            <p className="mt-2 text-zinc-400">Explore how WebHarvest inspects and extracts assets from active browser tabs.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {screenshots.map((item, i) => (
              <div key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 transition hover:border-emerald-500/40">
                <div className="overflow-hidden bg-zinc-950">
                  <img
                    src={item.src}
                    alt={`WebHarvest screenshot ${i + 1}`}
                    className="w-full object-cover transition duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between border-t border-zinc-800/80">
                  <div>
                    <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-zinc-100">What you can extract</h2>
          <p className="mt-2 text-zinc-400">All publicly accessible — no scraping or bypassing restrictions.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <FeatureCard key={f.title} {...f} accent="emerald" />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 bg-zinc-900/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-10 text-2xl font-bold text-zinc-100">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map(s => (
              <div key={s.n} className="flex gap-4">
                <span className="text-2xl font-bold text-emerald-500/40 shrink-0">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-zinc-100">{s.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible use */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="font-semibold text-zinc-100 mb-3">Responsible use</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            WebHarvest only accesses assets that are already publicly loaded in your browser — the same resources your browser downloads to render the page. It does not bypass authentication, paywalls, robots.txt restrictions, or access controls. Always respect website terms of service and copyright when using extracted assets.
          </p>
          <Link to="/webharvest/privacy" className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300 transition">
            Read privacy policy →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-zinc-100">Start extracting assets today</h2>
          <p className="mt-3 text-zinc-400">Free. No sign-up. Works on any public webpage.</p>
          <div className="mt-8">
            <ChromeButton href={CHROME_STORE_URL_WEBHARVEST} accent="emerald" size="lg" />
          </div>
        </div>
      </section>
    </>
  )
}

