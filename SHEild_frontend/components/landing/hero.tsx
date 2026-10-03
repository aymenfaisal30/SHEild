import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { UrduTagline } from '@/components/brand/logo'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-24">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/faisal-mosque-night.jpg"
          alt="Faisal Mosque illuminated at night beneath the Margalla Hills, Islamabad"
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover object-[60%_center] md:object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,oklch(0.14_0.035_268/0.96)_0%,oklch(0.14_0.035_268/0.75)_42%,oklch(0.14_0.035_268/0.25)_75%,oklch(0.14_0.035_268/0.55)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-background to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-background/80 to-transparent" />
      <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 size-[28rem] rounded-full bg-primary/20 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-2xl">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Personal safety, made for Pakistan
          </p>
          <h1 className="animate-fade-up mt-6 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight [animation-delay:120ms] sm:text-6xl lg:text-7xl">
            The city is yours, <em className="font-normal text-primary">day or night.</em>
          </h1>
          <UrduTagline className="animate-fade-up mt-5 text-right text-2xl [animation-delay:220ms] sm:text-3xl md:text-left" />
          <p className="animate-fade-up mt-5 max-w-xl text-pretty text-lg leading-relaxed text-foreground/75 [animation-delay:320ms]">
            SHEild connects you to the people you trust with a single press. Share your live location, alert your circle
            and reach help across Islamabad, Lahore, Karachi and beyond.
          </p>
          <div className="animate-fade-up mt-9 flex flex-col gap-3 [animation-delay:420ms] sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-[0_10px_40px_-10px] shadow-primary/60 transition hover:brightness-110"
            >
              Create free account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-medium backdrop-blur transition hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
          <dl className="animate-fade-up mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6 [animation-delay:520ms]">
            {[
              ['3 sec', 'Hold to alert'],
              ['24/7', 'Always on'],
              ['Free', 'For every woman'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-2xl text-foreground">{value}</dd>
                <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroSafetyCards />
      </div>
    </section>
  )
}

function HeroSafetyCards() {
  return (
    <div className="relative hidden h-[480px] lg:block" aria-hidden="true">
      <div className="animate-float absolute right-4 top-6 w-72 rounded-3xl border border-white/10 bg-background/55 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Live location</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-safe/15 px-2.5 py-1 text-[11px] font-medium text-safe">
            <span className="size-1.5 rounded-full bg-safe" /> Sharing
          </span>
        </div>
        <div className="relative mt-4 grid h-36 place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,oklch(0.8_0.1_355/0.18),transparent_65%)]">
          <div className="absolute inset-0 bg-[linear-gradient(oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />
          <span className="absolute size-16 animate-pulse-ring rounded-full bg-primary/40" />
          <span className="absolute size-16 animate-pulse-ring rounded-full bg-primary/30 [animation-delay:1.2s]" />
          <span className="relative grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <MapPin className="size-5" />
          </span>
        </div>
        <p className="mt-4 text-sm font-medium">F-7 Markaz, Islamabad</p>
        <p className="text-xs text-muted-foreground">Updated just now · 3 contacts watching</p>
      </div>

      <div className="animate-float absolute bottom-24 left-0 w-64 rounded-3xl border border-white/10 bg-background/55 p-4 shadow-2xl backdrop-blur-xl [animation-delay:1.5s]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-sand/15 font-serif text-sand">A</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Ammi</p>
            <p className="text-xs text-muted-foreground">Received your location</p>
          </div>
          <Phone className="ml-auto size-4 text-primary" />
        </div>
      </div>

      <div className="animate-float absolute bottom-0 right-16 flex items-center gap-3 rounded-full border border-alert/30 bg-alert/15 py-2.5 pl-2.5 pr-5 shadow-2xl backdrop-blur-xl [animation-delay:3s]">
        <span className="grid size-9 place-items-center rounded-full bg-alert text-white">
          <ShieldCheck className="size-4" />
        </span>
        <span className="text-sm font-medium">You reached home safely</span>
      </div>
    </div>
  )
}
