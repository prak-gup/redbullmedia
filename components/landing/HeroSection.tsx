'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onLaunchOptimizer?: () => void
}

export default function HeroSection({ onLaunchOptimizer }: HeroSectionProps) {
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true) // Start muted to allow autoplay

  useEffect(() => {
    const videoSection = videoSectionRef.current
    const video = videoRef.current

    if (!videoSection || !video) return

    // Check if mobile device
    const isMobile = window.innerWidth < 768

    // Ensure video is loaded before setting up scroll
    const setupScrollAnimation = () => {
      if (video.readyState < 2) {
        video.addEventListener('loadedmetadata', setupScrollAnimation, { once: true })
        return
      }

      // On mobile, just play video normally without scroll scrubbing for better performance
      if (isMobile) {
        video.play().catch(() => {
          // Autoplay blocked, user interaction required
        })
        return
      }

      // Set up scroll-triggered video playback for desktop
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

    // Set mute state
    video.muted = isMuted

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
  }, [isMuted])

  // Update video mute state when isMuted changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  return (
    <>
      {/* Video Section */}
      <section
        ref={videoSectionRef}
        className="relative h-[60vh] w-full overflow-hidden bg-black sm:h-[70vh] md:h-screen"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          loop
          preload="auto"
        >
          <source
            src="/assets/A_cinematic_ultrarealistic_202601140947_wmm.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-black/70 active:scale-95 sm:w-14 sm:h-14"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* CTA at bottom of video */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-6 pt-16 sm:px-6 sm:pb-12 sm:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <button
                onClick={() => {
                  onLaunchOptimizer?.()
                }}
                className="w-full rounded-full bg-white px-6 py-3 text-base font-semibold text-black transition-all active:bg-white/90 sm:w-auto sm:px-8 sm:py-4 sm:text-lg sm:hover:bg-white/90 sm:hover:scale-105"
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
                className="w-full rounded-full border-2 border-white/80 bg-transparent px-6 py-3 text-base font-semibold text-white transition-all active:border-white active:bg-white/10 sm:w-auto sm:px-8 sm:py-4 sm:text-lg sm:hover:border-white sm:hover:bg-white/10"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Text Section Below Video */}
      <section className="bg-black py-12 px-4 sm:py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:mb-6 sm:text-5xl md:text-7xl lg:text-8xl">
            Cross-Media Campaign
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Optimizer
            </span>
          </h1>
          <p className="mb-3 text-base text-white/90 sm:mb-4 sm:text-xl md:text-2xl">
            Maximize ATC with AI-powered media allocation across TV, Digital,
            and SYNC platforms
          </p>
          <p className="text-xs text-white/70 sm:text-sm">
            Powered by <span className="font-semibold text-emerald-400">SYNC</span>
          </p>
        </div>
      </section>
    </>
  )
}
