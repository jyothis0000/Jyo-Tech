import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Router link for site paths, plain anchor for mailto: and the like.
export default function SmartLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return to.startsWith('/')
    ? <Link to={to} className={className}>{children}</Link>
    : <a href={to} className={className}>{children}</a>
}
