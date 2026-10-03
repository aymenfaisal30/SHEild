export function DemoBanner() {
  return (
    <div className="bg-alert/15 px-4 py-2 text-center text-xs text-foreground/90">
      Student project: SOS alerts are recorded with your location but not yet sent to contacts. In an emergency, call{' '}
      <a href="tel:15" className="font-semibold underline">
        15
      </a>
      .
    </div>
  )
}
