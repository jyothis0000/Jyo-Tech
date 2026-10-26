import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Scroll motion, declared in markup with data-fx:
//   type    the heading types itself out behind a caret: on load (data-type-on="load") or on scroll, once
//   rise    blocks fade up in batches as they enter, once
//   card    product cards and figures lift into place as whole objects, once
//   count   a number counts up to its value, once
//   character  the scientist pops in on load (or on scroll with data-on="scroll"), idles, leans to the pointer
//   float   lab stickers pop in on scroll, then drift and tilt
//   depth   hero layers drift apart at different speeds as you leave the hero
//   progress  a bar that fills with page progress
const CHAR_SECONDS = 0.045

// Types an element's text one character at a time; returns a function that removes the caret.
function typeIn(el: HTMLElement, { delay = 0, keepCaret = false, scrollTrigger }: { delay?: number; keepCaret?: boolean; scrollTrigger?: ScrollTrigger.Vars }) {
  const { chars } = SplitText.create(el, { type: 'words,chars' })
  const caret = document.createElement('span')
  caret.className = 'caret'
  caret.setAttribute('aria-hidden', 'true')
  gsap.set(chars, { visibility: 'hidden' })
  chars[0]?.before(caret)
  const tl = gsap.timeline({ delay, scrollTrigger })
  chars.forEach((char, i) => tl.call(() => {
    (char as HTMLElement).style.visibility = 'visible'
    char.after(caret)
  }, undefined, i * CHAR_SECONDS))
  if (!keepCaret) tl.to(caret, { autoAlpha: 0, duration: 0.3 }, '+=0.9')
  return () => caret.remove()
}

export default function ScrollFx() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const root = document.documentElement
    let alive = true

    // Split text only once the web fonts are in, so characters measure right; keep typed headings hidden till then.
    root.classList.add('fx-wait')
    const fontsIn = Promise.race([document.fonts.ready, new Promise(r => window.setTimeout(r, 1500))])
    fontsIn.then(() => {
      if (!alive) return
      root.classList.remove('fx-wait')
      start()
    })

    const start = () => mm.add('(prefers-reduced-motion: no-preference)', () => {
      const restore: (() => void)[] = []
      gsap.utils.toArray<HTMLElement>('[data-fx="type"]').forEach(el => {
        const onLoad = el.dataset.typeOn === 'load'
        restore.push(typeIn(el, onLoad
          ? { delay: 0.35, keepCaret: true }
          : { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }))
      })

      const rises = gsap.utils.toArray<HTMLElement>('[data-fx="rise"]')
      if (rises.length) gsap.set(rises, { opacity: 0, y: 36 })
      ScrollTrigger.batch('[data-fx="rise"]', {
        start: 'top 90%',
        once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      })

      // Cards arrive as whole objects: a short lift and fade, side by side ones a beat apart.
      const cards = gsap.utils.toArray<HTMLElement>('[data-fx="card"]')
      if (cards.length) gsap.set(cards, { opacity: 0, y: 70 })
      ScrollTrigger.batch('[data-fx="card"]', {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.15, overwrite: true }),
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

      // The scientist pops in (with the page, or when scrolled to), then idles: a bob, a sway and a breath on
      // different clocks so it never looks looped, leans toward the pointer, and does a little jig when touched.
      gsap.utils.toArray<HTMLElement>('[data-fx="character"]').forEach(el => {
        const onScroll = el.dataset.on === 'scroll'
        const holder = el.parentElement ?? el
        gsap.set(el, { transformOrigin: '50% 90%' })
        gsap.timeline(onScroll ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } } : {})
          .from(el, { opacity: 0, scale: 0.85, y: 40, duration: 1.2, ease: 'back.out(1.6)', delay: onScroll ? 0 : 0.2 })
          .add(() => {
            gsap.to(el, { y: -12, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
            gsap.fromTo(el, { rotate: -1.4 }, { rotate: 1.4, duration: 3.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
            gsap.to(el, { scaleY: 1.012, scaleX: 0.996, duration: 1.7, ease: 'sine.inOut', repeat: -1, yoyo: true })
          })

        if (window.matchMedia('(pointer: fine)').matches) {
          gsap.set(holder, { transformPerspective: 900 })
          const turnY = gsap.quickTo(holder, 'rotationY', { duration: 0.8, ease: 'power3.out' })
          const turnX = gsap.quickTo(holder, 'rotationX', { duration: 0.8, ease: 'power3.out' })
          const lean = (e: PointerEvent) => {
            const box = holder.getBoundingClientRect()
            turnY(gsap.utils.clamp(-1, 1, (e.clientX - (box.left + box.width / 2)) / window.innerWidth * 2) * 7)
            turnX(gsap.utils.clamp(-1, 1, (e.clientY - (box.top + box.height / 2)) / window.innerHeight * 2) * -5)
          }
          window.addEventListener('pointermove', lean)
          restore.push(() => window.removeEventListener('pointermove', lean))
        }

        // yPercent and rotate stay clear of the scroll parallax (y) and the pointer lean (rotationX/Y).
        let jigging = false
        const jig = () => {
          if (jigging) return
          jigging = true
          gsap.timeline({ onComplete: () => { jigging = false } })
            .to(holder, { yPercent: -3, duration: 0.18, ease: 'power2.out' })
            .to(holder, { yPercent: 0, duration: 0.5, ease: 'bounce.out' })
            .fromTo(holder, { rotate: 0 }, { keyframes: { rotate: [-4, 3.5, -2.5, 1.5, 0] }, duration: 0.7, ease: 'none' }, 0)
        }
        el.addEventListener('pointerenter', jig)
        el.addEventListener('click', jig)
        restore.push(() => { el.removeEventListener('pointerenter', jig); el.removeEventListener('click', jig) })
      })

      // Lab stickers pop in when they come into view, then drift and tilt on their own slow clocks.
      gsap.utils.toArray<HTMLElement>('[data-fx="float"]').forEach((el, i) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
          .fromTo(el, { opacity: 0, scale: 0.4, rotate: -25 }, { opacity: 1, scale: 1, rotate: -5, duration: 0.9, ease: 'back.out(2)' })
          .add(() => {
            gsap.to(el, { y: -10 - (i % 3) * 4, duration: 2.2 + (i % 4) * 0.45, ease: 'sine.inOut', repeat: -1, yoyo: true })
            gsap.to(el, { rotate: 6, duration: 3.1 + (i % 3) * 0.6, ease: 'sine.inOut', repeat: -1, yoyo: true })
          })
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
      alive = false
      root.classList.remove('fx-wait')
      window.clearTimeout(settle)
      mm.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [pathname])

  return <div data-fx="progress" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink/70" aria-hidden="true" />
}
