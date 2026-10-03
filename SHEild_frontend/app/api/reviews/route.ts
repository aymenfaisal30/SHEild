import { NextResponse } from 'next/server'
import {
  deleteReviewByKey,
  getReviewByKey,
  getReviewStats,
  listReviews,
  resolveAuthor,
  upsertReview,
} from '@/lib/reviews/server'
import { REVIEW_LIMITS, type ReviewsResponse } from '@/lib/reviews/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const author = await resolveAuthor(req)
  const [reviews, stats, mine] = await Promise.all([
    listReviews(),
    getReviewStats(),
    author ? getReviewByKey(author.key) : Promise.resolve(null),
  ])
  return NextResponse.json<ReviewsResponse>({ reviews, stats, mine })
}

export async function POST(req: Request) {
  const author = await resolveAuthor(req)
  if (!author) return NextResponse.json({ message: 'Please log in to leave a review.' }, { status: 401 })

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }
  const { rating, title, body } = (payload ?? {}) as Record<string, unknown>

  const r = Number(rating)
  const t = typeof title === 'string' ? title.trim() : ''
  const b = typeof body === 'string' ? body.trim() : ''

  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return NextResponse.json({ message: 'Choose a rating from 1 to 5 stars.' }, { status: 400 })
  }
  if (t.length < REVIEW_LIMITS.title.min || t.length > REVIEW_LIMITS.title.max) {
    return NextResponse.json(
      { message: `Title should be ${REVIEW_LIMITS.title.min}–${REVIEW_LIMITS.title.max} characters.` },
      { status: 400 },
    )
  }
  if (b.length < REVIEW_LIMITS.body.min || b.length > REVIEW_LIMITS.body.max) {
    return NextResponse.json(
      { message: `Review should be ${REVIEW_LIMITS.body.min}–${REVIEW_LIMITS.body.max} characters.` },
      { status: 400 },
    )
  }

  const review = await upsertReview({
    key: author.key,
    authorName: author.name,
    city: author.city,
    rating: r,
    title: t,
    body: b,
  })
  return NextResponse.json(review)
}

export async function DELETE(req: Request) {
  const author = await resolveAuthor(req)
  if (!author) return NextResponse.json({ message: 'Please log in.' }, { status: 401 })
  await deleteReviewByKey(author.key)
  return new NextResponse(null, { status: 204 })
}
