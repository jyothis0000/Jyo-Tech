import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Scroll-linked motion, declared in markup with data-fx:
//   figure   the plate tilts up from the desk and settles flat as it enters
//   rise     text eases up into place
//   drift    slow parallax while the element crosses the viewport
//   hero     the hero sinks back and fades as you scroll past it
//   progress a bar that fills with page progress
export default function ScrollFx() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-fx="figure"]').forEach(el => {
        gsap.fromTo(el,
          { rotateX: 24, scale: 0.86, y: 90, opacity: 0.25, transformPerspective: 1400, transformOrigin: '50% 100%' },
          { rotateX: 0, scale: 1, y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: 0.6 } },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-fx="rise"]').forEach(el => {
        gsap.from(el, { y: 48, opacity: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 62%', scrub: 0.5 } })
      })
      gsap.utils.toArray<HTMLElement>('[data-fx="drift"]').forEach(el => {
        gsap.fromTo(el, { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-fx="hero"]').forEach(el => {
        gsap.to(el, { y: 140, scale: 0.94, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      })
    })
    gsap.utils.toArray<HTMLElement>('[data-fx="progress"]').forEach(el => {
      gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
    })
    // Figures and fonts change the page height after first paint.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      window.clearTimeout(settle)
      mm.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [pathname])

  return <div data-fx="progress" className="brand-progress fixed inset-x-0 top-0 z-[60] h-[2px] origin-left" aria-hidden="true" />
}
