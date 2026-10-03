'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { History, Home, LogOut, MessageSquareHeart, Siren, Users } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { IS_DEMO_MODE } from '@/lib/api/config'
import { authService } from '@/lib/api/services'
import { initials } from '@/lib/format'
import { useCurrentUser, useToken } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/sos', label: 'SOS', icon: Siren },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/history', label: 'History', icon: History },
  { href: '/reviews', label: 'Reviews', icon: MessageSquareHeart },
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
    <div className="min-h-svh lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="sticky top-0 hidden h-svh flex-col border-r border-white/5 bg-[oklch(0.14_0.035_308/0.7)] p-6 backdrop-blur-xl lg:flex">
        <Logo href="/dashboard" />
        <div className="hairline mt-8 h-px" aria-hidden="true" />
        <nav aria-label="App" className="mt-6 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex min-h-11 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                  active
                    ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px] shadow-primary/20'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                )}
              >
                <Icon
                  className={cn('size-[18px]', href === '/sos' && !active && 'text-alert')}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          {IS_DEMO_MODE && (
            <p className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Demo mode. Set <span className="font-mono text-foreground/80">NEXT_PUBLIC_API_BASE_URL</span> to connect
              your API.
            </p>
          )}
          <div className="glass flex items-center gap-3 rounded-2xl p-3">
            <span className="bg-rose-gold grid size-10 shrink-0 place-items-center rounded-full font-serif text-base font-semibold text-primary-foreground">
              {user ? initials(user.fullName) : ''}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName ?? '\u00A0'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? '\u00A0'}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              aria-label="Log out"
            >
              <LogOut className="size-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-svh flex-col pb-28 lg:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-background/75 px-5 py-3.5 backdrop-blur-xl lg:hidden">
          <Logo href="/dashboard" />
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground"
          >
            <LogOut className="size-3.5" aria-hidden="true" /> Log out
          </button>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>

      <nav
        aria-label="App"
        className="glass fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[1.75rem] p-1.5 lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.4rem] text-[11px] font-medium transition-colors',
                active ? 'bg-primary/12 text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon
                className={cn('size-5', href === '/sos' && !active && 'text-alert')}
                strokeWidth={1.6}
                aria-hidden="true"
              />
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
        {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
        <h1 className="mt-2 text-balance font-serif text-4xl font-light tracking-tight md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
