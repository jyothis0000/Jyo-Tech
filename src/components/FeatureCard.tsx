interface FeatureCardProps {
  icon: string
  title: string
  description: string
  accent?: 'indigo' | 'emerald'
}

export default function FeatureCard({ icon, title, description, accent = 'indigo' }: FeatureCardProps) {
  const iconBg = accent === 'indigo'
    ? 'bg-indigo-500/10 text-indigo-400'
    : 'bg-emerald-500/10 text-emerald-400'

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mb-1 font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  )
}
