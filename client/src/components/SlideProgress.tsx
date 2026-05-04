// SlideProgress — Desktop-only vertical dot navigation
// Tracks which slide is active via scroll position on the snap container.
// Dots appear on the right edge; clicking scrolls to that slide.
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SLIDE_IDS = [
  "slide-01",
  "slide-02",
  "slide-03",
  "slide-04",
  "slide-05",
  "slide-06",
  "slide-07",
  "slide-08",
  "slide-09",
];

export default function SlideProgress() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = document.getElementById("snap-container");
    if (!container) return;

    const handleScroll = () => {
      const slideHeight = container.clientHeight;
      if (slideHeight === 0) return;
      const index = Math.round(container.scrollTop / slideHeight);
      setActiveIndex(Math.min(index, SLIDE_IDS.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const container = document.getElementById("snap-container");
    if (!container) return;
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
  };

  return (
    <div
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-[10px]"
      aria-label="Slide navigation"
    >
      {SLIDE_IDS.map((_, i) => (
        <button
          key={i}
          onClick={() => scrollToSlide(i)}
          aria-label={`Go to slide ${i + 1}`}
          className="flex items-center justify-center p-1 group"
        >
          <motion.div
            className="rounded-full bg-[#D4B896] group-hover:bg-primary/60 transition-colors duration-200"
            animate={
              i === activeIndex
                ? { width: 6, height: 22, backgroundColor: "#C97B3A" }
                : { width: 5, height: 5, backgroundColor: "#D4B896" }
            }
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
          />
        </button>
      ))}
    </div>
  );
}
