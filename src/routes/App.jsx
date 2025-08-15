import React from 'react'
// Navbar removed per request
import ScrollProgress from '../components/ScrollProgress'
import Hero from '../components/Hero'
import SectionDivider from '../components/SectionDivider'
import About from '../components/About'
import Gallery from '../components/Gallery'
import Amenities from '../components/Amenities'
import Guests from '../components/Guests'
import Hours from '../components/Hours'
import Location from '../components/Location'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import StickyBookButton from '../components/StickyBookButton'
import Navbar from '../components/Navbar'
import "../index.css";
export default function App() {
  return (
    <>
      <ScrollProgress />
      <StickyBookButton />
      <main>
        <Navbar />
        <Hero />
        <SectionDivider />
        <About />
        <Gallery />
        <Amenities />
        <Guests />
        <Hours />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
