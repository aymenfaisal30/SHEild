import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2', className)}
      aria-label="SHEild home"
    >
      <span className="relative grid size-9 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30 transition-colors group-hover:bg-primary/25">
        <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
      </span>
      <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
        <span className="text-primary">SHE</span>ild
      </span>
    </Link>
  )
}

export function UrduTagline({ className }: { className?: string }) {
  return (
    <p lang="ur" dir="rtl" className={cn('font-urdu leading-[2.1] text-sand', className)}>
      حفاظت آپ کی، فکر ہماری
    </p>
  )
}
