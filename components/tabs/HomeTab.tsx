'use client'

import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'

interface HomeTabProps {
  onTabChange?: (tab: string) => void
}

export default function HomeTab({ onTabChange }: HomeTabProps) {
  return (
    <div className="relative -mx-2 sm:-mx-4">
      <HeroSection onLaunchOptimizer={() => onTabChange?.('summary')} />
      <FeaturesSection onLaunchOptimizer={() => onTabChange?.('summary')} />
    </div>
  )
}
