// Slide 02 — Our Standard (Manifesto)
// Copy reference: COPY_PLAN.md sections 2.1 – 2.4
// STATUS: Full implementation — centered typographic manifesto
// Uses useInView hook (not whileInView) for reliable snap-scroll animation triggering
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const scrollToSlide = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Slide02Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      id="slide-02"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#C97B3A]/6 blur-[220px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #2E1F0F 1px, transparent 1px), linear-gradient(to bottom, #2E1F0F 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4B896]/30 to-transparent" />
        <div className="absolute bottom-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4B896]/30 to-transparent" />
      </div>

      <div className="container relative z-10 text-center max-w-3xl">

        {/* Eyebrow — Copy: COPY_PLAN.md § 2.1 */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease }}
        >
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
            <span className="w-8 h-px bg-primary inline-block" />
            02 Our Standard
            <span className="w-8 h-px bg-primary inline-block" />
          </span>
        </motion.div>

        {/* Line 1 — softer intro — Copy: COPY_PLAN.md § 2.2 */}
        <motion.p
          className="font-display font-normal text-muted-foreground leading-none tracking-tight mb-3"
          style={{ fontSize: "clamp(26px, 3.2vw, 46px)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Most agencies deliver projects.
        </motion.p>

        {/* Line 2 — the bold ember claim */}
        <motion.h2
          className="font-display font-black text-primary leading-none tracking-tight mb-14"
          style={{ fontSize: "clamp(52px, 7.5vw, 104px)" }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          We deliver outcomes.
        </motion.h2>

        {/* Supporting statement + CTA */}
        <motion.div
          className="flex flex-col items-center gap-7"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.5, delay: 0.38, ease }}
        >
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
            We measure success by what your business achieves —
            not by what we hand over.
          </p>

          {/* Transition CTA — Copy: COPY_PLAN.md § 2.4 */}
          <button
            onClick={() => scrollToSlide("slide-03")}
            className="inline-flex items-center gap-2 font-mono text-[12px] text-primary tracking-[0.15em] uppercase group"
          >
            <span className="group-hover:underline underline-offset-4 transition-all duration-200">
              See how we build
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
