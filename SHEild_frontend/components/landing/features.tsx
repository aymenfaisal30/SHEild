import { BellRing, History, MapPinned, Users } from 'lucide-react'

const FEATURES = [
  {
    icon: BellRing,
    title: 'One-press SOS',
    body: 'Hold the SOS button for three seconds and your alert is recorded with your exact location, with a one-tap call to 15 when you need help right now.',
    accent: 'bg-alert/15 text-alert',
    span: 'md:col-span-2',
  },
  {
    icon: MapPinned,
    title: 'Live location',
    body: 'Capture where you are on the way home, in a rickshaw or after late classes.',
    accent: 'bg-primary/15 text-primary',
    span: '',
  },
  {
    icon: Users,
    title: 'Trusted contacts',
    body: 'Add family and friends, choose a primary contact and keep numbers up to date.',
    accent: 'bg-sand/15 text-sand',
    span: '',
  },
  {
    icon: History,
    title: 'Private alert history',
    body: 'Every alert is logged with time, place and outcome so you always have a record when you need it.',
    accent: 'bg-safe/15 text-safe',
    span: 'md:col-span-2',
  },
]

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Why SHEild</p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Quiet protection that is there the moment you need it.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Designed with women across Pakistan to be fast under pressure, discreet in public and respectful of your privacy.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, accent, span }) => (
            <article
              key={title}
              className={`group glass rounded-[1.75rem]/60 p-7 transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-card md:p-9 ${span}`}
            >
              <span className={`grid size-12 place-items-center rounded-2xl ${accent}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-8 font-serif text-2xl font-medium">{title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
