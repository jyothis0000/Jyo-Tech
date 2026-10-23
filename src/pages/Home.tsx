import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import Datasheet from '../components/Datasheet'
import StoreButton from '../components/StoreButton'
import Author from '../components/Author'
import { SITE_NAME } from '../constants'
import { brandStyle, categories, products, type Product } from '../products'

const [stackpicker, webharvest, jo] = products

const proof: [string, string][] = [
  ['3,599', 'technology fingerprints StackPicker can recognise'],
  ['6', 'data types per WebHarvest scan, from products to SEO'],
  ['20+', 'currencies and price formats read correctly'],
  ['0', 'servers of ours your data passes through'],
]

const reasons: [string, string][] = [
  ['Private by design', 'Every tool works on your own device. There is no account to create and no server of ours that sees what you browse, scan or type.'],
  ['Useful in seconds', 'One click on a toolbar icon, one press of Scan page, one keyboard shortcut. No setup, no training, no dashboards to learn.'],
  ['Exports your team already uses', 'Results copy straight into a spreadsheet, or save as CSV, JSON or Word for your CRM, catalogue or report.'],
]

const line = (i: number) => ({ '--i': i }) as React.CSSProperties

export default function Home() {
  const [extensions, software] = categories

  return (
    <>
      <PageMeta
        title={SITE_NAME}
        description="Research and productivity tools by Jyothis Manoj: StackPicker and WebHarvest for Chrome, and Jo, a private AI assistant for Windows."
      />

      <section className="relative overflow-hidden">
        <div data-depth="-0.12" className="hero-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-6xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 sm:pb-20">
          <p data-depth="0.08" className="eyebrow">Research and productivity tools</p>
          <h1 data-depth="0.18" className="display mt-6 text-[clamp(3rem,9vw,8.5rem)]">
            <span className="rise"><span style={line(0)}>Faster <span style={brandStyle(stackpicker)} className="brand-text">research.</span></span></span>
            <span className="rise"><span style={line(1)}>Cleaner <span style={brandStyle(webharvest)} className="brand-text">data.</span></span></span>
            <span className="rise"><span style={line(2)}>Private <span style={brandStyle(jo)} className="brand-text">AI.</span></span></span>
          </h1>

          <div data-depth="0.06" className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed">
              Two Chrome extensions that turn any website into answers and spreadsheets, and a Windows assistant
              that runs AI on your own PC. Built to cut repetitive work, without handing your data to anyone.
            </p>
            <ul className="grid gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-2">
              {categories.map((c, i) => (
                <li key={c.key}>
                  <a href={`#${c.key}`} className="group flex h-full items-baseline gap-4 bg-page px-5 py-4 transition-colors hover:bg-plate">
                    <span className="eyebrow">0{i + 1}</span>
                    <span className="font-medium text-ink">{c.title}</span>
                    <span className="ml-auto font-mono text-sm text-dim">{c.products.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-plate/60">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
          {proof.map(([value, label], i) => (
            <div key={label} data-fx="rise" className={`py-8 pr-6 ${i % 2 ? 'pl-6 border-l border-rule' : ''} lg:border-l lg:border-rule lg:pl-6 ${i === 0 ? 'lg:border-l-0 lg:pl-0' : ''}`}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <span data-fx="count" className="display block text-[clamp(2.2rem,4vw,3.4rem)] tabular-nums">{value}</span>
                <span className="mt-2 block text-sm leading-snug">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id={extensions.key} className="scroll-mt-14">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:pt-32">
          <CategoryHead index={1} title={extensions.title} blurb={extensions.blurb} />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {extensions.products.map(p => <ExtensionCard key={p.key} p={p} />)}
          </div>
        </div>
      </section>

      <section id={software.key} className="scroll-mt-14 border-t border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6 lg:pt-32">
          <CategoryHead index={2} title={software.title} blurb={software.blurb} />
        </div>
        {software.products.map(p => <SoftwareFeature key={p.key} p={p} />)}
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="max-w-3xl">
            <p className="eyebrow">Why teams use them</p>
            <h2 data-fx="title" className="display mt-4 text-[clamp(2.4rem,5.5vw,4.6rem)]">Less copy-paste. Fewer tabs. Nothing leaked.</h2>
          </div>
          <div data-fx="rise" className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-rule md:grid-cols-3">
            {reasons.map(([title, body], i) => (
              <div key={title} className="bg-page p-7 sm:p-9">
                <span className="font-mono text-sm text-dim">0{i + 1}</span>
                <h3 className="mt-8 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Author />
    </>
  )
}

function CategoryHead({ index, title, blurb }: { index: number; title: string; blurb: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
      <div>
        <p className="eyebrow">Category 0{index}</p>
        <h2 data-fx="title" className="display mt-4 text-[clamp(2.6rem,6.5vw,5.8rem)]">{title}</h2>
      </div>
      <p data-fx="rise" className="max-w-md leading-relaxed lg:justify-self-end">{blurb}</p>
    </div>
  )
}

function UseCases({ p, limit }: { p: Product; limit?: number }) {
  return (
    <ul className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {p.useCases.slice(0, limit).map(([title, body]) => (
        <li key={title} className="border-t border-rule pt-3">
          <p className="font-medium text-ink">{title}</p>
          <p className="mt-1 text-sm leading-relaxed">{body}</p>
        </li>
      ))}
    </ul>
  )
}

function ExtensionCard({ p }: { p: Product }) {
  return (
    <article style={brandStyle(p)} className="brand brand-wash flex flex-col rounded-[28px] p-3 shadow-[inset_0_0_0_1px_var(--color-rule)] sm:p-4">
      <div data-fx="figure">
        <p.Figure fig={p.fig} />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-4 pt-8 sm:px-5">
        <div className="flex items-center gap-3">
          <img src={p.icon} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <p className="eyebrow">{p.name} · {p.kind}</p>
        </div>
        <h3 className="display mt-5 text-[clamp(2rem,3.4vw,2.9rem)]">
          <Link to={p.path} className="brand-text">{p.pitch}</Link>
        </h3>
        <p className="mt-4 leading-relaxed">{p.lede}</p>
        <UseCases p={p} limit={2} />
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <StoreButton store={p.store} />
          <Link to={p.path} className="btn btn-line">Explore {p.name}</Link>
        </div>
      </div>
    </article>
  )
}

function SoftwareFeature({ p }: { p: Product }) {
  return (
    <div style={brandStyle(p)} className="brand brand-wash mt-14">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14 lg:py-24">
        <div data-fx="figure">
          <p.Figure fig={p.fig} />
        </div>
        <div data-fx="rise" className="lg:pt-6">
          <div className="flex items-center gap-3">
            <img src={p.icon} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
            <p className="eyebrow">{p.name} · {p.kind}</p>
          </div>
          <h3 className="display mt-5 text-[clamp(2.4rem,4.6vw,3.8rem)]">
            <Link to={p.path} className="brand-text">{p.pitch}</Link>
          </h3>
          <p className="mt-5 text-lg leading-relaxed">{p.lede}</p>
          <div className="mt-8">
            <Datasheet rows={p.specs.slice(0, 4)} />
          </div>
          <UseCases p={p} limit={2} />
          <div className="mt-8 flex flex-wrap gap-3">
            <StoreButton store={p.store} />
            <Link to={p.path} className="btn btn-line">Explore {p.name}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
