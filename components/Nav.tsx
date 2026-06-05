'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/workflow', label: 'Workflow' },
  { href: '/lhc', label: 'LHC Black Holes' },
  { href: '/eggs', label: 'Dietary Eggs' },
  { href: '/schema', label: 'Schema' },
  { href: '/evaluation', label: 'Evaluation' },
  { href: '/limitations', label: 'Limitations' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-page-border bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-ink uppercase"
        >
          Epistemic Atlas
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? 'text-ink font-medium'
                  : 'text-ink-faint hover:text-ink-light'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
