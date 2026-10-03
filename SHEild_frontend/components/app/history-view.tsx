'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Clock, ExternalLink, MapPin, MessageSquare, ShieldCheck, Users } from 'lucide-react'
import { PageHeader } from './app-shell'
import { Skeleton, StatusBadge } from './status-badge'
import type { SosStatus } from '@/lib/api/types'
import { formatCoords, formatDateTime, formatDuration, mapsUrl } from '@/lib/format'
import { useSosHistory } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const FILTERS: { value: SosStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export function HistoryView() {
  const { data: history, isLoading, error } = useSosHistory()
  const [filter, setFilter] = useState<SosStatus | 'ALL'>('ALL')

  const items = (history ?? []).filter((a) => filter === 'ALL' || a.status === filter)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Records"
        title="SOS history"
        description="A private log of every alert you have sent, with time, location and outcome."
      />

      <div role="tablist" aria-label="Filter alerts" className="flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => {
          const count = f.value === 'ALL' ? history?.length : history?.filter((a) => a.status === f.value).length
          return (
            <button
              key={f.value}
              role="tab"
              type="button"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                filter === f.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground/70 hover:text-foreground',
              )}
            >
              {f.label}
              <span className={cn('text-xs', filter === f.value ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                {count ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          Could not load history. {error instanceof Error ? error.message : ''}
        </p>
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-safe/15 text-safe">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-serif text-2xl font-medium">Nothing here</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {filter === 'ALL' ? 'You have not sent any SOS alerts.' : 'No alerts match this filter.'}
          </p>
          <Link href="/dashboard" className="mt-6 text-sm font-medium text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      ) : (
        <ol className="relative flex flex-col gap-4 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-px before:bg-border md:before:left-[31px]">
          {items.map((a, i) => {
            const hasCoords = a.latitude !== null && a.longitude !== null
            return (
              <li
                key={a.id}
                className="animate-fade-up relative flex gap-4 md:gap-6"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span
                  className={cn(
                    'relative z-10 mt-6 grid size-14 shrink-0 place-items-center rounded-2xl border border-border bg-card md:size-16',
                    a.status === 'ACTIVE' && 'border-alert/50',
                  )}
                >
                  <MapPin
                    className={cn(
                      'size-5',
                      a.status === 'ACTIVE' ? 'text-alert' : a.status === 'RESOLVED' ? 'text-safe' : 'text-muted-foreground',
                    )}
                    aria-hidden="true"
                  />
                </span>
                <article className="flex-1 rounded-3xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold">{formatDateTime(a.createdAt)}</h2>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">{a.address ?? formatCoords(a.latitude, a.longitude)}</p>
                  {a.message && (
                    <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {a.message}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5" aria-hidden="true" /> Alert recorded
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {a.status === 'ACTIVE' ? 'Ongoing' : `Lasted ${formatDuration(a.createdAt, a.resolvedAt)}`}
                    </span>
                    {hasCoords && (
                      <a
                        href={mapsUrl(a.latitude!, a.longitude!)}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        View on map <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                    )}
                    {a.status === 'ACTIVE' && (
                      <Link href="/sos" className="font-medium text-alert hover:underline">
                        Manage alert
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
