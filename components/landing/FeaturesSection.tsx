'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FeaturesSectionProps {
  onLaunchOptimizer?: () => void
}

interface Feature {
  icon: string
  title: string
  description: string
  highlight?: boolean
}

const features: Feature[] = [
  {
    icon: '🎯',
    title: 'Impact-Based Channel Allocation',
    description:
      'Intelligent TV channel optimization using impact scores, ensuring high-performing channels receive optimal budget allocation.',
  },
  {
    icon: '📈',
    title: 'Advanced Analytics Dashboard',
    description:
      'Comprehensive metrics visualization with baseline vs optimized comparisons, regional breakdowns, and efficiency indices.',
  },
  {
    icon: '⚡',
    title: 'SYNC Integration',
    description:
      'Seamlessly integrate SYNC media performance data with cost efficiency between YouTube and JioHotstar for maximum ROI.',
    highlight: true,
  },
  {
    icon: '🔄',
    title: 'Optimal Plan Generator',
    description:
      'Generate optimal media plans with 81/19 YouTube-JioHotstar split, automatically reallocating TV budgets for maximum ATC delivery.',
  },
  {
    icon: '📋',
    title: 'Plan Comparison Tool',
    description:
      'Evaluate new client plans against baseline metrics with normalized comparisons, efficiency indices, and ATC improvement analysis.',
  },
]

export default function FeaturesSection({ onLaunchOptimizer }: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const features = featuresRef.current

    if (!section || !features) return

    // Animate features on scroll
    const featureCards = features.querySelectorAll('.feature-card')

    featureCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1,
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-4xl md:text-5xl">
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Media Excellence
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            Leverage advanced optimization algorithms and SYNC-powered insights
            to maximize your campaign&apos;s Attention To Content (ATC) performance
            across all media channels.
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={featuresRef}
          className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card rounded-xl border p-6 transition-all sm:rounded-2xl sm:p-8 sm:hover:shadow-xl ${
                feature.highlight
                  ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-white shadow-lg'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mb-3 text-3xl sm:mb-4 sm:text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 sm:text-base">{feature.description}</p>
              {feature.highlight && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="text-emerald-500">⚡</span>
                  Powered by SYNC
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center sm:mt-16 md:mt-20">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white sm:rounded-3xl sm:p-12">
            <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-3xl">
              Ready to Optimize Your Campaign?
            </h3>
            <p className="mb-6 text-sm text-slate-300 sm:mb-8 sm:text-base md:text-lg">
              Start maximizing ATC with our advanced cross-media optimization
              platform powered by SYNC.
            </p>
            <button
              onClick={() => {
                onLaunchOptimizer?.()
              }}
              className="w-full rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all active:bg-white/90 sm:w-auto sm:px-8 sm:py-4 sm:text-lg sm:hover:bg-white/90 sm:hover:scale-105"
            >
              Launch Optimizer Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
