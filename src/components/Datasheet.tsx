export default function Datasheet({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-rule border-y border-rule">
      {rows.map(([term, value]) => (
        <div key={term} className="grid grid-cols-[7.5rem_1fr] gap-4 py-2.5 sm:grid-cols-[9rem_1fr]">
          <dt className="eyebrow pt-0.5">{term}</dt>
          <dd className="text-sm leading-relaxed text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
