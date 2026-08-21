import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CHROME_STORE_URL_STACKPICKER } from '../constants'

const links = [
  { label: 'Tools', to: '/' },
  { label: 'StackPicker', to: '/stackpicker' },
  { label: 'WebHarvest', to: '/webharvest' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const chromeUrl = location.pathname.startsWith('/webharvest')
    ? '#'
    : CHROME_STORE_URL_STACKPICKER

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-zinc-100 hover:text-white">
          <span className="text-lg tracking-tight">jyo tech</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={chromeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
          >
            Add to Chrome
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-zinc-400 transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-zinc-400 transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-zinc-400 transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-zinc-800 px-6 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {links.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a
            href={chromeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block rounded-md bg-zinc-100 px-4 py-2 text-center text-sm font-medium text-zinc-900"
            onClick={() => setOpen(false)}
          >
            Add to Chrome
          </a>
        </div>
      )}
    </header>
  )
}
