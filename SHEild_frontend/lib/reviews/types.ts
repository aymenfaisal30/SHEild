export interface Review {
  id: number
  authorName: string
  city: string | null
  rating: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  total: number
  average: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}

export interface ReviewsResponse {
  reviews: Review[]
  stats: ReviewStats
  mine: Review | null
}

export const REVIEW_LIMITS = {
  title: { min: 3, max: 80 },
  body: { min: 10, max: 600 },
} as const
