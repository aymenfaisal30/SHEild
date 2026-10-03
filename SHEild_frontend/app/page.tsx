import { Features } from '@/components/landing/features'
import { FinalCta, Helplines } from '@/components/landing/helplines-cta'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { SosShowcase } from '@/components/landing/sos-showcase'
import { Testimonials } from '@/components/landing/testimonials'

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SosShowcase />
        <Testimonials />
        <Helplines />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
