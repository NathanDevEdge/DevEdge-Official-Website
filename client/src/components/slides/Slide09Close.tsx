// Slide 09 — The Close
// Copy reference: COPY_PLAN.md sections 9.1 – 9.6
// STATUS: Full implementation — CTA pulse, inverted grid, dark bookend
// Uses useInView hook for reliable snap-scroll animation triggering
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ContactModal from "@/components/ContactModal";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Slide09Close() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      id="slide-09"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col justify-between overflow-hidden bg-[#1A1008]"
    >
      {/* ── Background ───────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C97B3A]/10 blur-[200px] rounded-full" />

        {/* Inverted perspective grid at top — mirrors the hero grid */}
        <div className="absolute left-0 right-0 top-0" style={{ height: "45%", perspective: "700px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(46,31,15,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.35) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(-62deg)",
              transformOrigin: "50% 0%",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(201,123,58,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,123,58,0.12) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(-62deg)",
              transformOrigin: "50% 0%",
              maskImage:
                "radial-gradient(ellipse 55% 55% at 50% 0%, rgba(0,0,0,0.8) 0%, transparent 80%)",
            }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-[#1A1008] via-[#1A1008]/80 to-transparent" />
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center container relative z-10 py-20">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="font-mono text-[11px] text-primary/60 tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-10">
            <span className="w-8 h-px bg-primary/40 inline-block" />
            09 Let's Build
            <span className="w-8 h-px bg-primary/40 inline-block" />
          </span>
        </motion.div>

        {/* Heading line 1 — Copy: COPY_PLAN.md § 9.1 */}
        <motion.h2
          className="font-display font-black text-[#F5E6D5] leading-[0.88] tracking-tight mb-2"
          style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Ready to build
        </motion.h2>

        {/* Heading line 2 */}
        <motion.h2
          className="font-display font-black text-primary leading-[0.88] tracking-tight mb-10"
          style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          something real?
        </motion.h2>

        {/* Supporting statement — Copy: COPY_PLAN.md § 9.2 */}
        <motion.p
          className="text-[15px] text-[#A89070] max-w-sm leading-relaxed mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.28, ease }}
        >
          We take on a limited number of projects at a time.
          If you're serious about what you're building, let's talk.
        </motion.p>

        {/* Primary CTA — Copy: COPY_PLAN.md § 9.3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, delay: 0.38, ease }}
          className="relative"
        >
          {/* Ember pulse ring */}
          <motion.span
            className="absolute inset-0 bg-primary/20 rounded-none"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          />
          <ContactModal
            buttonText="Start a Project"
            triggerClassName="relative bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-14 h-14 rounded-none text-[16px] transition-colors duration-150"
          />
        </motion.div>

        {/* Email / phone fallback — Copy: COPY_PLAN.md § 9.4 */}
        <motion.div
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] text-[#664422] tracking-widest text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.52, ease }}
        >
          <span>alternatively email or call us at</span>
          <div className="flex items-center gap-3">
            <a
              href="mailto:info@devedge.com.au"
              className="text-primary/60 hover:text-primary transition-colors duration-150 underline underline-offset-2"
            >
              info@devedge.com.au
            </a>
            <span className="opacity-40">·</span>
            <a
              href="tel:0490214750"
              className="text-primary/60 hover:text-primary transition-colors duration-150"
            >
              0490 214 750
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Footer bar ───────────────────────────────────────── */}
      <motion.div
        className="relative z-10 border-t border-[#2E1F0F] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease }}
      >
        {/* Copy: COPY_PLAN.md § 9.5 */}
        <p className="font-mono text-[10px] text-[#664422] tracking-widest">
          © {new Date().getFullYear()} DevEdge. All rights reserved.
        </p>
        {/* Copy: COPY_PLAN.md § 9.6 */}
        <p className="font-mono text-[10px] text-[#664422] tracking-widest">
          Built different. On purpose.
        </p>
      </motion.div>
    </section>
  );
}
