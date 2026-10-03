import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react'
import { UrduTagline } from '@/components/brand/logo'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
      <div aria-hidden="true" className="absolute -left-40 top-20 -z-10 size-[32rem] rounded-full bg-[oklch(0.45_0.12_320/0.25)] blur-[140px]" />
      <div aria-hidden="true" className="absolute -right-24 top-1/3 -z-10 size-[30rem] rounded-full bg-primary/15 blur-[140px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="max-w-2xl">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Personal safety, made for Pakistan
          </p>
          <h1 className="animate-fade-up mt-7 text-balance font-serif text-[3.25rem] font-light leading-[0.98] tracking-tight [animation-delay:100ms] sm:text-7xl lg:text-[5.5rem]">
            The city is yours, <em className="text-rose-gold font-normal">day or night.</em>
          </h1>
          <UrduTagline className="animate-fade-up mt-6 text-right text-2xl [animation-delay:200ms] sm:text-3xl lg:text-left" />
          <p className="animate-fade-up mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:300ms]">
            Record an SOS with your live location in one press, keep your trusted contacts in one place, and reach help
            across Pakistan.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 [animation-delay:400ms] sm:flex-row">
            <Link
              href="/signup"
              className="bg-rose-gold group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_14px_40px_-14px] shadow-primary/70 transition hover:brightness-105"
            >
              Create free account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/25 px-8 py-4 text-base font-medium text-foreground transition hover:border-primary/50 hover:bg-primary/5"
            >
              See how it works
            </a>
          </div>
          <dl className="animate-fade-up mt-14 grid max-w-md grid-cols-3 gap-6 [animation-delay:500ms]">
            {[
              ['3 sec', 'Hold to record'],
              ['5', 'Trusted contacts'],
              ['Free', 'For every woman'],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-primary/25 pl-4">
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-3xl font-light text-foreground">{value}</dd>
                <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up relative mx-auto w-full max-w-md [animation-delay:250ms] lg:max-w-lg">
          <div aria-hidden="true" className="absolute inset-8 -z-10 rounded-full bg-primary/25 blur-[90px]" />
          <div className="glass relative overflow-hidden rounded-[2.5rem] p-2">
            <Image
              src="/images/hero-phone.png"
              alt="A hand holding a phone running SHEild, showing a live route on a city map with trusted women contacts and an SOS button"
              width={896}
              height={1200}
              priority
              className="h-auto w-full rounded-[2.1rem]"
            />
            <div aria-hidden="true" className="absolute inset-x-2 bottom-2 h-1/3 rounded-b-[2.1rem] bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div
            aria-hidden="true"
            className="glass animate-float absolute -left-4 bottom-16 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-10"
          >
            <span className="grid size-9 place-items-center rounded-full bg-safe/15 text-safe">
              <ShieldCheck className="size-4" />
            </span>
            <span className="text-sm">
              <span className="block font-medium">Alert recorded</span>
              <span className="text-xs text-muted-foreground">With your location</span>
            </span>
          </div>
          <div
            aria-hidden="true"
            className="glass animate-float absolute -right-3 top-10 hidden items-center gap-2 rounded-full px-4 py-2 text-xs [animation-delay:2s] sm:flex"
          >
            <MapPin className="size-3.5 text-primary" />
            F-7 Markaz, Islamabad
          </div>
        </div>
      </div>
    </section>
  )
}
