import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-zinc-100">jyo tech</p>
            <p className="mt-2 text-sm text-zinc-500">Browser extensions for developers and designers.</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">StackPicker</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/stackpicker" className="text-zinc-400 hover:text-zinc-100">Overview</Link></li>
              <li><Link to="/stackpicker/privacy" className="text-zinc-400 hover:text-zinc-100">Privacy</Link></li>
              <li><Link to="/stackpicker/support" className="text-zinc-400 hover:text-zinc-100">Support</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">WebHarvest</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/webharvest" className="text-zinc-400 hover:text-zinc-100">Overview</Link></li>
              <li><Link to="/webharvest/privacy" className="text-zinc-400 hover:text-zinc-100">Privacy</Link></li>
              <li><Link to="/webharvest/support" className="text-zinc-400 hover:text-zinc-100">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Jyothis Manoj. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
