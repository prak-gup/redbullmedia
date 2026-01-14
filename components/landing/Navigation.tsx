'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-white">
          Red Bull <span className="text-emerald-400">Optimizer</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/landing#features"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-white/90"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  )
}
