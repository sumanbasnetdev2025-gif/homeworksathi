'use client'

import { useLanguage } from '@/hooks/useLanguage'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import SubjectsSection from '@/components/landing/SubjectsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import PricingSection from '@/components/landing/PricingSection'
import CtaSection from '@/components/landing/CtaSection'

export default function HomePage() {
  const { language, switchLanguage } = useLanguage()

  return (
    <main className="min-h-screen bg-[#0a0f1e] overflow-x-hidden">
      <Navbar language={language} onLanguageSwitch={switchLanguage} />
      <HeroSection />
      <SubjectsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}