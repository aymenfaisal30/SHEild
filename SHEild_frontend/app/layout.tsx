import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito, Noto_Nastaliq_Urdu } from 'next/font/google'
import { Toaster } from 'sonner'
import { DemoBanner } from '@/components/demo-banner'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' })
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-nastaliq',
})

export const metadata: Metadata = {
  title: 'SHEild — Personal Safety for Women in Pakistan',
  description:
    'SHEild keeps you connected to the people who matter. One-tap SOS, live location sharing and trusted contacts, built for women across Pakistan.',
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
  themeColor: '#1f1030',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fredoka.variable} ${nastaliq.variable} bg-background`}
    >
      <body className="antialiased">
        <DemoBanner />
        {children}
        <Toaster theme="dark" position="top-center" richColors closeButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
