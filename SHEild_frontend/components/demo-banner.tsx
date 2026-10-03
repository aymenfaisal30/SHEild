export function DemoBanner() {
  return (
    <div className="relative z-[60] border-b border-white/5 bg-[oklch(0.13_0.035_308)] px-4 py-2 text-center text-xs leading-relaxed text-muted-foreground">
      Student project: SOS alerts are recorded with your location but not yet sent to contacts. In an emergency, call{' '}
      <a href="tel:15" className="font-semibold text-sand underline underline-offset-2">
        15
      </a>
      .
    </div>
  )
}
