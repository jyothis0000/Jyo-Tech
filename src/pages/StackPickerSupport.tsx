import PageMeta from '../components/PageMeta'
import FAQ from '../components/FAQ'
import { CONTACT_EMAIL, CHROME_STORE_URL_STACKPICKER } from '../constants'

const faqItems = [
  {
    q: 'Which browsers does StackPicker support?',
    a: 'StackPicker is a Chrome extension and works on Google Chrome and Chromium-based browsers such as Microsoft Edge and Brave.',
  },
  {
    q: 'Why is a technology not being detected?',
    a: 'Some technologies are loaded dynamically or obfuscated. Detection accuracy depends on the signals available in the page source and response headers. If a technology is consistently missed, please report it via the bug report form below.',
  },
  {
    q: 'Does StackPicker work on all websites?',
    a: 'StackPicker works on most public websites. Some sites with strict Content Security Policies (CSP) may limit the signals available for detection.',
  },
  {
    q: 'Is any data sent to a server?',
    a: 'No. All detection runs locally in your browser. No page data is ever transmitted externally.',
  },
  {
    q: 'How do I update the extension?',
    a: 'Chrome updates extensions automatically. You can also go to chrome://extensions, enable "Developer mode", and click "Update" to force an immediate update.',
  },
]

const knownIssues = [
  'Detection may be incomplete on single-page apps that load content after the initial page render.',
  'Sites using aggressive code minification or bundling may have lower detection accuracy.',
  'Some technologies loaded via iframes are not currently inspected.',
]

export default function StackPickerSupport() {
  return (
    <>
      <PageMeta
        title="StackPicker Support"
        description="StackPicker installation help, troubleshooting, FAQ, and contact information."
        path="/stackpicker/support"
      />

      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-indigo-400">StackPicker</span>
          <h1 className="mt-2 text-3xl font-bold text-zinc-100">Support</h1>
          <p className="mt-2 text-zinc-400">Installation help, troubleshooting, and contact information.</p>
        </div>

        {/* Installation */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Installation</h2>
          <ol className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3"><span className="text-indigo-400 font-semibold shrink-0">1.</span>Visit the <a href={CHROME_STORE_URL_STACKPICKER} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Chrome Web Store listing</a>.</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-semibold shrink-0">2.</span>Click <strong className="text-zinc-200">Add to Chrome</strong> and confirm the permissions dialog.</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-semibold shrink-0">3.</span>Pin the extension from the Chrome toolbar for easy access.</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-semibold shrink-0">4.</span>Navigate to any website and click the StackPicker icon to start detecting.</li>
          </ol>
        </section>

        {/* Troubleshooting */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Troubleshooting</h2>
          <div className="space-y-4 text-sm text-zinc-400">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="font-medium text-zinc-200 mb-1">Extension icon is greyed out</p>
              <p>StackPicker cannot run on Chrome system pages (chrome://, chrome-extension://, or the new tab page). Navigate to a regular website first.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="font-medium text-zinc-200 mb-1">No results shown</p>
              <p>Try refreshing the page and reopening the extension. Some pages may require a full reload before all technologies are detectable.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="font-medium text-zinc-200 mb-1">Extension not appearing after install</p>
              <p>Click the puzzle-piece icon in your Chrome toolbar and pin StackPicker to make it always visible.</p>
            </div>
          </div>
        </section>

        {/* Known issues */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Known issues</h2>
          <ul className="space-y-2">
            {knownIssues.map(issue => (
              <li key={issue} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                {issue}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Frequently asked questions</h2>
          <FAQ items={faqItems} />
        </section>

        {/* Feature requests & bug reports */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Feature requests &amp; bug reports</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Have a feature idea or found a bug? Email us with as much detail as possible — the website URL, what you expected to see, and what happened instead.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=StackPicker%20Feedback`}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition"
          >
            Contact support
          </a>
        </section>
      </div>
    </>
  )
}
