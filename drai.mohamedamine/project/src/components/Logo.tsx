import { Link } from 'react-router'

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={`logo ${inverse ? 'logo--inverse' : ''}`} aria-label="Gadget Hub — на главную">
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path d="M7 4h15l7 7v21H7z" fill="currentColor" opacity=".16" />
        <path d="M10 2h14l7 7v20a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M13 12h12M13 18h12M13 24h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m23 2 8 8h-8z" fill="currentColor" />
      </svg>
      <span>Gadget Hub</span>
    </Link>
  )
}
