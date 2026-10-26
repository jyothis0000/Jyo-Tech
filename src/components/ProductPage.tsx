import PageMeta from './PageMeta'
import Datasheet from './Datasheet'
import StoreButton from './StoreButton'
import SmartLink from './SmartLink'
import Decor from './Decor'
import { brandStyle, type Product } from '../products'

export default function ProductPage({ product: p }: { product: Product }) {
  const privacy = p.links.find(l => l.label === 'Privacy')

  return (
    <div style={brandStyle(p)} className="brand">
      <PageMeta title={p.name} description={p.lede} path={p.path} />

      <div className="brand-wash">
      <header className="relative mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <Decor name={p.sticker} className="absolute right-4 top-10 w-20 sm:right-6 sm:w-28 lg:top-14 lg:w-36" />
        <div className="flex items-center gap-3">
          <img src={p.icon} alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
          <p className="eyebrow">{p.category === 'extension' ? 'Chrome extensions' : 'Software'} / {p.kind === 'Chrome extension' ? 'Extension' : p.kind} · v{p.version}</p>
        </div>
        <h1 data-fx="type" data-type-on="load" className="display mt-6 text-[clamp(3.5rem,11vw,9rem)]"><span className="brand-text">{p.name}</span></h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="display text-[clamp(1.6rem,3vw,2.4rem)]">{p.pitch}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">{p.lede}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <StoreButton store={p.store} />
            {p.links.filter(l => l !== privacy).map(l => (
              <SmartLink key={l.to} to={l.to} className="btn btn-line">{l.label}</SmartLink>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6">
        <p.Figure fig={p.fig} />
      </div>
      </div>

      <section className="border-t border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div>
            <p className="eyebrow">Who it is for</p>
            <h2 data-fx="type" className="display mt-4 text-[clamp(2.2rem,5vw,4rem)]">Built for real work</h2>
          </div>
          <ul data-fx="rise" className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-rule sm:grid-cols-2">
            {p.useCases.map(([title, body]) => (
              <li key={title} className="bg-page p-7 sm:p-9">
                <h3 className="brand-text inline-block text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-rule">
        <div data-fx="rise" className="mx-auto grid w-full max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="eyebrow">Specification</h2>
            <div className="mt-5">
              <Datasheet rows={p.specs} />
            </div>
          </div>
          <div>
            <h2 className="eyebrow">How it works</h2>
            <ol className="mt-5 border-t border-rule">
              {p.steps.map(([title, body], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-rule py-4">
                  <span className="font-mono text-sm text-dim">{i + 1}/{p.steps.length}</span>
                  <div>
                    <h3 className="font-medium text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 data-fx="type" className="display text-[clamp(2.2rem,5vw,4rem)]">{p.featuresTitle}</h2>
          <dl data-fx="rise" className="mt-10 grid gap-x-14 sm:grid-cols-2">
            {p.features.map(([term, detail]) => (
              <div key={term} className="border-t border-rule py-5">
                <dt className="font-medium text-ink">{term}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed">{detail}</dd>
              </div>
            ))}
          </dl>
          {p.shot ? (
            <figure className="mt-12">
              <img src={p.shot.src} alt={p.shot.alt} loading="lazy" className="w-full max-w-[430px] rounded-lg shadow-[0_0_0_1px_var(--color-rule-strong)]" />
              <figcaption className="mt-3 text-sm text-dim">{p.shot.caption}</figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="eyebrow">Privacy</h2>
            <p className="mt-3 leading-relaxed text-ink">{p.privacy}</p>
          </div>
          {privacy ? <SmartLink to={privacy.to} className="link shrink-0 text-sm">Read the privacy policy</SmartLink> : null}
        </div>
      </section>
    </div>
  )
}
