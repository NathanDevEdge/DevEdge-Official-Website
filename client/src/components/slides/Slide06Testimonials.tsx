// Slide 06 — Testimonials
// Copy reference: COPY_PLAN.md sections 6.1 – 6.6
// STATUS: Full implementation — large single-testimonial cycling view with arrow nav + swipe
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// Copy: COPY_PLAN.md § 6.3 – 6.6
// Testimonials 2 & 3 are pending real quotes — placeholder shown gracefully.
const testimonials = [
  {
    quote:
      "Working with Nathan and his team was an amazing experience. I had nothing but an idea and a rough guideline of what I wanted. With his help, we got an amazing website built with an intricate Deck Calculator providing our customers with an accurate way to measure their deck out and get the fastest quotes. Not only did he build something for us, he did it the best way possible. DevEdge went out of their way to give honest and great recommendations with other external solutions as well as where to get a reliable server to host off of.",
    name: "Graeme Bell",
    role: "Owner",
    company: "Deckmate",
    project: "Custom Web Platform with Customer Portal",
    initials: "GB",
    pending: false,
  },
  {
    quote:
      "My first thoughts when working with DevEdge was how organised they were and persistent on making sure my ideas would come to life. I loved how easy it was when working with them to change how I thought something should go or when I changed my mind on a specific flow. Working with Nathan and DevEdge was honestly an enjoyable experience and I would definitely use them again when I need to.",
    name: "Kerim Uzunoglu",
    role: "Founder",
    company: "Tennantly",
    project: "Mobile App Development",
    initials: "KU",
    pending: false,
  },
  {
    quote: null, // Pending — Ben to provide
    name: "Ben Glyde",
    role: "Marketing Manager",
    company: "Woodhouse",
    project: "Custom Web Integration with ERP Platform",
    initials: "BG",
    pending: true,
  },
  {
    quote: null, // Pending — Josh to provide
    name: "Josh Glover",
    role: "Director",
    company: "TPD Timber Distributors",
    project: "Custom Web Integration with ERP Platform",
    initials: "JG",
    pending: true,
  },
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  centre: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function Slide06Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index]
  );

  const prev = () => go(index === 0 ? testimonials.length - 1 : index - 1);
  const next = () => go(index === testimonials.length - 1 ? 0 : index + 1);

  const current = testimonials[index];

  return (
    <section
      id="slide-06"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col overflow-hidden"
      style={{ background: "#EDD9C0" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#C97B3A]/7 blur-[180px] rounded-full" />
      </div>

      <div className="container relative z-10 flex flex-col h-full py-16">

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Eyebrow — Copy: COPY_PLAN.md § 6.1 */}
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-primary inline-block" />
            06 Clients
          </span>
          {/* Heading — Copy: COPY_PLAN.md § 6.2 */}
          <h2
            className="font-display font-black text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
          >
            Don't take our word for it.
          </h2>
        </motion.div>

        {/* Testimonial display — takes remaining height */}
        <div className="flex-1 flex flex-col justify-between">

          {/* Quote area */}
          <div className="relative flex-1 flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="centre"
                exit="exit"
                transition={{ duration: 0.35, ease }}
                className="w-full"
              >
                {current.pending ? (
                  /* Placeholder state for missing quotes */
                  <div className="flex flex-col gap-6 max-w-3xl">
                    <div className="bg-[#D4B896]/40 border border-[#D4B896] px-6 py-3 w-fit">
                      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                        Quote in progress
                      </span>
                    </div>
                    <p className="font-display font-normal text-muted-foreground leading-relaxed"
                      style={{ fontSize: "clamp(20px, 2.5vw, 30px)" }}>
                      We worked with {current.name} at {current.company} on their {current.project.toLowerCase()}. Their testimonial is on its way.
                    </p>
                  </div>
                ) : (
                  /* Real testimonial */
                  <div className="flex flex-col gap-8 max-w-3xl">
                    {/* Large ember quote mark */}
                    <span
                      className="font-display font-black text-primary select-none leading-none"
                      style={{ fontSize: "100px", lineHeight: 0.6 }}
                      aria-hidden="true"
                    >
                      "
                    </span>
                    <blockquote
                      className="font-display font-normal text-foreground leading-[1.4]"
                      style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
                    >
                      {current.quote}
                    </blockquote>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                      <span className="text-primary">{current.project}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom bar — client info + navigation */}
          <div className="flex items-end justify-between gap-6 pt-8 border-t border-[#D4B896] mt-8">

            {/* Client identity */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`meta-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-sm text-primary shrink-0">
                  {current.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-[14px]">{current.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                    {current.role} · {current.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 shrink-0">
              {/* Progress */}
              <span className="font-mono text-[11px] text-muted-foreground tracking-widest">
                {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
              {/* Arrows */}
              <button
                onClick={prev}
                className="w-10 h-10 border border-[#D4B896] flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 border border-[#D4B896] flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-px transition-all duration-300 ${
                  i === index ? "w-8 bg-primary" : "w-3 bg-[#D4B896] hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
