import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import ChromeButton from '../components/ChromeButton'
import FeatureCard from '../components/FeatureCard'
import { CHROME_STORE_URL_STACKPICKER } from '../constants'
import logo from '../../store-assets/stackpicker-logo.png'
import screenshot1 from '../../store-assets/screenshot-1.png'
import screenshot2 from '../../store-assets/screenshot-2.png'
import screenshot3 from '../../store-assets/screenshot-3.png'

const screenshots = [
  { src: screenshot1, title: 'Instant Stack Detection', desc: 'Identify CMS, frontend frameworks, servers & analytics in one click.' },
  { src: screenshot2, title: 'Layered Breakdown', desc: 'Results cleanly organized by category — from CMS to CDN and backend.' },
  { src: screenshot3, title: '420+ Technologies', desc: 'Comprehensive detection across 20+ technology categories.' },
]

const features = [
  { icon: '⚛️', title: 'Frontend Frameworks', description: 'Detect React, Vue, Angular, Svelte, Next.js, Nuxt, and more with high accuracy.' },
  { icon: '📦', title: 'JavaScript Libraries', description: 'Identify jQuery, Lodash, D3, Three.js, and hundreds of other popular libraries.' },
  { icon: '📝', title: 'CMS Platforms', description: 'Recognise WordPress, Shopify, Webflow, Ghost, Contentful, Sanity, and others.' },
  { icon: '🛒', title: 'E-commerce', description: 'Detect Shopify, WooCommerce, Magento, BigCommerce, and other storefronts.' },
  { icon: '📊', title: 'Analytics & Tracking', description: 'See what analytics tools are active: GA4, Plausible, Hotjar, Mixpanel, and more.' },
  { icon: '⚡', title: 'CDN & Performance', description: 'Identify content delivery networks, edge platforms, and performance tooling.' },
  { icon: '🖥️', title: 'Hosting & Infrastructure', description: 'Uncover hosting providers, cloud platforms, and server technology.' },
  { icon: '🔧', title: 'Other Technologies', description: 'Tag managers, A/B testing tools, fonts, payment gateways, and more.' },
]

const steps = [
  { n: '01', title: 'Visit any website', body: 'Navigate to the site you want to inspect in Chrome.' },
  { n: '02', title: 'Click the extension icon', body: 'Open StackPicker from the Chrome toolbar.' },
  { n: '03', title: 'See the full stack', body: 'Technologies are identified and grouped by category instantly.' },
]

export default function StackPicker() {
  return (
    <>
      <PageMeta
        title="StackPicker"
        description="Detect frontend frameworks, libraries, CMS, analytics, CDN, and infrastructure used by any website."
        path="/stackpicker"
      />

      {/* Hero Banner */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-2 shadow-lg shadow-indigo-500/10 backdrop-blur-sm">
                <img src={logo} alt="StackPicker Logo" className="h-full w-full object-contain rounded-xl" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Chrome Extension
                </div>
                <h2 className="text-sm font-medium text-zinc-400 mt-1">StackPicker Official Tool</h2>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
              See the tech stack behind<br />
              <span className="text-indigo-400">any website.</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400 leading-relaxed">
              StackPicker identifies the technologies powering any site — frameworks, libraries, CMS, analytics, infrastructure — all in one click.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ChromeButton href={CHROME_STORE_URL_STACKPICKER} accent="indigo" size="lg" />
              <Link to="/stackpicker/support" className="inline-flex items-center rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition">
                Support
              </Link>
            </div>
          </div>

          {/* Banner Right Image: Logo Showcase Card */}
          <div className="shrink-0 w-full md:w-80 lg:w-96">
            <div className="group relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/60 via-zinc-900/80 to-zinc-950 p-6 shadow-2xl shadow-indigo-500/10 transition duration-300 hover:border-indigo-500/60 hover:shadow-indigo-500/20">
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all" />
              <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-indigo-500/20 bg-zinc-950/80 p-8 shadow-inner overflow-hidden">
                <img
                  src={logo}
                  alt="StackPicker Extension Logo"
                  className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(99,102,241,0.4)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">StackPicker Logo</h3>
                  <p className="text-xs text-zinc-400">Official Chrome Extension Icon</p>
                </div>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">v1.0</span>
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
            <p className="mt-2 text-zinc-400">Actual screenshots from the Chrome Web Store extension popup.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {screenshots.map((item, i) => (
              <div key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 transition hover:border-indigo-500/40">
                <div className="overflow-hidden bg-zinc-950">
                  <img
                    src={item.src}
                    alt={`StackPicker screenshot ${i + 1}`}
                    className="w-full object-cover transition duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between border-t border-zinc-800/80">
                  <div>
                    <h3 className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
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
          <h2 className="text-2xl font-bold text-zinc-100">What it detects</h2>
          <p className="mt-2 text-zinc-400">Identifies technologies across every major category.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <FeatureCard key={f.title} {...f} accent="indigo" />
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
                <span className="text-2xl font-bold text-indigo-500/40 shrink-0">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-zinc-100">{s.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy callout */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <h3 className="font-semibold text-zinc-100">Privacy first</h3>
            <p className="mt-1 text-sm text-zinc-400">
              StackPicker runs entirely in your browser. No data is sent to external servers. No account required.
            </p>
          </div>
          <Link to="/stackpicker/privacy" className="shrink-0 text-sm text-indigo-400 hover:text-indigo-300 transition">
            Read privacy policy →
          </Link>
        </div>
      </section>

      {/* Bottom Featured Screenshot Showcase & CTA */}
      <section className="border-t border-zinc-800 bg-zinc-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Visual Stack Inspector
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                  Start inspecting websites today
                </h2>
                <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                  Discover frontend frameworks, CMS platforms, backend infrastructure, and analytics behind any website in real time with our powerful browser extension.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ChromeButton href={CHROME_STORE_URL_STACKPICKER} accent="indigo" size="lg" />
                  <span className="text-xs text-zinc-500 font-medium">Free • No sign-up required</span>
                </div>
              </div>

              {/* Newly Created Screenshot Preview */}
              <div className="relative group overflow-hidden rounded-2xl border border-indigo-500/30 bg-zinc-900 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="ml-2 flex-1 rounded-md bg-zinc-950 px-3 py-1 text-[11px] font-mono text-zinc-400 text-center truncate border border-zinc-800">
                    chrome-extension://stackpicker/preview
                  </div>
                </div>
                <div className="overflow-hidden bg-zinc-950">
                  <img
                    src={screenshot1}
                    alt="StackPicker Extension Preview"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


