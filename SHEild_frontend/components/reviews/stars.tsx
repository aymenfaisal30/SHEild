import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          strokeWidth={1.4}
          className={cn('size-4', n <= Math.round(value) ? 'fill-primary text-primary' : 'text-primary/30')}
        />
      ))}
    </span>
  )
}
