import PageMeta from '../components/PageMeta'
import { CONTACT_EMAIL } from '../constants'

export default function WebHarvestPrivacy() {
  return (
    <>
      <PageMeta
        title="WebHarvest Privacy Policy"
        description="WebHarvest privacy policy — what data is accessed, processed, and stored."
        path="/webharvest/privacy"
      />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-emerald-400">WebHarvest</span>
          <h1 className="mt-2 text-3xl font-bold text-zinc-100">Privacy Policy</h1>
          <p className="mt-2 text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-8">
          <Section title="Overview">
            WebHarvest is a browser extension that helps you view and copy publicly accessible assets — such as images, colors, fonts, links, and metadata — from pages you visit. Your privacy is important to us. This policy describes what information the extension accesses and how it is handled.
          </Section>

          <Section title="What information is accessed">
            <p>WebHarvest reads the following from pages you visit:</p>
            <ul>
              <li>The page's DOM to extract visible images, SVGs, links, headings, and text</li>
              <li>Computed CSS styles to identify colors, fonts, and typography</li>
              <li>HTML metadata tags (title, description, Open Graph, etc.)</li>
              <li>Resource URLs for stylesheets, scripts, and fonts already loaded by the page</li>
            </ul>
            <p>This information is accessed only when you open the WebHarvest panel on a page.</p>
          </Section>

          <Section title="What is processed and where">
            All extraction and processing runs locally in your browser. No page content, URLs, images, or asset data are sent to any external server. Your browsing activity is never transmitted outside your device.
          </Section>

          <Section title="Data storage">
            WebHarvest does not store any browsing data or page content. Extracted results are held in memory only for the current session and are discarded when you close the panel, tab, or browser. No data is written to persistent storage.
          </Section>

          <Section title="Third-party services">
            WebHarvest does not use any third-party analytics, advertising, or telemetry services. The extension makes no external network requests of its own.
          </Section>

          <Section title="Permissions">
            <p>WebHarvest requests the following Chrome permissions:</p>
            <ul>
              <li><strong>activeTab</strong> — to read the current page's DOM and styles when you open the extension panel.</li>
              <li><strong>scripting</strong> — to inject asset-extraction scripts into the active tab.</li>
            </ul>
            <p>These permissions are used solely for asset extraction on the current tab when you explicitly activate the extension.</p>
          </Section>

          <Section title="What WebHarvest does not do">
            <ul>
              <li>It does not bypass authentication, paywalls, or access controls.</li>
              <li>It does not access content you cannot already see in your browser.</li>
              <li>It does not download or store files without your explicit action.</li>
              <li>It does not share any data with third parties.</li>
            </ul>
          </Section>

          <Section title="Children's privacy">
            WebHarvest is not directed at children under 13 and does not knowingly collect any information from minors.
          </Section>

          <Section title="Changes to this policy">
            If this policy changes materially, we will update the date at the top of this page.
          </Section>

          <Section title="Contact">
            Questions about this policy? Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 hover:underline">{CONTACT_EMAIL}</a>.
          </Section>
        </div>
      </article>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-100 mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-zinc-400 space-y-3">{children}</div>
    </section>
  )
}
