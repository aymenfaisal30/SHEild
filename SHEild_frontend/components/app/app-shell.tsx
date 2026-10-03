'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { History, LayoutDashboard, LogOut, Siren, Users } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { IS_DEMO_MODE } from '@/lib/api/config'
import { authService } from '@/lib/api/services'
import { initials } from '@/lib/format'
import { useCurrentUser, useToken } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/sos', label: 'SOS', icon: Siren },
  { href: '/history', label: 'History', icon: History },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const token = useToken()
  const router = useRouter()
  const pathname = usePathname()
  const { data: user } = useCurrentUser()

  useEffect(() => {
    if (token === null) router.replace('/login')
  }, [token, router])

  if (!token) {
    return (
      <div className="grid min-h-svh place-items-center" role="status">
        <span className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  function logout() {
    authService.logout()
    router.replace('/login')
  }

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-svh flex-col border-r border-border bg-card/40 p-6 lg:flex">
        <Logo href="/dashboard" />
        <nav aria-label="App" className="mt-10 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  active ? 'bg-primary/12 text-primary' : 'text-foreground/70 hover:bg-white/5 hover:text-foreground',
                  href === '/sos' && !active && 'text-alert',
                )}
              >
                <Icon className="size-4.5" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          {IS_DEMO_MODE && (
            <p className="rounded-xl border border-primary/20 bg-primary/8 px-3 py-2 text-xs text-foreground/70">
              Demo mode · set <span className="font-mono">NEXT_PUBLIC_API_BASE_URL</span> to connect your API.
            </p>
          )}
          <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand/15 text-sm font-semibold text-sand">
              {user ? initials(user.fullName) : ''}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName ?? '\u00A0'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? '\u00A0'}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-svh flex-col pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl lg:hidden">
          <Logo href="/dashboard" />
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-medium"
          >
            <LogOut className="size-3.5" aria-hidden="true" /> Log out
          </button>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>

      <nav
        aria-label="App"
        className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-border bg-card/90 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors',
                active ? 'bg-primary/12 text-primary' : 'text-muted-foreground',
                href === '/sos' && !active && 'text-alert',
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="animate-fade-up flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="mt-2 text-balance font-serif text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
