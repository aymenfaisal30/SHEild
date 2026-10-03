const STEPS = [
  {
    n: '01',
    title: 'Create your account',
    body: 'Sign up with your name, phone and city. It takes less than a minute.',
  },
  {
    n: '02',
    title: 'Build your circle',
    body: 'Add up to five trusted contacts and mark the one who should hear from you first.',
  },
  {
    n: '03',
    title: 'Press when it matters',
    body: 'Hold SOS for three seconds. Your alert is saved with your location and you can call 15 in one tap.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-card/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl text-balance font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Set up once. Feel safer every day.
          </h2>
          <p className="max-w-sm text-muted-foreground">Three simple steps between you and peace of mind.</p>
        </div>
        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <li key={step.n} className="relative border-t border-primary/30 pt-8">
              <span className="font-serif text-5xl text-primary/80">{step.n}</span>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
