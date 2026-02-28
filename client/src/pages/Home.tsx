import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <SEO />
      <Navigation />

      <main>
        <Hero />
        <Projects />
        <Services />
        <Features />
        <Workflow />
        <About />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
