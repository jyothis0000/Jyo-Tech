import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CONTACT_EMAIL, PORTFOLIO_URL, SITE_NAME } from '../constants'
import { categories } from '../products'
import Mark from './Mark'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? 'text-ink underline decoration-rule-strong underline-offset-[6px]' : 'text-body hover:text-ink'}`

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-page/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Mark />
          <span className="display text-[15px] tracking-normal">{SITE_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {categories.map(c => (
            <li key={c.key} className="flex items-center gap-5">
              <span className="eyebrow">{c.key === 'extensions' ? 'Extensions' : 'Software'}</span>
              {c.products.map(p => (
                <NavLink key={p.key} to={p.path} className={linkClass}>{p.name}</NavLink>
              ))}
            </li>
          ))}
          <li>
            <Link to="/#author" className="text-sm text-body hover:text-ink">About</Link>
          </li>
          <li>
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line !py-2">Portfolio ↗</a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="-mr-2 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`block h-px w-5 bg-ink transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-ink transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-rule px-4 py-2 md:hidden">
          {categories.map(c => (
            <li key={c.key} className="border-b border-rule py-2">
              <p className="eyebrow pt-2">{c.title}</p>
              {c.products.map(p => (
                <NavLink key={p.key} to={p.path} onClick={() => setOpen(false)} className={({ isActive }) => `block py-2.5 text-lg ${isActive ? 'text-lit' : 'text-ink'}`}>
                  {p.name}
                </NavLink>
              ))}
            </li>
          ))}
          <li className="flex flex-wrap gap-3 py-4">
            <Link to="/#author" onClick={() => setOpen(false)} className="btn btn-line">About</Link>
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">Portfolio ↗</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-line">Email</a>
          </li>
        </ul>
      )}
    </header>
  )
}
