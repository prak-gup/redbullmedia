'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onLaunchOptimizer?: () => void
}

export default function HeroSection({ onLaunchOptimizer }: HeroSectionProps) {
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoSection = videoSectionRef.current
    const video = videoRef.current

    if (!videoSection || !video) return

    // Ensure video is loaded before setting up scroll
    const setupScrollAnimation = () => {
      if (video.readyState < 2) {
        video.addEventListener('loadedmetadata', setupScrollAnimation, { once: true })
        return
      }

      // Set up scroll-triggered video playback
      ScrollTrigger.create({
        trigger: videoSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress))
          // Control video playback based on scroll
          if (video.duration && !isNaN(video.duration)) {
            video.currentTime = video.duration * progress
          }
        },
      })
    }

    // Start video playback
    video.play().catch(() => {
      // Autoplay blocked, user interaction required
    })

    setupScrollAnimation()

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === videoSection) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <>
      {/* Video Section */}
      <section
        ref={videoSectionRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          loop
          preload="auto"
        >
          <source
            src="/assets/A_cinematic_ultrarealistic_202601140947_wmm.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* CTA at bottom of video */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-12 pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  onLaunchOptimizer?.()
                }}
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-white/90 hover:scale-105"
              >
                Launch Optimizer
              </button>
              <button
                onClick={() => {
                  const featuresSection = document.getElementById('features')
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="rounded-full border-2 border-white/80 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Text Section Below Video */}
      <section className="bg-black py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            Cross-Media Campaign
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Optimizer
            </span>
          </h1>
          <p className="mb-4 text-xl text-white/90 md:text-2xl">
            Maximize ATC with AI-powered media allocation across TV, Digital,
            and SYNC platforms
          </p>
          <p className="text-sm text-white/70">
            Powered by <span className="font-semibold text-emerald-400">SYNC</span>
          </p>
        </div>
      </section>
    </>
  )
}
