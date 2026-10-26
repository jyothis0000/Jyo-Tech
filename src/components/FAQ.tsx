import { useState } from 'react'

interface FAQItem {
  q: string
  a: string
}

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-rule">
      {items.map((item, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="font-medium text-ink">{item.q}</span>
            <span className={`ml-4 shrink-0 text-body transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          {open === i && (
            <p className="mt-3 text-sm leading-relaxed text-body">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}
