'use client'

import { useState } from 'react'
import { Pencil, Phone, Plus, Star, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from './app-shell'
import { ContactFormDialog } from './contact-form-dialog'
import { Skeleton } from './status-badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { contactService } from '@/lib/api/services'
import type { EmergencyContact, EmergencyContactInput } from '@/lib/api/types'
import { useContacts } from '@/lib/hooks'

const MAX_CONTACTS = 5

export function ContactsView({ welcome }: { welcome: boolean }) {
  const { data: contacts, isLoading, mutate } = useContacts()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<EmergencyContact | null>(null)
  const [deleting, setDeleting] = useState<EmergencyContact | null>(null)

  const count = contacts?.length ?? 0
  const atLimit = count >= MAX_CONTACTS

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  async function handleSave(data: EmergencyContactInput) {
    if (editing) {
      await contactService.update(editing.id, data)
      toast.success(`${data.name} updated`)
    } else {
      await contactService.create(data)
      toast.success(`${data.name} added to your circle`)
    }
    await mutate()
  }

  async function handleDelete() {
    if (!deleting) return
    const target = deleting
    setDeleting(null)
    try {
      await mutate(
        async (current) => {
          await contactService.remove(target.id)
          return current?.filter((c) => c.id !== target.id)
        },
        { optimisticData: contacts?.filter((c) => c.id !== target.id), rollbackOnError: true, revalidate: true },
      )
      toast.success(`${target.name} removed`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not remove contact')
    }
  }

  const sorted = contacts ? [...contacts].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)) : []

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Your circle"
        title="Emergency contacts"
        description="The people who will receive your location and alert when you trigger an SOS."
        action={
          <button
            type="button"
            onClick={openCreate}
            disabled={atLimit}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" /> Add contact
          </button>
        }
      />

      {welcome && count === 0 && (
        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5">
          <p className="font-semibold text-primary">Welcome to SHEild</p>
          <p className="mt-1 text-sm text-foreground/75">
            Start by adding at least one trusted contact so we know who to alert in an emergency.
          </p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${(count / MAX_CONTACTS) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {count} of {MAX_CONTACTS} contacts
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <UserPlus className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-serif text-2xl font-medium">No contacts yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add family or friends you trust. You can add up to five people.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Add your first contact
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {sorted.map((c, i) => (
            <li
              key={c.id}
              className="animate-fade-up group flex flex-col rounded-3xl border border-border bg-card p-6 transition hover:border-primary/30"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sand/15 font-serif text-xl text-sand">
                  {c.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold">{c.name}</h2>
                    {c.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sand/15 px-2 py-0.5 text-[11px] font-medium text-sand">
                        <Star className="size-3" aria-hidden="true" /> Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.relation}</p>
                  <p className="mt-1 font-mono text-sm text-foreground/85">{c.phone}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                <a
                  href={`tel:${c.phone.replace(/[\s-]/g, '')}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary/12 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/20"
                >
                  <Phone className="size-4" aria-hidden="true" /> Call
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(c)
                    setFormOpen(true)
                  }}
                  className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
                  aria-label={`Edit ${c.name}`}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(c)}
                  className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
                  aria-label={`Remove ${c.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ContactFormDialog open={formOpen} onOpenChange={setFormOpen} contact={editing} onSubmit={handleSave} />

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This contact will be removed from your circle.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep contact</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
