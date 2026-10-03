import type { Metadata } from 'next'
import { ContactsView } from '@/components/app/contacts-view'

export const metadata: Metadata = { title: 'Emergency contacts — SHEild' }

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { welcome } = await searchParams
  return <ContactsView welcome={welcome === '1'} />
}
