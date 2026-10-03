import { Logo, ShieldMark, UrduTagline } from '@/components/brand/logo'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1fr]">
      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="glass animate-fade-up rounded-[1.75rem] p-7 sm:p-9">
            <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
            <div className="hairline mt-7 h-px" aria-hidden="true" />
            <div className="mt-7">{children}</div>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground lg:text-left">In an emergency, always call 15.</p>
      </main>

      <aside
        className="relative hidden overflow-hidden border-l border-white/5 bg-[oklch(0.19_0.055_310)] lg:flex lg:flex-col lg:justify-end"
        aria-hidden="true"
      >
        <div className="absolute -right-32 -top-32 size-[34rem] rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 size-[30rem] rounded-full bg-[oklch(0.45_0.14_320/0.4)] blur-[130px]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative grid size-80 place-items-center">
            <span className="absolute inset-0 rounded-full border border-primary/15" />
            <span className="absolute inset-10 rounded-full border border-primary/20" />
            <span className="absolute inset-20 rounded-full border border-primary/30" />
            <ShieldMark className="animate-float relative size-24 drop-shadow-[0_10px_40px_oklch(0.82_0.07_40/0.5)]" />
          </div>
        </div>
        <div className="relative p-14">
          <UrduTagline className="text-4xl" />
          <p className="mt-4 max-w-sm font-serif text-3xl font-light leading-snug text-foreground/90">
            Your trusted circle, one press away, wherever the night takes you.
          </p>
        </div>
      </aside>
    </div>
  )
}
