export default function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <path fill="var(--color-raised)" d="M16 5 26 10.5 16 16 6 10.5z" />
      <path fill="var(--color-page)" d="M6 10.5 16 16v11L6 21.5z" />
      <path fill="var(--color-plate)" d="M26 10.5 16 16v11l10-5.5z" />
      <path fill="none" stroke="var(--color-ink)" strokeLinejoin="round" strokeWidth="1.4" d="M16 5 26 10.5v11L16 27 6 21.5v-11zM6 10.5 16 16l10-5.5M16 16v11" />
    </svg>
  )
}
