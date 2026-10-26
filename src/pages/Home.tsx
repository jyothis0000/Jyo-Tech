import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import Datasheet from '../components/Datasheet'
import StoreButton from '../components/StoreButton'
import Author from '../components/Author'
import labCharacter from '../assets/lab-character.webp'
import scientistReach from '../assets/lab/scientist-reach.webp'
import Decor, { type Art } from '../components/Decor'
import { CONTACT_EMAIL, PORTFOLIO_URL, SITE_NAME } from '../constants'
import { brandStyle, categories, type Product } from '../products'

const proof: [string, string][] = [
  ['3,599', 'technology fingerprints StackPicker can recognise'],
  ['6', 'data types per WebHarvest scan, from products to SEO'],
  ['20+', 'currencies and price formats read correctly'],
  ['0', 'servers of ours your data passes through'],
]

const reasonArt: Art[] = ['splatPink', 'bolt', 'splatGreen']

const reasons: [string, string][] = [
  ['Private by design', 'Every tool works on your own device. There is no account to create and no server of ours that sees what you browse, scan or type.'],
  ['Useful in seconds', 'One click on a toolbar icon, one press of Scan page, one keyboard shortcut. No setup, no training, no dashboards to learn.'],
  ['Exports your team already uses', 'Results copy straight into a spreadsheet, or save as CSV, JSON or Word for your CRM, catalogue or report.'],
]

export default function Home() {
  const [extensions, software] = categories

  return (
    <>
      <PageMeta
        title={SITE_NAME}
        description="StackPicker and WebHarvest for Chrome, and Bunny for Windows: small tools by Jyothis Manoj that cut repetitive work."
      />

      <section className="relative overflow-hidden">
        <div data-depth="-0.12" className="hero-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-6xl items-end gap-6 px-4 pb-14 pt-16 sm:px-6 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
          <div className="lg:pb-6">
            <p data-depth="0.08" className="eyebrow">{SITE_NAME} · a one-person software lab</p>
            <div data-depth="0.16">
              <h1 data-fx="type" data-type-on="load" className="display mt-6 whitespace-nowrap text-[clamp(2.9rem,5.6vw,5.4rem)]">
                <span className="block">Experiments</span>
                <span className="block">that ship</span>
                <span className="block">as <span className="lab-text">tools.</span></span>
              </h1>
            </div>

            <div data-depth="0.06">
              <p className="mt-9 max-w-md text-lg leading-relaxed">
                Ideas get built, tested on real work, and released when they save real time.
              </p>
              <ul className="mt-9 grid max-w-lg gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-2">
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

          <Decor name="bubbles" className="absolute left-[47%] top-28 hidden w-9 lg:block" />
          <Decor name="sparkles" className="absolute left-[40%] top-[58%] hidden w-10 lg:block" />
          <Decor name="bubbles" className="absolute bottom-24 right-6 w-10 sm:w-12" />

          <div data-depth="0.1" className="relative mx-auto w-full max-w-[20rem] sm:max-w-[26rem] lg:max-w-none">
            <img
              data-fx="character"
              src={labCharacter}
              alt="Cartoon scientist in a lab coat and goggles, holding a bubbling flask, with lightning crackling around him"
              width={771}
              height={945}
              className="w-full select-none"
              draggable={false}
            />
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

      <section id={extensions.key} className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:pt-32">
          <CategoryHead index={1} title={extensions.title} blurb={extensions.blurb} sticker="testTube" />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {extensions.products.map(p => <ExtensionCard key={p.key} p={p} />)}
          </div>
        </div>
      </section>

      <section id={software.key} className="scroll-mt-20 border-t border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6 lg:pt-32">
          <CategoryHead index={2} title={software.title} blurb={software.blurb} sticker="flask" />
        </div>
        {software.products.map(p => <SoftwareFeature key={p.key} p={p} />)}
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="max-w-3xl">
            <p className="eyebrow">Why teams use them</p>
            <h2 data-fx="type" className="display mt-4 text-[clamp(2.4rem,5.5vw,4.6rem)]">Less copy-paste. Fewer tabs. Nothing leaked.</h2>
          </div>
          <div data-fx="rise" className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-rule md:grid-cols-3">
            {reasons.map(([title, body], i) => (
              <div key={title} className="relative bg-page p-7 sm:p-9">
                <Decor name={reasonArt[i]} className="absolute right-6 top-6 h-16 w-auto sm:h-20" />
                <span className="font-mono text-sm text-dim">0{i + 1}</span>
                <h3 className="mt-8 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-rule">
        <div className="lab-wash pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="relative">
            <Decor name="question" className="absolute -top-4 right-4 w-8 sm:right-16 sm:w-10" />
            <p className="eyebrow">Next experiment</p>
            <h2 data-fx="type" className="display mt-4 text-[clamp(2.4rem,5.4vw,4.6rem)]">Got a task that eats your week?</h2>
            <p data-fx="rise" className="mt-6 max-w-lg text-lg leading-relaxed">
              Tell me about it. If a browser extension, a desktop app or a small internal tool can take it off your
              plate, it is exactly the kind of thing this lab builds.
            </p>
            <div data-fx="rise" className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT_EMAIL}?subject=Tool idea`} className="btn btn-brand">Pitch an idea</a>
              <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">See my portfolio ↗</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
            <Decor name="burst" className="absolute -left-2 bottom-6 w-12 sm:w-16" />
            <div>
              <img
                data-fx="character"
                data-on="scroll"
                src={scientistReach}
                alt="The lab's scientist reaching out with one hand and holding up a bubbling flask in the other"
                width={760}
                height={701}
                loading="lazy"
                draggable={false}
                className="relative w-full select-none"
              />
            </div>
          </div>
        </div>
      </section>

      <Author />
    </>
  )
}

function CategoryHead({ index, title, blurb, sticker }: { index: number; title: string; blurb: string; sticker: Art }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
      <div>
        <p className="eyebrow">Category 0{index}</p>
        <h2 data-fx="type" className="display mt-4 text-[clamp(2.6rem,6.5vw,5.8rem)]">{title}</h2>
      </div>
      <div className="relative isolate max-w-md lg:justify-self-end">
        {/* Sits behind the description, faded, as a watermark. */}
        <div className="pointer-events-none absolute -right-2 -top-10 -z-10 w-16 opacity-35 sm:w-20" aria-hidden="true">
          <Decor name={sticker} className="w-full" />
        </div>
        <p data-fx="rise" className="relative leading-relaxed">{blurb}</p>
      </div>
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
    <article data-fx="card" style={brandStyle(p)} className="brand brand-wash flex flex-col rounded-[28px] p-3 shadow-[inset_0_0_0_1px_var(--color-rule)] sm:p-4">
      <p.Figure fig={p.fig} />
      <div className="flex flex-1 flex-col px-3 pb-4 pt-8 sm:px-5">
        <div className="flex items-center gap-3">
          <img src={p.icon} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <p className="eyebrow">{p.name} · {p.kind}</p>
        </div>
        <h3 className="display mt-5 text-balance text-[clamp(1.75rem,2.6vw,2.25rem)]">
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
        <div data-fx="card">
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
