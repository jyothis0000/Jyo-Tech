import PageMeta from '../components/PageMeta'
import { CONTACT_EMAIL } from '../constants'

// Mirrors PRIVACY.md in the Bunny AI Assistant repo; update both together.
export default function BunnyPrivacy() {
  return (
    <>
      <PageMeta
        title="Bunny AI Assistant Privacy Policy"
        description="What Bunny AI Assistant keeps on your PC, and when it uses the internet."
        path="/bunny/privacy"
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10">
          <span className="eyebrow">Bunny AI Assistant</span>
          <h1 className="mt-2 display text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-dim">Last updated: 22 October 2026</p>
        </div>

        <div className="space-y-8">
          <Section title="Overview">
            <p>
              Bunny AI Assistant ("Bunny", "the app") is made by Jyothis Manoj. This policy explains what the app does with your
              information. In short: <strong className="text-ink">Bunny works on your PC, keeps your data on your PC, and only sends
              something over the internet when you turn on a feature that needs it.</strong> We do not run servers that receive
              your data, and the app contains no analytics, tracking or advertising.
            </p>
          </Section>

          <Section title="What stays on your PC">
            <ul>
              <li><strong className="text-ink">Chats</strong> with the built-in AI model (Qwen2.5 1.5B). The model runs entirely on your computer; your messages are not sent anywhere.</li>
              <li><strong className="text-ink">Chat history, settings and theme</strong> are stored in the app's folder on your PC.</li>
              <li><strong className="text-ink">Notes and note reminders</strong> are stored in <code>notes.json</code> in the app's folder on your PC.</li>
              <li><strong className="text-ink">Device commands</strong> (Bluetooth, Wi-Fi, volume, brightness, dark mode, lock, screenshots, opening apps and Settings pages) run on your PC. To open apps by name, Bunny reads the list of apps in your Start menu locally; that list never leaves your PC.</li>
            </ul>
          </Section>

          <Section title="When the app uses the internet">
            <ul>
              <li><strong className="text-ink">First run:</strong> the app downloads the free AI model file (about 1.1 GB) from Hugging Face (huggingface.co). Hugging Face sees a normal download request (such as your IP address), as with any download. No personal data is included.</li>
              <li><strong className="text-ink">Paid AI models (optional):</strong> if you add an API key for OpenAI, Anthropic, Google Gemini, Groq or OpenRouter and choose that model (or a backup), the messages of that conversation are sent to <strong className="text-ink">that provider only</strong>, under their privacy policy and your agreement with them.</li>
              <li><strong className="text-ink">Google Calendar (optional):</strong> if you connect your calendar, the app downloads your calendar's private iCal address from Google every few minutes to show reminders and your agenda. It only <strong className="text-ink">reads</strong> events and never changes your calendar.</li>
              <li><strong className="text-ink">Links you click</strong> (for example "Join meeting") open in your browser.</li>
            </ul>
          </Section>

          <Section title="Secrets">
            <p>
              API keys and your Google Calendar private address are stored in <strong className="text-ink">Windows Credential
              Manager</strong>, encrypted by Windows for your user account. They are only ever sent to the service they belong to.
              You can remove them at any time in Settings.
            </p>
          </Section>

          <Section title="Your control">
            <ul>
              <li>Clear your chat history at any time with <strong className="text-ink">Clear</strong> in the chat.</li>
              <li>Delete notes in the Notes tab.</li>
              <li>Remove API keys and disconnect Google Calendar in Settings.</li>
              <li>Uninstalling the app removes the app. To also remove your data, delete the app's folder in <code>%APPDATA%\com.jyothismanoj.jo</code> and <code>%LOCALAPPDATA%\com.jyothismanoj.jo</code>.</li>
            </ul>
          </Section>

          <Section title="Children">
            <p>The app is not directed at children under 13 and does not knowingly collect their data.</p>
          </Section>

          <Section title="Changes">
            <p>If this policy changes, the new version will be published at this address with a new date.</p>
          </Section>

          <Section title="Contact">
            <p><a href={`mailto:${CONTACT_EMAIL}`} className="link">{CONTACT_EMAIL}</a></p>
          </Section>
        </div>
      </article>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-body [&_code]:font-mono [&_code]:text-ink [&_li]:ml-4 [&_li]:list-disc [&_ul]:space-y-2">{children}</div>
    </section>
  )
}
