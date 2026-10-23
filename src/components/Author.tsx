import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, PORTFOLIO_URL } from '../constants'

const career: [string, string, string][] = [
  ['2022 – now', 'Web Developer', 'Digitalbuddha Info Solutions LLP'],
  ['2021 – 2022', 'Junior Web Developer (intern)', 'Geniies IT & Services'],
  ['2020 – 2022', 'MCA', 'RVS CAS, Coimbatore'],
]

const skills = ['React', 'Next.js', 'Three.js', 'GSAP', 'Node.js', 'MongoDB', 'WordPress', 'AWS']

export default function Author() {
  return (
    <section id="author" className="scroll-mt-14 border-t border-rule">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-36">
        <div>
          <p className="eyebrow">About the maker</p>
          <h2 data-fx="type" className="display mt-6 text-[clamp(2.75rem,6.5vw,6rem)]">
            Built by Jyothis Manoj.
          </h2>
          <p className="mt-6 font-mono text-sm text-dim">Full-stack and creative web developer</p>
        </div>

        <div data-fx="rise" className="lg:pt-4">
          <p className="text-xl leading-relaxed text-ink">
            I design and build software end to end: e-commerce stores, dashboards, 3D and AR product experiences,
            email systems and browser tools, from the first sketch to deployment on AWS.
          </p>
          <p className="mt-5 leading-relaxed">
            StackPicker, WebHarvest and Jo are my own products. If your team needs a custom extension, an internal
            tool or a website built the same way, my client work and contact details are on my portfolio.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {skills.map(s => <li key={s} className="chip">{s}</li>)}
          </ul>

          <ol className="mt-10 border-t border-rule">
            {career.map(([when, role, where]) => (
              <li key={role} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-rule py-3.5 text-sm sm:grid-cols-[8.5rem_1fr]">
                <span className="font-mono text-dim">{when}</span>
                <span><span className="text-ink">{role}</span> · {where}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
              See my portfolio ↗
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">GitHub</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">LinkedIn</a>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Project enquiry`} className="btn btn-line">Discuss a project</a>
          </div>
        </div>
      </div>
    </section>
  )
}
