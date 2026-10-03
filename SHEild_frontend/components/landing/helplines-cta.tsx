import Link from 'next/link'
import { Phone } from 'lucide-react'
import { UrduTagline } from '@/components/brand/logo'
import { HELPLINES } from '@/lib/helplines'

export function Helplines() {
  return (
    <section id="helplines" className="scroll-mt-20 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-[2rem] border border-border bg-card/60 p-7 md:p-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Emergency helplines</p>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">Help is one call away.</h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">Tap any number to call directly from your phone.</p>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HELPLINES.map((h) => (
              <li key={h.number}>
                <a
                  href={`tel:${h.number}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-background/60 p-5 transition hover:border-primary/40"
                >
                  <span className="flex items-center justify-between">
                    <span className="font-serif text-4xl text-foreground">{h.number}</span>
                    <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="mt-4 font-medium">{h.name}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{h.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-16 text-center text-primary-foreground md:px-16 md:py-24">
          <div aria-hidden="true" className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-white/30 blur-[100px]" />
          <UrduTagline className="relative text-3xl !text-primary-foreground md:text-4xl" />
          <h2 className="relative mx-auto mt-4 max-w-2xl text-balance font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Your safety circle, ready in under a minute.
          </h2>
          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="rounded-full bg-background px-8 py-4 font-semibold text-foreground transition hover:bg-background/90">
              Create free account
            </Link>
            <Link href="/login" className="rounded-full border border-primary-foreground/25 px-8 py-4 font-semibold transition hover:bg-primary-foreground/10">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
