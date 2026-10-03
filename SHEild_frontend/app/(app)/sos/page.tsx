import type { Metadata } from 'next'
import { SosView } from '@/components/app/sos-view'

export const metadata: Metadata = { title: 'SOS — SHEild' }

export default function SosPage() {
  return <SosView />
}
