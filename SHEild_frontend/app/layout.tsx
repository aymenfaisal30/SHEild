import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans, Noto_Nastaliq_Urdu } from 'next/font/google'
import { Toaster } from 'sonner'
import { DemoBanner } from '@/components/demo-banner'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-nastaliq',
})

export const metadata: Metadata = {
  title: 'SHEild — Personal safety for women in Pakistan',
  description:
    'SHEild lets you record an SOS with your live location in one press, keep trusted contacts close and reach helplines across Pakistan.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#140B1F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${nastaliq.variable} bg-background`}>
      <body className="antialiased">
        <DemoBanner />
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          closeButton
          toastOptions={{
            classNames: {
              toast:
                '!rounded-2xl !border !border-white/10 !bg-[oklch(0.23_0.06_305/0.92)] !text-foreground !backdrop-blur-xl !font-sans',
              description: '!text-muted-foreground',
              success: '[&_[data-icon]]:!text-safe',
              error: '[&_[data-icon]]:!text-alert',
              warning: '[&_[data-icon]]:!text-sand',
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
