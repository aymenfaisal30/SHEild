'use client'

import Link from 'next/link'
import { ArrowRight, History, MapPin, MessageSquareHeart, Phone, ShieldCheck, Star, Users } from 'lucide-react'
import { PageHeader } from './app-shell'
import { Skeleton, StatusBadge } from './status-badge'
import { UrduTagline } from '@/components/brand/logo'
import { formatCoords, formatRelative, greeting } from '@/lib/format'
import { HELPLINES } from '@/lib/helplines'
import { useContacts, useCurrentUser, useSosHistory } from '@/lib/hooks'

export function DashboardView() {
  const { data: user } = useCurrentUser()
  const { data: contacts, isLoading: loadingContacts } = useContacts()
  const { data: history, isLoading: loadingHistory } = useSosHistory()

  const primary = contacts?.find((c) => c.isPrimary) ?? contacts?.[0]
  const active = history?.find((a) => a.status === 'ACTIVE')
  const firstName = user?.fullName.split(' ')[0]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={user?.city ? `${user.city}, Pakistan` : 'Pakistan'}
        title={`${greeting()}${firstName ? `, ${firstName}` : ''}.`}
        description="Everything you need to stay connected and safe, in one calm place."
      />

      {active && (
        <Link
          href="/sos"
          className="animate-fade-up flex items-center gap-4 rounded-3xl border border-alert/40 bg-alert/10 p-5 backdrop-blur transition hover:bg-alert/15"
        >
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-alert opacity-70" />
            <span className="relative inline-flex size-3 rounded-full bg-alert" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">An SOS alert is active</span>
            <span className="text-sm text-foreground/70">
              Started {formatRelative(active.createdAt)}. Tap to manage it.
            </span>
          </span>
          <ArrowRight className="size-5 text-alert" aria-hidden="true" />
        </Link>
      )}

      <section
        aria-labelledby="sos-hero"
        className="glass animate-fade-up relative overflow-hidden rounded-[2.25rem] px-6 py-12 [animation-delay:120ms] md:px-12 md:py-16"
      >
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-alert/10 blur-[120px]" />
        <div className="relative flex flex-col items-center gap-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-sm md:order-1">
            <p className="text-sm font-medium text-primary">Emergency</p>
            <h2 id="sos-hero" className="mt-2 text-balance font-serif text-4xl font-light leading-tight md:text-5xl">
              Feel unsafe? <em className="text-rose-gold">One press.</em>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Open SOS and hold for three seconds to record an alert with your live location.
            </p>
            <a
              href="tel:15"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 px-6 text-sm font-medium transition hover:bg-white/5"
            >
              <Phone className="size-4" strokeWidth={1.6} aria-hidden="true" /> Call Police 15
            </a>
          </div>

          <Link
            href="/sos"
            aria-label="Open SOS"
            className="group relative grid size-60 shrink-0 place-items-center rounded-full focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-alert md:order-2 md:size-72"
          >
            <span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full border border-alert/50" />
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-pulse-ring rounded-full border border-alert/40 [animation-delay:1.6s]"
            />
            <span aria-hidden="true" className="absolute inset-3 rounded-full border border-primary/25" />
            <span
              aria-hidden="true"
              className="animate-breathe absolute inset-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,oklch(0.8_0.15_25),oklch(0.62_0.21_15)_55%,oklch(0.45_0.18_10))] transition-transform duration-500 group-hover:scale-[1.03] group-active:scale-95"
            />
            <span
              aria-hidden="true"
              className="absolute inset-7 rounded-full bg-[radial-gradient(circle_at_50%_0%,oklch(1_0_0/0.35),transparent_55%)]"
            />
            <span className="relative flex flex-col items-center text-white">
              <span className="font-serif text-6xl font-medium tracking-wide md:text-7xl">SOS</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-white/80">Tap to open</span>
            </span>
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Trusted contacts" value={loadingContacts ? null : `${contacts?.length ?? 0} / 5`} />
        <StatCard icon={History} label="Total alerts" value={loadingHistory ? null : String(history?.length ?? 0)} />
        <StatCard
          icon={ShieldCheck}
          label="Resolved safely"
          value={loadingHistory ? null : String(history?.filter((a) => a.status === 'RESOLVED').length ?? 0)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="glass flex flex-col rounded-[1.75rem] p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light">Primary contact</h2>
            <Star className="size-4 fill-primary/70 text-primary" aria-hidden="true" />
          </div>
          {loadingContacts ? (
            <Skeleton className="mt-6 h-16" />
          ) : primary ? (
            <div className="mt-6 flex items-center gap-4">
              <span className="bg-rose-gold grid size-14 place-items-center rounded-full font-serif text-2xl text-primary-foreground">
                {primary.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium">{primary.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {primary.relation} · {primary.phone}
                </p>
              </div>
              <a
                href={`tel:${primary.phone.replace(/\s/g, '')}`}
                className="grid size-11 place-items-center rounded-full border border-primary/30 text-primary transition hover:bg-primary/10"
                aria-label={`Call ${primary.name}`}
              >
                <Phone className="size-4" strokeWidth={1.6} />
              </a>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">You have not added any trusted contacts yet.</p>
          )}
          <Link
            href="/contacts"
            className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary hover:underline"
          >
            {primary ? 'Manage contacts' : 'Add your first contact'} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="glass rounded-[1.75rem] p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light">Recent alerts</h2>
            <Link href="/history" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {loadingHistory ? (
            <div className="mt-6 flex flex-col gap-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : history && history.length > 0 ? (
            <ul className="mt-5 flex flex-col divide-y divide-white/6">
              {history.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <MapPin className="size-4 text-primary" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.address ?? formatCoords(a.latitude, a.longitude)}</p>
                    <p className="text-xs text-muted-foreground">{formatRelative(a.createdAt)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No alerts yet. We hope it stays that way.</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="glass rounded-[1.75rem] p-7">
          <h2 className="font-serif text-2xl font-light">Quick dial</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {HELPLINES.map((h) => (
              <li key={h.number}>
                <a
                  href={`tel:${h.number}`}
                  className="flex flex-col rounded-2xl border border-white/8 bg-background/30 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/35"
                >
                  <span className="text-rose-gold font-serif text-3xl font-light">{h.number}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{h.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] border border-primary/20 bg-primary/8 p-7">
          <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-[60px]" />
          <div className="relative">
            <MessageSquareHeart className="size-6 text-primary" strokeWidth={1.4} aria-hidden="true" />
            <h2 className="mt-4 font-serif text-2xl font-light">Loving SHEild?</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              Share a review. Your words help other women across Pakistan feel safer choosing SHEild.
            </p>
          </div>
          <div className="relative flex items-end justify-between gap-4">
            <Link
              href="/reviews"
              className="bg-rose-gold inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
            >
              Write a review <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <UrduTagline className="hidden text-lg sm:block" />
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | null }) {
  return (
    <div className="glass rounded-[1.75rem] p-6 transition duration-500 hover:border-primary/20">
      <span className="grid size-10 place-items-center rounded-full bg-primary/10">
        <Icon className="size-[18px] text-primary" strokeWidth={1.6} aria-hidden="true" />
      </span>
      {value === null ? (
        <Skeleton className="mt-5 h-10 w-20" />
      ) : (
        <p className="mt-5 font-serif text-5xl font-light">{value}</p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
