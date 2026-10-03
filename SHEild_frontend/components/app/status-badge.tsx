import type { SosStatus } from '@/lib/api/types'
import { cn } from '@/lib/utils'

const STYLES: Record<SosStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Active', className: 'bg-alert/15 text-alert' },
  RESOLVED: { label: 'Resolved', className: 'bg-safe/15 text-safe' },
  CANCELLED: { label: 'Cancelled', className: 'bg-white/8 text-muted-foreground' },
}

export function StatusBadge({ status }: { status: SosStatus }) {
  const s = STYLES[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', s.className)}>
      <span className={cn('size-1.5 rounded-full bg-current', status === 'ACTIVE' && 'animate-pulse')} />
      {s.label}
    </span>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-white/5', className)} />
}
