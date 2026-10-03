'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { useToken } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#sos', label: 'SOS' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#helplines', label: 'Helplines' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const token = useToken()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled || open ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-foreground/75 transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          {token ? (
            <Link
              href="/dashboard"
              className="bg-rose-gold rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-medium text-foreground/85 hover:text-foreground">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-rose-gold rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-border px-5 pb-6 md:hidden">
          <ul className="flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block py-3 text-base text-foreground/85">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3">
            <Link href={token ? '/dashboard' : '/login'} className="rounded-full border border-border py-3 text-center text-sm font-medium">
              {token ? 'Dashboard' : 'Log in'}
            </Link>
            <Link href="/signup" className="bg-rose-gold rounded-full py-3 text-center text-sm font-semibold text-primary-foreground">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
