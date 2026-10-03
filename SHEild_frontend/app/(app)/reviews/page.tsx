import type { Metadata } from 'next'
import { ReviewsView } from '@/components/app/reviews-view'

export const metadata: Metadata = { title: 'Reviews — SHEild' }

export default function ReviewsPage() {
  return <ReviewsView />
}
