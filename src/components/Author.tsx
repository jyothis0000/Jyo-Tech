import makerCharacter from '../assets/maker-character.webp'
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, PORTFOLIO_URL } from '../constants'

const skills = ['React', 'Next.js', 'Three.js', 'GSAP', 'Node.js', 'MongoDB', 'WordPress', 'AWS']

export default function Author() {
  return (
    <section id="author" className="scroll-mt-14 border-t border-rule">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-32">
        <img
          data-fx="character"
          data-on="scroll"
          src={makerCharacter}
          alt="The lab's cartoon scientist waving from his desk chair, laptop of code and a bubbling flask beside him"
          width={1061}
          height={1159}
          loading="lazy"
          draggable={false}
          className="mx-auto w-full max-w-[24rem] select-none lg:max-w-none"
        />

        <div>
          <p className="eyebrow">About the maker</p>
          <h2 data-fx="type" className="display mt-5 text-[clamp(2.6rem,5vw,4.6rem)]">
            Built by Jyothis Manoj.
          </h2>
          <p className="mt-4 font-mono text-sm text-dim">Full-stack and creative web developer</p>

          <div data-fx="rise" className="mt-8">
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

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
              See my portfolio ↗
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">GitHub</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">LinkedIn</a>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Project enquiry`} className="btn btn-line">Discuss a project</a>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
