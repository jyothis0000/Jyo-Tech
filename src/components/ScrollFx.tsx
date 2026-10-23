import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Scroll motion, declared in markup with data-fx:
//   title   heading lines slide up out of a mask, once
//   rise    blocks fade up in batches as they enter, once
//   figure  the plate opens from a rounded window and grows to full size with the scroll
//   count   a number counts up to its value, once
//   depth   hero layers drift apart at different speeds as you leave the hero
//   progress  a bar that fills with page progress
export default function ScrollFx() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const restore: (() => void)[] = []
      gsap.utils.toArray<HTMLElement>('[data-fx="title"]').forEach(el => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: self => gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
        })
      })

      gsap.set('[data-fx="rise"]', { opacity: 0, y: 36 })
      ScrollTrigger.batch('[data-fx="rise"]', {
        start: 'top 90%',
        once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      })

      gsap.utils.toArray<HTMLElement>('[data-fx="figure"]').forEach(el => {
        gsap.fromTo(el,
          { clipPath: 'inset(8% 4% 8% 4% round 32px)', scale: 0.94 },
          { clipPath: 'inset(0% 0% 0% 0% round 20px)', scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.8 } },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-fx="count"]').forEach(el => {
        const text = el.textContent ?? ''
        const target = Number(text.replace(/[^\d]/g, ''))
        const suffix = text.replace(/[\d,]/g, '')
        const n = { v: 0 }
        gsap.to(n, {
          v: target,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = Math.round(n.v).toLocaleString('en-US') + suffix },
        })
        restore.push(() => { el.textContent = text })
      })

      gsap.utils.toArray<HTMLElement>('[data-depth]').forEach(el => {
        gsap.to(el, {
          y: () => Number(el.dataset.depth) * window.innerHeight,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        })
      })

      return () => restore.forEach(f => f())
    })

    gsap.fromTo('[data-fx="progress"]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

    // Figures and web fonts change the page height after first paint.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => {
      window.clearTimeout(settle)
      mm.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [pathname])

  return <div data-fx="progress" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink/70" aria-hidden="true" />
}
