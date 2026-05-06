import { useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import MobileCTA from "@/components/MobileCTA";
import SlideProgress from "@/components/SlideProgress";
import Slide01Hero from "@/components/slides/Slide01Hero";
import Slide02Problem from "@/components/slides/Slide02Problem";
import Slide03SystemBuild from "@/components/slides/Slide03SystemBuild";
import Slide04Services from "@/components/slides/Slide04Services";
import Slide05WhyDevEdge from "@/components/slides/Slide05WhyDevEdge";
import Slide06Testimonials from "@/components/slides/Slide06Testimonials";
import Slide07Workflow from "@/components/slides/Slide07Workflow";
import Slide08FAQ from "@/components/slides/Slide08FAQ";
import Slide09Close from "@/components/slides/Slide09Close";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll on desktop so snap container handles it; restore on unmount
  useEffect(() => {
    document.body.classList.add("snap-scroll-active");
    return () => document.body.classList.remove("snap-scroll-active");
  }, []);

  // Reset snap container scroll position on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Keyboard navigation — arrow keys / Page Up/Down scroll between slides (desktop only)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (window.innerWidth < 1024) return;
      const container = containerRef.current;
      if (!container) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        container.scrollBy({ top: -container.clientHeight, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="bg-background text-foreground font-sans selection:bg-primary/20">
      <SEO />

      {/*
        Snap scroll container.
        Desktop (lg+): fixed h-screen, overflow-y-scroll, snap-y mandatory.
        Body/html are set to overflow:hidden on lg+ in index.css so only
        this container captures scroll events — making snap work correctly.
        Mobile: no height/overflow constraints — sections stack and body scrolls.
      */}
      <div
        ref={containerRef}
        id="snap-container"
        className="scrollbar-none lg:h-screen lg:overflow-y-scroll lg:snap-y lg:snap-mandatory"
      >
        <Slide01Hero />
        <Slide02Problem />
        <Slide03SystemBuild />
        <Slide04Services />
        <Slide05WhyDevEdge />
        <Slide06Testimonials />
        <Slide07Workflow />
        <Slide08FAQ />
        <Slide09Close />
      </div>

      {/* Fixed bottom CTA — mobile only */}
      <MobileCTA />

      {/* Vertical dot nav — desktop only */}
      <SlideProgress />
    </div>
  );
}
