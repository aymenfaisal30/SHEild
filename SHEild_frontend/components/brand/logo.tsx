import Link from 'next/link'
import { useId } from 'react'
import { cn } from '@/lib/utils'

export function ShieldMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3DEC8" />
          <stop offset="0.5" stopColor="#E8B4A0" />
          <stop offset="1" stopColor="#C98670" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 5 6.6v8.2c0 6.9 4.6 12.6 11 14.7 6.4-2.1 11-7.8 11-14.7V6.6L16 2.5Z"
        stroke={`url(#${id}-g)`}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 10.2c-1.4-1.8-4.6-1.5-4.6 1.3 0 2.5 3 4.4 4.6 5.8 1.6-1.4 4.6-3.3 4.6-5.8 0-2.8-3.2-3.1-4.6-1.3Z"
        fill={`url(#${id}-g)`}
      />
      <path d="M11 21.5h10" stroke={`url(#${id}-g)`} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4',
        className,
      )}
      aria-label="SHEild home"
    >
      <ShieldMark className="size-8 transition-transform duration-500 group-hover:scale-105" />
      <span className="font-serif text-2xl font-medium tracking-tight text-foreground">
        <span className="text-rose-gold">SHE</span>ild
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
