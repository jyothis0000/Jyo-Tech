import PageMeta from '../components/PageMeta'
import FAQ from '../components/FAQ'
import { CONTACT_EMAIL, CHROME_STORE_URL_WEBHARVEST } from '../constants'

const faqItems = [
  {
    q: 'Which browsers does WebHarvest support?',
    a: 'WebHarvest is a Chrome extension and works on Google Chrome and Chromium-based browsers such as Microsoft Edge and Brave.',
  },
  {
    q: 'Can I extract images from any website?',
    a: 'WebHarvest can extract images that are publicly loaded by the page you are viewing. Images behind authentication, paywalls, or that require cookies/sessions to access will only be accessible if you are already logged in and the browser has loaded them.',
  },
  {
    q: 'Why are some colors not detected?',
    a: 'Color extraction reads computed CSS styles. Colors applied via images, canvas elements, or SVG fills may not always appear in the palette.',
  },
  {
    q: 'Is any data sent externally?',
    a: 'No. All extraction runs locally in your browser. Nothing is ever sent to a server or third party.',
  },
  {
    q: 'Can I save extracted assets directly?',
    a: 'You can copy values to your clipboard. Direct file saving depends on the file type and Chrome\'s download permissions — the extension will use Chrome\'s built-in download API where applicable.',
  },
  {
    q: 'How do I update the extension?',
    a: 'Chrome updates extensions automatically. You can also go to chrome://extensions, enable "Developer mode", and click "Update" to force an immediate update.',
  },
]

const knownIssues = [
  'Assets loaded inside cross-origin iframes may not be fully accessible due to browser security restrictions.',
  'Dynamically generated colors (e.g. via JavaScript canvas) may not appear in the color palette.',
  'Very large pages with hundreds of images may take a moment to process.',
]

export default function WebHarvestSupport() {
  return (
    <>
      <PageMeta
        title="WebHarvest Support"
        description="WebHarvest installation help, troubleshooting, FAQ, and contact information."
        path="/webharvest/support"
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-12">
          <span className="eyebrow">WebHarvest</span>
          <h1 className="mt-2 display text-4xl sm:text-5xl">Support</h1>
          <p className="mt-2 text-body">Installation help, troubleshooting, and contact information.</p>
        </div>

        {/* Installation */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-ink mb-4">Installation</h2>
          <ol className="space-y-3 text-sm text-body">
            <li className="flex gap-3"><span className="text-ink font-semibold shrink-0">1.</span>Visit the <a href={CHROME_STORE_URL_WEBHARVEST} target="_blank" rel="noopener noreferrer" className="text-ink hover:underline">Chrome Web Store listing</a>.</li>
            <li className="flex gap-3"><span className="text-ink font-semibold shrink-0">2.</span>Click <strong className="text-ink">Add to Chrome</strong> and confirm the permissions dialog.</li>
            <li className="flex gap-3"><span className="text-ink font-semibold shrink-0">3.</span>Pin the extension from the Chrome toolbar for easy access.</li>
            <li className="flex gap-3"><span className="text-ink font-semibold shrink-0">4.</span>Navigate to any website and click the WebHarvest icon to start extracting.</li>
          </ol>
        </section>

        {/* Troubleshooting */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-ink mb-4">Troubleshooting</h2>
          <div className="space-y-4 text-sm text-body">
            <div className="rounded-xl border border-rule bg-plate p-4">
              <p className="font-medium text-ink mb-1">Extension icon is greyed out</p>
              <p>WebHarvest cannot run on Chrome system pages (chrome://, chrome-extension://, or the new tab page). Navigate to a regular website first.</p>
            </div>
            <div className="rounded-xl border border-rule bg-plate p-4">
              <p className="font-medium text-ink mb-1">No assets shown</p>
              <p>Try refreshing the page and reopening the extension. Pages that load content lazily may need a moment before all assets are available.</p>
            </div>
            <div className="rounded-xl border border-rule bg-plate p-4">
              <p className="font-medium text-ink mb-1">Extension not appearing after install</p>
              <p>Click the puzzle-piece icon in your Chrome toolbar and pin WebHarvest to make it always visible.</p>
            </div>
          </div>
        </section>

        {/* Known issues */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-ink mb-4">Known issues</h2>
          <ul className="space-y-2">
            {knownIssues.map(issue => (
              <li key={issue} className="flex items-start gap-2 text-sm text-body">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dim" />
                {issue}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-ink mb-4">Frequently asked questions</h2>
          <FAQ items={faqItems} />
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-4">Feature requests &amp; bug reports</h2>
          <p className="text-sm text-body mb-4">
            Have a feature idea or found a bug? Email us with the website URL, what you expected to see, and what happened instead.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=WebHarvest%20Feedback`}
            className="inline-flex items-center gap-2 rounded-lg border border-rule-strong bg-raised px-5 py-2.5 text-sm font-medium text-ink hover:bg-plate transition"
          >
            Contact support
          </a>
        </section>
      </div>
    </>
  )
}
