import React, { useEffect, useRef, useState } from 'react'
import site from '../config/site'
import { asset } from '../utils/asset'
import { galleryImages } from '../utils/images'
import { Link } from 'react-router-dom'

export default function Hero() {
  const sectionRef = useRef(null)
  const [index, setIndex] = useState(0)
  // Background slideshow: change image every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % galleryImages.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="relative overflow-hidden min-h-screen flex items-center rounded-b-[28px]">
      {/* Background slideshow layers */}
      <div className="absolute inset-0 -z-10">
        {/* Layer all images and crossfade by toggling opacity */}
        {galleryImages.map((src, i) => (
          <img
            key={src}
            src={asset(src)}
            alt="Club Skyshot background"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{ filter: 'brightness(0.5) saturate(1.05)' }}
          />
        ))}
        {/* Overlay gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-900/60 to-brand-900/90" />
      </div>

      {/* Content */}
      <div className="container-gutter max-w-6xl mx-auto py-24 sm:py-28 text-center">
        <img src={asset('/Screenshot 2025-08-13 at 7.23.04 PM.png')} alt="Club Skyshot" className="mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full object-contain bg-brand-800/40 ring-1 ring-white/10" />
        <h1 className="mt-8 text-5xl sm:text-6xl font-display font-semibold tracking-tight text-cream-50 drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">Club Skyshot</h1>
        <p className="mt-3 text-cream-200/90 font-medium uppercase tracking-[0.18em]">The Luxury Pickle Zone</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/book" className="btn-primary">Book Slot</Link>
          <a href="#about" className="btn-ghost">Explore</a>
        </div>
      </div>
    </section>
  )
}
