'use client'

import { useState } from 'react'
import { Field, FormError } from '@/components/auth/field'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { ContactRelation, EmergencyContact, EmergencyContactInput } from '@/lib/api/types'

const RELATIONS: ContactRelation[] = ['Mother', 'Father', 'Sister', 'Brother', 'Spouse', 'Friend', 'Colleague', 'Other']
const PHONE_PATTERN = /^(\+92|0)3\d{9}$/

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: EmergencyContact | null
  onSubmit: (data: EmergencyContactInput) => Promise<void>
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const phone = String(form.get('contactPhone')).trim()
    if (!PHONE_PATTERN.test(phone.replace(/[\s-]/g, ''))) {
      setError('Enter a valid Pakistani mobile number, e.g. 0300 1234567.')
      return
    }
    setPending(true)
    setError(null)
    try {
      await onSubmit({
        name: String(form.get('contactName')).trim(),
        phone,
        relation: String(form.get('relation')) as ContactRelation,
        isPrimary: form.get('isPrimary') === 'on',
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save contact.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null)
        onOpenChange(next)
      }}
    >
      <DialogContent className="rounded-3xl border-border bg-card p-7 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-medium">{contact ? 'Edit contact' : 'Add trusted contact'}</DialogTitle>
          <DialogDescription>They will receive your location whenever you trigger an SOS.</DialogDescription>
        </DialogHeader>
        <form key={contact?.id ?? 'new'} onSubmit={handleSubmit} className="mt-2 flex flex-col gap-5">
          <Field id="contactName" label="Name" placeholder="e.g. Ammi" defaultValue={contact?.name} required />
          <Field
            id="contactPhone"
            label="Mobile number"
            type="tel"
            placeholder="0300 1234567"
            defaultValue={contact?.phone}
            required
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="relation" className="text-sm font-medium text-foreground/85">
              Relation
            </Label>
            <select
              id="relation"
              name="relation"
              defaultValue={contact?.relation ?? 'Mother'}
              className="h-12 rounded-xl border border-input bg-card/60 px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              {RELATIONS.map((r) => (
                <option key={r} value={r} className="bg-card">
                  {r}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
            <input
              type="checkbox"
              name="isPrimary"
              defaultChecked={contact?.isPrimary}
              className="size-4 accent-[var(--primary)]"
            />
            <span>
              <span className="block text-sm font-medium">Primary contact</span>
              <span className="text-xs text-muted-foreground">Shown first and contacted first in an emergency.</span>
            </span>
          </label>
          <FormError message={error} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-12 flex-1 rounded-full border border-border font-medium transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="h-12 flex-1 rounded-full bg-primary font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {pending ? 'Saving' : 'Save contact'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
