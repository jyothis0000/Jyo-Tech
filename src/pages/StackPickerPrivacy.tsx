import PageMeta from '../components/PageMeta'
import { CONTACT_EMAIL } from '../constants'

export default function StackPickerPrivacy() {
  return (
    <>
      <PageMeta
        title="StackPicker Privacy Policy"
        description="StackPicker privacy policy — what data is accessed, processed, and stored."
        path="/stackpicker/privacy"
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-10">
          <span className="eyebrow">StackPicker</span>
          <h1 className="mt-2 display text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-dim">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-zinc prose-invert space-y-8">
          <Section title="Overview">
            StackPicker is a browser extension that identifies the technologies used by websites you visit. We are committed to your privacy. This policy explains exactly what information the extension accesses and how it is handled.
          </Section>

          <Section title="What information is accessed">
            <p>StackPicker reads the following from pages you visit:</p>
            <ul>
              <li>The page's HTML source and DOM structure</li>
              <li>Script and stylesheet URLs loaded by the page</li>
              <li>HTTP response headers (where available via browser APIs)</li>
              <li>Cookies names (not values) and storage keys for framework detection</li>
            </ul>
            <p>This information is accessed only when you actively open the StackPicker panel on a page.</p>
          </Section>

          <Section title="What is processed and where">
            All detection logic runs locally in your browser. No page data, URLs, or analysis results are ever transmitted to an external server or third party. Processing happens entirely on your device.
          </Section>

          <Section title="Data storage">
            StackPicker does not persistently store any browsing data or page content. Detected results are held in memory only for the duration of the current browser session and are discarded when you close the tab or browser.
          </Section>

          <Section title="Third-party services">
            StackPicker does not use any third-party analytics, crash reporting, or telemetry services. No external requests are made by the extension.
          </Section>

          <Section title="Permissions">
            <p>StackPicker requests the following Chrome permissions:</p>
            <ul>
              <li><strong>activeTab</strong> — to read the current page's content when you open the extension panel.</li>
              <li><strong>scripting</strong> — to inject detection scripts into the active tab.</li>
              <li><strong>webRequest / declarativeNetRequest</strong> (if applicable) — to read response headers for server-side technology detection.</li>
            </ul>
            <p>These permissions are used solely for technology detection and nothing else.</p>
          </Section>

          <Section title="Children's privacy">
            StackPicker is not directed at children under 13 and does not knowingly collect any information from minors.
          </Section>

          <Section title="Changes to this policy">
            If this policy changes materially, we will update the date at the top of this page.
          </Section>

          <Section title="Contact">
            Questions about this policy? Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink hover:underline">{CONTACT_EMAIL}</a>.
          </Section>
        </div>
      </article>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-body space-y-3">{children}</div>
    </section>
  )
}
