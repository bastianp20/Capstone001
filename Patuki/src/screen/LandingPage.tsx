import '../styles/global.css'
import MockupBadge from '../components/MockupBadge/MockupBadge'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import Partners from '../components/Partners/Partners'
import Features from '../components/Features/Features'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import MatchSection from '../components/MatchSection/MatchSection'
import NetworkSection from '../components/NetworkSection/NetworkSection'
import Testimonial from '../components/Testimonial/Testimonial'
import CTASection from '../components/CTASection/CTASection'
import Footer from '../components/Footer/Footer'

function LandingPage() {
  return (
    <>
      <MockupBadge />
      <Navbar />
      <Hero />
      <Partners />
      <Features />
      <HowItWorks />
      <MatchSection />
      <NetworkSection />
      <Testimonial />
      <CTASection />
      <Footer />
    </>
  )
}

export default LandingPage
