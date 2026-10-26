import { Link } from 'react-router-dom'
import logo from '../assets/jo-labs-logo.webp'
import SmartLink from './SmartLink'
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, PORTFOLIO_URL, SITE_NAME } from '../constants'
import { categories } from '../products'

const author = [
  { label: 'Portfolio', href: PORTFOLIO_URL },
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'LinkedIn', href: LINKEDIN_URL },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt={SITE_NAME} width={130} height={80} loading="lazy" className="h-20 w-auto" />
          </Link>
          <p className="mt-4 text-sm">Tools for the web and the desktop, by Jyothis Manoj.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="link mt-1 inline-block text-sm">{CONTACT_EMAIL}</a>
        </div>

        {categories.map(c => (
          <div key={c.key}>
            <p className="eyebrow">{c.title}</p>
            <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))]">
              {c.products.map(p => (
                <li key={p.key}>
                  <Link to={p.path} className="text-ink hover:text-lit">{p.name}</Link>
                  <ul className="mt-2 space-y-1.5">
                    {p.links.map(l => (
                      <li key={l.to}><SmartLink to={l.to} className="hover:text-ink">{l.label}</SmartLink></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow">Author</p>
          <ul className="mt-4 space-y-2 text-sm">
            {author.map(a => (
              <li key={a.label}><a href={a.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{a.label} ↗</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="eyebrow mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-3 px-4 py-5 sm:px-6">
          <span>© {new Date().getFullYear()} Jyothis Manoj</span>
          <span>
            Figures drawn with <a href="https://skills.wheresryan.sh/anatomy" target="_blank" rel="noopener noreferrer" className="hover:text-ink">Anatomy</a> (MIT)
          </span>
        </div>
      </div>
    </footer>
  )
}
