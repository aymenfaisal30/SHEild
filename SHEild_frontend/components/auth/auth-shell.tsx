import Image from 'next/image'
import { Logo, UrduTagline } from '@/components/brand/logo'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="animate-fade-up font-serif text-4xl font-medium tracking-tight">{title}</h1>
          <p className="animate-fade-up mt-3 text-muted-foreground [animation-delay:80ms]">{subtitle}</p>
          <div className="animate-fade-up mt-10 [animation-delay:160ms]">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground lg:text-left">In an emergency, always call 15.</p>
      </main>
      <aside className="relative hidden overflow-hidden lg:block" aria-hidden="true">
        <Image
          src="/images/faisal-mosque-night.jpg"
          alt=""
          fill
          sizes="50vw"
          className="animate-ken-burns object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-14">
          <UrduTagline className="text-4xl" />
          <p className="mt-4 max-w-sm font-serif text-2xl leading-snug text-foreground/90">
            Your trusted circle, one press away, wherever the night takes you.
          </p>
        </div>
      </aside>
    </div>
  )
}
