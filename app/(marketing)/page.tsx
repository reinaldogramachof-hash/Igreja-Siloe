import type { Metadata } from "next"
import { brand } from "@/lib/brand"
import { Navbar } from "./_components/navbar"
import { Hero } from "./_components/hero"
import { ModulesSection } from "./_components/modules-section"
import { DifferentialsSection } from "./_components/differentials-section"
import { PricingSection } from "./_components/pricing-section"
import { FaqSection } from "./_components/faq-section"
import { CtaSection } from "./_components/cta-section"
import { Footer } from "./_components/footer"

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
}

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ModulesSection />
        <DifferentialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
