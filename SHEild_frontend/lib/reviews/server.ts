import { neon } from '@neondatabase/serverless'
import { API_BASE_URL, ENDPOINTS, IS_DEMO_MODE } from '@/lib/api/config'
import type { User } from '@/lib/api/types'
import type { Review, ReviewStats } from './types'

const sql = neon(process.env.DATABASE_URL!)

type ReviewRow = {
  id: number
  author_key: string
  author_name: string
  city: string | null
  rating: number
  title: string
  body: string
  created_at: string
  updated_at: string
}

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    authorName: row.author_name,
    city: row.city,
    rating: Number(row.rating),
    title: row.title,
    body: row.body,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

export async function listReviews(limit = 60): Promise<Review[]> {
  const rows = (await sql`
    SELECT * FROM reviews ORDER BY created_at DESC LIMIT ${limit}
  `) as ReviewRow[]
  return rows.map(toReview)
}

export async function getReviewStats(): Promise<ReviewStats> {
  const rows = (await sql`
    SELECT rating, count(*)::int AS n FROM reviews GROUP BY rating
  `) as { rating: number; n: number }[]
  const distribution: ReviewStats['distribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let total = 0
  let sum = 0
  for (const r of rows) {
    const rating = Number(r.rating) as 1 | 2 | 3 | 4 | 5
    distribution[rating] = r.n
    total += r.n
    sum += rating * r.n
  }
  return { total, average: total ? Math.round((sum / total) * 10) / 10 : 0, distribution }
}

export async function getReviewByKey(key: string): Promise<Review | null> {
  const rows = (await sql`SELECT * FROM reviews WHERE author_key = ${key} LIMIT 1`) as ReviewRow[]
  return rows[0] ? toReview(rows[0]) : null
}

export async function upsertReview(input: {
  key: string
  authorName: string
  city: string | null
  rating: number
  title: string
  body: string
}): Promise<Review> {
  const rows = (await sql`
    INSERT INTO reviews (author_key, author_name, city, rating, title, body)
    VALUES (${input.key}, ${input.authorName}, ${input.city}, ${input.rating}, ${input.title}, ${input.body})
    ON CONFLICT (author_key) DO UPDATE SET
      author_name = EXCLUDED.author_name,
      city = EXCLUDED.city,
      rating = EXCLUDED.rating,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      updated_at = now()
    RETURNING *
  `) as ReviewRow[]
  return toReview(rows[0])
}

export async function deleteReviewByKey(key: string) {
  await sql`DELETE FROM reviews WHERE author_key = ${key}`
}

export type ReviewAuthor = { key: string; name: string; city: string | null }

/**
 * Identifies the signed-in SHEild user behind a request.
 * With a real backend the bearer token is verified against the Spring API.
 * In demo mode (no backend) the token cannot be verified server-side, so the
 * client-supplied profile is used and keyed by email.
 */
export async function resolveAuthor(req: Request): Promise<ReviewAuthor | null> {
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null

  if (!IS_DEMO_MODE) {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.me}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (!res.ok) return null
      const user = (await res.json()) as User
      return { key: `user:${user.id}`, name: user.fullName, city: user.city ?? null }
    } catch {
      return null
    }
  }

  const email = req.headers.get('x-sheild-email')?.trim().toLowerCase() ?? ''
  const name = req.headers.get('x-sheild-name')?.trim() ?? ''
  const city = req.headers.get('x-sheild-city')?.trim() || null
  if (!email || !name || email.length > 200 || name.length > 80) return null
  return { key: `demo:${email}`, name, city: city ? city.slice(0, 60) : null }
}
