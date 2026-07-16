import { NavBar } from './components/NavBar'
import { Hero } from './components/Hero'
import { SocialProof } from './components/SocialProof'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { InteractiveDemo } from './components/InteractiveDemo'
import { FAQ } from './components/FAQ'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { Auth } from './components/Auth'


function App() {
  return (
    <Auth>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Hero />
          <SocialProof />
          <HowItWorks />
          <Features />
          <InteractiveDemo />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </Auth>
  )
}

export default App
