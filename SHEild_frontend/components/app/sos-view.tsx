'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, ExternalLink, MapPin, Phone, Users, X } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from './app-shell'
import { Skeleton } from './status-badge'
import { sosService } from '@/lib/api/services'
import type { SosAlert } from '@/lib/api/types'
import { formatCoords, formatDuration, mapsUrl } from '@/lib/format'
import { getCurrentPosition } from '@/lib/geolocation'
import { useContacts, useSosHistory } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const HOLD_MS = 3000

export function SosView() {
  const { data: history, isLoading, mutate } = useSosHistory()
  const { data: contacts } = useContacts()
  const active = history?.find((a) => a.status === 'ACTIVE') ?? null

  async function trigger(message: string) {
    const position = await getCurrentPosition()
    const alert = await sosService.trigger({
      latitude: position?.latitude ?? null,
      longitude: position?.longitude ?? null,
      message: message.trim() || undefined,
    })
    await mutate((current) => [alert, ...(current ?? []).filter((a) => a.id !== alert.id)], { revalidate: true })
    if (!position) toast.warning('Location unavailable. Your alert was saved without coordinates.')
  }

  async function finish(kind: 'resolve' | 'cancel') {
    if (!active) return
    const updated = kind === 'resolve' ? await sosService.resolve(active.id) : await sosService.cancel(active.id)
    await mutate((current) => current?.map((a) => (a.id === updated.id ? updated : a)), { revalidate: true })
    toast.success(kind === 'resolve' ? 'Glad you are safe. Alert marked as resolved.' : 'Alert cancelled.')
  }

  if (isLoading) return <Skeleton className="h-[520px]" />

  return active ? (
    <ActiveAlert alert={active} onFinish={finish} />
  ) : (
    <SosTrigger onTrigger={trigger} contactCount={contacts?.length ?? 0} />
  )
}

function SosTrigger({
  onTrigger,
  contactCount,
}: {
  onTrigger: (message: string) => Promise<void>
  contactCount: number
}) {
  const [progress, setProgress] = useState(0)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const frame = useRef<number | null>(null)
  const start = useRef<number | null>(null)

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current)
  }, [])

  function begin() {
    if (sending || start.current !== null) return
    start.current = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - (start.current ?? now)) / HOLD_MS)
      setProgress(p)
      if (p >= 1) {
        start.current = null
        void fire()
        return
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  function release() {
    if (start.current === null) return
    start.current = null
    if (frame.current) cancelAnimationFrame(frame.current)
    setProgress(0)
  }

  async function fire() {
    setSending(true)
    if ('vibrate' in navigator) navigator.vibrate?.([200, 100, 200])
    try {
      await onTrigger(message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send SOS. Call 15 now.')
      setSending(false)
      setProgress(0)
    }
  }

  const circumference = 2 * Math.PI * 46
  const holding = progress > 0 && !sending
  const label = sending ? 'Sending alert' : holding ? `Keep holding · ${Math.ceil((1 - progress) * 3)}` : 'Hold for 3 seconds'

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Emergency"
        title="SOS"
        description="Press and hold the button. Your alert is saved with your location. Contact notifications are coming soon."
      />

      {contactCount === 0 && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-sand/30 bg-sand/10 p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-foreground/80">You have no trusted contacts yet, so add some now. Notifications to contacts are coming soon.</p>
          <Link href="/contacts" className="text-sm font-semibold text-sand hover:underline">
            Add a contact
          </Link>
        </div>
      )}

      <section className="relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_center,oklch(0.64_0.2_18/0.18),transparent_60%)] bg-card px-6 py-14 md:py-20">
        <div className="relative grid size-64 place-items-center md:size-72">
          <span
            aria-hidden="true"
            className={cn('absolute inset-0 rounded-full bg-alert/20', !holding && !sending && 'animate-pulse-ring')}
          />
          <span aria-hidden="true" className="absolute inset-6 rounded-full bg-alert/15" />
          <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/8" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - (sending ? 1 : progress))}
              className="text-alert"
            />
          </svg>
          <button
            type="button"
            onPointerDown={begin}
            onPointerUp={release}
            onPointerLeave={release}
            onPointerCancel={release}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                e.preventDefault()
                begin()
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') release()
            }}
            onContextMenu={(e) => e.preventDefault()}
            disabled={sending}
            aria-label="Hold for three seconds to send an SOS alert"
            className={cn(
              'relative grid size-44 touch-none select-none place-items-center rounded-full bg-alert text-white shadow-[0_20px_60px_-15px] shadow-alert transition-transform duration-300 md:size-52',
              holding && 'scale-95',
              sending && 'animate-pulse',
            )}
          >
            <span className="font-serif text-5xl font-semibold tracking-wide md:text-6xl">SOS</span>
          </button>
        </div>
        <p className="mt-8 text-sm font-medium text-foreground/80" aria-live="polite">
          {label}
        </p>

        <div className="mt-10 w-full max-w-md">
          <label htmlFor="sos-message" className="text-sm font-medium text-foreground/85">
            Optional message
          </label>
          <textarea
            id="sos-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            rows={2}
            placeholder="e.g. Being followed near F-7 Markaz"
            className="mt-2 w-full resize-none rounded-2xl border border-input bg-background/50 px-4 py-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoTile icon={MapPin} title="Location" text="Your GPS coordinates are attached to the alert." />
        <InfoTile icon={Users} title={`${contactCount} contacts`} text="Contacts are saved; SMS alerts are coming soon." />
        <a href="tel:15" className="rounded-3xl border border-border bg-card p-6 transition hover:border-alert/40">
          <Phone className="size-5 text-alert" aria-hidden="true" />
          <p className="mt-4 font-semibold">Call Police 15</p>
          <p className="mt-1 text-sm text-muted-foreground">If you are in immediate danger, call now.</p>
        </a>
      </div>
    </div>
  )
}

function ActiveAlert({
  alert,
  onFinish,
}: {
  alert: SosAlert
  onFinish: (kind: 'resolve' | 'cancel') => Promise<void>
}) {
  const [pending, setPending] = useState<'resolve' | 'cancel' | null>(null)
  const [, forceTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  async function handle(kind: 'resolve' | 'cancel') {
    setPending(kind)
    try {
      await onFinish(kind)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
      setPending(null)
    }
  }

  const hasCoords = alert.latitude !== null && alert.longitude !== null

  return (
    <div className="flex flex-col gap-8">
      <section className="animate-fade-up relative overflow-hidden rounded-[2rem] border border-alert/40 bg-[radial-gradient(ellipse_at_top,oklch(0.64_0.2_18/0.3),transparent_65%)] bg-card p-7 md:p-10">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-alert opacity-70" />
            <span className="relative inline-flex size-3 rounded-full bg-alert" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-alert">SOS active</p>
          <p className="ml-auto font-mono text-sm text-foreground/70" aria-label="Time since alert">
            {formatDuration(alert.createdAt)}
          </p>
        </div>
        <h1 className="mt-6 max-w-lg text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
          Your alert is recorded. Call 15 now if you need immediate help.
        </h1>
        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Status</dt>
            <dd className="mt-2 font-serif text-3xl">Recorded</dd>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Location shared</dt>
            <dd className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate font-mono text-sm">{alert.address ?? formatCoords(alert.latitude, alert.longitude)}</span>
              {hasCoords && (
                <a
                  href={mapsUrl(alert.latitude!, alert.longitude!)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Map <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </dd>
          </div>
        </dl>
        {alert.message && (
          <p className="mt-4 rounded-2xl border border-border bg-background/50 p-5 text-sm text-foreground/85">
            {'“'}
            {alert.message}
            {'”'}
          </p>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handle('resolve')}
            disabled={pending !== null}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-safe px-7 py-4 font-semibold text-background transition hover:brightness-110 disabled:opacity-60"
          >
            <CheckCircle2 className="size-5" aria-hidden="true" />
            {pending === 'resolve' ? 'Updating' : 'I am safe now'}
          </button>
          <a
            href="tel:15"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-alert px-7 py-4 font-semibold text-white transition hover:brightness-110"
          >
            <Phone className="size-5" aria-hidden="true" /> Call Police 15
          </a>
        </div>
        <button
          type="button"
          onClick={() => handle('cancel')}
          disabled={pending !== null}
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-60"
        >
          <X className="size-4" aria-hidden="true" />
          {pending === 'cancel' ? 'Cancelling' : 'Triggered by mistake? Cancel alert'}
        </button>
      </section>
    </div>
  )
}

function InfoTile({ icon: Icon, title, text }: { icon: typeof MapPin; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
