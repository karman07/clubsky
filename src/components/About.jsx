import React, { useEffect, useRef } from 'react'
import Reveal from './Reveal'
import { asset } from '../utils/asset'
import { Link } from 'react-router-dom'

export default function About() {
  const titleRef = useRef(null)
  
  useEffect(() => {
    const onScroll = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight))
        const scale = 1 + progress * 0.1
        titleRef.current.style.transform = `scale(${scale})`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="about" className="container-gutter max-w-6xl mx-auto py-16 sm:py-24">
      <Reveal className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-3xl overflow-hidden ring-1 ring-white/10">
          <img src={asset('/PHOTO-2025-08-13-17-57-53 3.jpg')} alt="Club Skyshot collage" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="section-eyebrow">Welcome</p>
          <h2 ref={titleRef} className="section-title font-display transition-transform duration-300 will-change-transform">Premium pickleball in an elegant setting</h2>
            <p className="mt-4 text-cream-300/90">First pickleball club in Tricity with asphalt‑base European courts • The most luxurious and biggest club in the region. Rackets and balls are available on‑site, and after your game, unwind at our cozy café.</p>
          <div className="mt-6 flex gap-3">
            <a href="#amenities" className="btn-ghost">See amenities</a>
            <a href="#contact" className="btn-primary">Contact us</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}