import type { Metadata } from 'next'
import { HistoryView } from '@/components/app/history-view'

export const metadata: Metadata = { title: 'SOS history — SHEild' }

export default function HistoryPage() {
  return <HistoryView />
}
