import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ReviewCard } from '@/components/app/reviews-view'
import { Stars } from '@/components/reviews/stars'
import { getReviewStats, listReviews } from '@/lib/reviews/server'

export async function Testimonials() {
  const [reviews, stats] = await Promise.all([listReviews(6), getReviewStats()]).catch(
    () => [[], { total: 0, average: 0 }] as const,
  )

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary">In their words</p>
            <h2 id="reviews-title" className="mt-3 text-balance font-serif text-5xl font-light tracking-tight md:text-6xl">
              Loved by women <em className="text-rose-gold">across Pakistan.</em>
            </h2>
          </div>
          {stats.total > 0 && (
            <div className="glass flex items-center gap-4 rounded-full px-6 py-3">
              <span className="font-serif text-3xl font-light">{stats.average.toFixed(1)}</span>
              <span>
                <Stars value={stats.average} />
                <span className="block text-xs text-muted-foreground">{stats.total} reviews</span>
              </span>
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.id}>
                <ReviewCard review={r} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="glass mt-12 rounded-[1.75rem] px-6 py-14 text-center">
            <p className="font-serif text-3xl font-light">Be the first voice.</p>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Create an account, try SHEild, and tell other women what you think.
            </p>
          </div>
        )}

        <Link
          href="/signup"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Join and share your review <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
