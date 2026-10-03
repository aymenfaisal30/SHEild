'use client'

import { useState } from 'react'
import { MessageSquareHeart, Pencil, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from './app-shell'
import { Skeleton } from './status-badge'
import { Stars } from '@/components/reviews/stars'
import { formatRelative, initials } from '@/lib/format'
import { useReviews } from '@/lib/reviews/client'
import { REVIEW_LIMITS, type Review, type ReviewStats } from '@/lib/reviews/types'
import { cn } from '@/lib/utils'

const RATING_WORDS = ['', 'Needs work', 'Could be better', 'Good', 'Very good', 'Wonderful']

export function ReviewsView() {
  const { data, isLoading, error, ready, save, remove } = useReviews()
  const [editing, setEditing] = useState(false)
  const mine = data?.mine ?? null
  const showForm = !mine || editing

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Community"
        title="Reviews"
        description="Hear from women using SHEild across Pakistan, and share your own experience to help us improve."
      />

      {error ? (
        <p role="alert" className="glass rounded-3xl p-6 text-sm text-alert">
          Reviews could not be loaded right now. Please refresh in a moment.
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {isLoading || !data ? <Skeleton className="h-72 rounded-[1.75rem]" /> : <Summary stats={data.stats} />}

        {showForm ? (
          <ReviewForm
            key={mine?.id ?? 'new'}
            initial={mine}
            disabled={!ready}
            onCancel={mine ? () => setEditing(false) : undefined}
            onSubmit={async (input) => {
              await save(input)
              setEditing(false)
              toast.success(mine ? 'Your review has been updated.' : 'Thank you. Your review is live.')
            }}
          />
        ) : (
          <MyReview
            review={mine}
            onEdit={() => setEditing(true)}
            onDelete={async () => {
              try {
                await remove()
                toast.success('Your review was removed.')
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Could not remove review.')
              }
            }}
          />
        )}
      </div>

      <section aria-labelledby="all-reviews" className="flex flex-col gap-5">
        <div className="flex items-end justify-between">
          <h2 id="all-reviews" className="font-serif text-3xl font-light">
            What women are saying
          </h2>
          {data && <p className="text-sm text-muted-foreground">{data.stats.total} total</p>}
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-44 rounded-[1.75rem]" />
            <Skeleton className="h-44 rounded-[1.75rem]" />
          </div>
        ) : data && data.reviews.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {data.reviews.map((r, i) => (
              <li key={r.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <ReviewCard review={r} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="glass flex flex-col items-center rounded-[1.75rem] px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
              <MessageSquareHeart className="size-6" strokeWidth={1.4} aria-hidden="true" />
            </span>
            <p className="mt-5 font-serif text-2xl font-light">No reviews yet</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Be the first to share how SHEild makes you feel. Your words help other women decide.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function Summary({ stats }: { stats: ReviewStats }) {
  return (
    <section className="glass relative overflow-hidden rounded-[1.75rem] p-7 md:p-8" aria-label="Rating summary">
      <div aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-[80px]" />
      <p className="text-sm text-muted-foreground">Average rating</p>
      <div className="mt-2 flex items-end gap-3">
        <span className="text-rose-gold font-serif text-7xl font-light leading-none">
          {stats.total ? stats.average.toFixed(1) : '—'}
        </span>
        <span className="mb-2 text-sm text-muted-foreground">out of 5</span>
      </div>
      <Stars value={stats.average} className="mt-3" />
      <p className="mt-2 text-sm text-muted-foreground">
        Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
      </p>
      <div className="hairline my-6 h-px" aria-hidden="true" />
      <ul className="flex flex-col gap-2.5">
        {([5, 4, 3, 2, 1] as const).map((n) => {
          const count = stats.distribution[n]
          const pct = stats.total ? (count / stats.total) * 100 : 0
          return (
            <li key={n} className="flex items-center gap-3 text-sm">
              <span className="w-3 text-muted-foreground">{n}</span>
              <Star className="size-3.5 fill-primary/80 text-primary/80" aria-hidden="true" />
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/6">
                <span
                  className="bg-rose-gold block h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ReviewForm({
  initial,
  disabled,
  onSubmit,
  onCancel,
}: {
  initial: Review | null
  disabled: boolean
  onSubmit: (input: { rating: number; title: string; body: string }) => Promise<void>
  onCancel?: () => void
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return setError('Please choose a star rating.')
    setPending(true)
    setError(null)
    try {
      await onSubmit({ rating, title, body })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your review.')
    } finally {
      setPending(false)
    }
  }

  const shown = hover || rating

  return (
    <form onSubmit={handleSubmit} className="glass flex flex-col gap-5 rounded-[1.75rem] p-7 md:p-8">
      <div>
        <h2 className="font-serif text-3xl font-light">{initial ? 'Edit your review' : 'Share your experience'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your first name and city are shown with your review.</p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-foreground/85">Your rating</legend>
        <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              aria-pressed={rating === n}
              className="grid size-11 place-items-center rounded-full transition hover:bg-primary/10"
            >
              <Star
                strokeWidth={1.3}
                aria-hidden="true"
                className={cn(
                  'size-7 transition-all duration-200',
                  n <= shown ? 'scale-105 fill-primary text-primary' : 'text-primary/35',
                )}
              />
            </button>
          ))}
          <span className="ml-3 text-sm text-sand" aria-live="polite">
            {RATING_WORDS[shown]}
          </span>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-title" className="text-sm font-medium text-foreground/85">
          Headline
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={REVIEW_LIMITS.title.max}
          minLength={REVIEW_LIMITS.title.min}
          required
          placeholder="e.g. I feel calmer on my commute"
          className="h-12 rounded-2xl border border-input bg-background/40 px-4 text-base outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 md:text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="review-body" className="text-sm font-medium text-foreground/85">
            Your review
          </label>
          <span className="text-xs text-muted-foreground">
            {body.length}/{REVIEW_LIMITS.body.max}
          </span>
        </div>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={REVIEW_LIMITS.body.max}
          minLength={REVIEW_LIMITS.body.min}
          required
          rows={4}
          placeholder="What do you like about SHEild? What could be better?"
          className="resize-none rounded-2xl border border-input bg-background/40 px-4 py-3 text-base leading-relaxed outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 md:text-sm"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-alert/30 bg-alert/10 px-4 py-3 text-sm text-alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending || disabled}
          className="bg-rose-gold inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-7 font-semibold text-primary-foreground transition hover:brightness-105 disabled:opacity-60"
        >
          {pending && (
            <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
          )}
          {pending ? 'Saving' : initial ? 'Update review' : 'Post review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-12 rounded-full border border-white/12 px-7 text-sm font-medium transition hover:bg-white/5"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function MyReview({ review, onEdit, onDelete }: { review: Review; onEdit: () => void; onDelete: () => void }) {
  return (
    <section className="glass flex flex-col rounded-[1.75rem] p-7 md:p-8" aria-label="Your review">
      <div className="flex items-center justify-between">
        <p className="inline-flex items-center gap-2 rounded-full bg-safe/12 px-3 py-1 text-xs font-medium text-safe">
          <span className="size-1.5 rounded-full bg-safe" /> Your review is live
        </p>
        <span className="text-xs text-muted-foreground">Updated {formatRelative(review.updatedAt)}</span>
      </div>
      <Stars value={review.rating} className="mt-6" />
      <h2 className="mt-3 font-serif text-3xl font-light">{review.title}</h2>
      <p className="mt-3 leading-relaxed text-foreground/80">{review.body}</p>
      <div className="mt-auto flex gap-3 pt-8">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 px-5 text-sm font-medium text-primary transition hover:bg-primary/10"
        >
          <Pencil className="size-4" strokeWidth={1.6} aria-hidden="true" /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
        >
          <Trash2 className="size-4" strokeWidth={1.6} aria-hidden="true" /> Remove
        </button>
      </div>
    </section>
  )
}

export function ReviewCard({ review }: { review: Review }) {
  const firstName = review.authorName.split(' ')[0]
  return (
    <article className="glass flex h-full flex-col rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-0.5 hover:border-primary/25">
      <Stars value={review.rating} />
      <h3 className="mt-4 font-serif text-2xl font-normal leading-snug">{review.title}</h3>
      <p className="mt-2 flex-1 text-pretty leading-relaxed text-foreground/75">{review.body}</p>
      <div className="mt-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-primary/12 font-serif text-base text-primary">
          {initials(review.authorName)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{firstName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {review.city ? `${review.city} · ` : ''}
            {formatRelative(review.createdAt)}
          </p>
        </div>
      </div>
    </article>
  )
}
