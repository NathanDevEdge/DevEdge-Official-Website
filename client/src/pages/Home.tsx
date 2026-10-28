import { useEffect } from "react";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import Hero from "@/components/home/Hero";
import Problem from "@/components/home/Problem";
import WhatWeDo from "@/components/home/WhatWeDo";
import SelectedWork from "@/components/home/SelectedWork";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import HowWeWork from "@/components/home/HowWeWork";
import FAQ, { faqs } from "@/components/home/FAQ";
import Close from "@/components/home/Close";
import { HOME_SECTIONS } from "@/lib/site";
import { faqSchema, organizationSchema } from "@/lib/schema";

export default function Home() {
  // Jump to a section when arriving with a hash (e.g. /#about from another page)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = HOME_SECTIONS[hash] ?? hash.slice(1);
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-background text-foreground font-sans selection:bg-primary/20">
      <SEO
        jsonLd={[
          organizationSchema(),
          { "@context": "https://schema.org", "@type": "WebSite", name: "DevEdge", url: "https://devedge.com.au" },
          faqSchema(faqs),
        ]}
      />
      <Navigation />

      <main>
        <Hero />
        <Problem />
        <WhatWeDo />
        <SelectedWork />
        <About />
        <Testimonials />
        <HowWeWork />
        <FAQ />
        <Close />
      </main>

      <Footer />
      <MobileCTA />
    </div>
  );
}
