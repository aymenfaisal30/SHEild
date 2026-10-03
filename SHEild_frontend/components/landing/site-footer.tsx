import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Personal safety for every woman in Pakistan.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#helplines" className="hover:text-foreground">Helplines</a>
          <Link href="/login" className="hover:text-foreground">Log in</Link>
          <Link href="/signup" className="hover:text-foreground">Sign up</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-10 text-xs text-muted-foreground md:px-8">
        {'© '}
        {new Date().getFullYear()} SHEild. In an emergency, always call 15.
      </div>
    </footer>
  )
}
