'use client'

import Link from 'next/link'
import { ArrowRight, History, MapPin, Phone, ShieldCheck, Star, Users } from 'lucide-react'
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
        description="Everything you need to stay connected and safe, in one place."
      />

      {active && (
        <Link
          href="/sos"
          className="flex items-center gap-4 rounded-2xl border border-alert/40 bg-alert/10 p-5 transition hover:bg-alert/15"
        >
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-alert opacity-70" />
            <span className="relative inline-flex size-3 rounded-full bg-alert" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">An SOS alert is active</span>
            <span className="text-sm text-foreground/70">Started {formatRelative(active.createdAt)}. Tap to manage it.</span>
          </span>
          <ArrowRight className="size-5 text-alert" aria-hidden="true" />
        </Link>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(ellipse_at_top_right,oklch(0.64_0.2_18/0.25),transparent_60%)] bg-card p-7 md:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Emergency</p>
          <h2 className="mt-3 max-w-sm font-serif text-3xl font-medium leading-tight">Feel unsafe? Alert your circle in three seconds.</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sos"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-alert px-7 py-4 font-semibold text-white shadow-[0_12px_40px_-12px] shadow-alert transition hover:brightness-110"
            >
              Open SOS
            </Link>
            <a
              href="tel:15"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-medium transition hover:bg-white/5"
            >
              <Phone className="size-4" aria-hidden="true" /> Call Police 15
            </a>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 hidden size-56 md:block">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-alert/25" />
            <span className="absolute inset-8 rounded-full bg-alert/20" />
            <span className="absolute inset-16 grid place-items-center rounded-full bg-alert/80 font-serif text-xl font-semibold text-white">
              SOS
            </span>
          </div>
        </section>

        <section className="flex flex-col rounded-3xl border border-border bg-card p-7">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Primary contact</p>
            <Star className="size-4 text-sand" aria-hidden="true" />
          </div>
          {loadingContacts ? (
            <Skeleton className="mt-6 h-20" />
          ) : primary ? (
            <div className="mt-6 flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-sand/15 font-serif text-xl text-sand">
                {primary.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold">{primary.name}</p>
                <p className="text-sm text-muted-foreground">
                  {primary.relation} · {primary.phone}
                </p>
              </div>
              <a
                href={`tel:${primary.phone.replace(/\s/g, '')}`}
                className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground"
                aria-label={`Call ${primary.name}`}
              >
                <Phone className="size-4" />
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Trusted contacts" value={loadingContacts ? null : `${contacts?.length ?? 0} / 5`} />
        <StatCard icon={History} label="Total alerts" value={loadingHistory ? null : String(history?.length ?? 0)} />
        <StatCard
          icon={ShieldCheck}
          label="Resolved safely"
          value={loadingHistory ? null : String(history?.filter((a) => a.status === 'RESOLVED').length ?? 0)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-border bg-card p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium">Recent alerts</h2>
            <Link href="/history" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {loadingHistory ? (
            <div className="mt-6 flex flex-col gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : history && history.length > 0 ? (
            <ul className="mt-6 flex flex-col divide-y divide-border">
              {history.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5">
                    <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
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

        <section className="rounded-3xl border border-border bg-card p-7">
          <h2 className="font-serif text-xl font-medium">Quick dial</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {HELPLINES.map((h) => (
              <li key={h.number}>
                <a
                  href={`tel:${h.number}`}
                  className="flex flex-col rounded-2xl border border-border bg-background/50 p-4 transition hover:border-primary/40"
                >
                  <span className="font-serif text-2xl">{h.number}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{h.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/8 p-7 md:flex-row md:items-center">
        <div>
          <h2 className="font-semibold">Travelling late tonight?</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Share your ride details with your primary contact before you leave, and keep your phone charged.
          </p>
        </div>
        <UrduTagline className="text-xl" />
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | null }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      {value === null ? <Skeleton className="mt-5 h-9 w-20" /> : <p className="mt-5 font-serif text-4xl">{value}</p>}
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
