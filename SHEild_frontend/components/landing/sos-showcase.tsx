import Link from 'next/link'
import { Check, MapPin } from 'lucide-react'

const POINTS = [
  'Accidental presses are prevented with a three-second hold',
  'Cancel within seconds if you are safe',
  'Location is attached automatically when available',
  'Works on any phone with a modern browser',
]

export function SosShowcase() {
  return (
    <section id="sos" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="absolute right-0 top-1/2 -z-10 size-[36rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-alert/15 blur-[140px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Emergency SOS</p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium tracking-tight md:text-5xl">
            When every second counts, it takes just three.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            The SOS button is built to work under stress: large, clear and impossible to trigger by accident.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-foreground/85">{p}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-10 inline-flex rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background transition hover:bg-sand"
          >
            Set up your SOS
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
          <div className="rounded-[2.75rem] border border-white/10 bg-card p-3 shadow-2xl">
            <div className="rounded-[2.2rem] bg-background px-6 pb-10 pt-8">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>9:41 PM</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" /> Islamabad
                </span>
              </div>
              <p className="mt-8 text-center text-sm text-muted-foreground">Hold for 3 seconds</p>
              <div className="relative mx-auto mt-6 grid size-52 place-items-center">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-alert/30" />
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-alert/20 [animation-delay:1.2s]" />
                <span className="absolute inset-4 rounded-full bg-alert/20" />
                <span className="relative grid size-36 place-items-center rounded-full bg-alert font-serif text-4xl font-semibold tracking-wide text-white shadow-[0_20px_60px_-10px] shadow-alert">
                  SOS
                </span>
              </div>
              <div className="mt-10 flex flex-col gap-2.5">
                {['Ammi · Primary', 'Hira · Sister', 'Zainab · Friend'].map((c) => (
                  <div key={c} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-sm">
                    <span>{c}</span>
                    <span className="size-2 rounded-full bg-safe" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
