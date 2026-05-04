// Slide 07 — The Process / Workflow
// Copy reference: COPY_PLAN.md sections 7.1 – 7.7
// STATUS: Full implementation — SVG vertical line (solid 01→04, dotted 04→05) + CTA
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ContactModal from "@/components/ContactModal";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// Copy: COPY_PLAN.md § 7.3 – 7.7 — [USE SUGGESTED COPY]
const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn your goals, constraints, and existing setup before anything else. No assumptions.",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "Scope, timeline, and milestones agreed in writing before a single line of code is written.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Regular check-ins, staging previews, and direct access throughout. You always know where things stand.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "Deployed, tested, and handed over with documentation. We don't disappear at go-live.",
  },
  {
    number: "05",
    title: "Support",
    description:
      "Ongoing or one-off — your call. We're available when you need us, without locking you into anything you don't.",
  },
];

// ─── Step row with animated dot that times to the SVG line ───────────────────
function StepRow({
  step,
  index,
  inView,
}: {
  step: (typeof steps)[0];
  index: number;
  inView: boolean;
}) {
  const dotDelay = 0.3 + index * (1.8 / steps.length);
  const contentDelay = dotDelay + 0.1;

  return (
    <div className="flex gap-6 relative">
      {/* Dot on the timeline */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full bg-primary border-2 border-background z-10 shrink-0"
          style={{ marginTop: "5px" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: dotDelay, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>

      {/* Step content */}
      <motion.div
        className="pb-10 flex-1"
        initial={{ opacity: 0, x: -12 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
        transition={{ duration: 0.45, delay: contentDelay, ease }}
      >
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-[10px] text-primary tracking-widest">{step.number}</span>
          <h3 className="font-display font-bold text-foreground text-[20px] leading-tight">
            {step.title}
          </h3>
          {/* Badge on the Support step — marks it as optional/ongoing */}
          {step.number === "05" && (
            <span className="font-mono text-[8px] text-muted-foreground border border-[#D4B896] px-1.5 py-0.5 tracking-widest uppercase">
              Ongoing
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-[14px] leading-relaxed max-w-sm">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

// ─── SVG vertical line: solid 01→04, dotted 04→05 ────────────────────────────
// Measured from live DOM: container=594px, dots at y=11,130,248,367,485 relative to container.
// SVG is offset top-[5px], so subtract 5 for SVG coordinates.
const LINE_HEIGHT = 492; // slightly past step 5 dot (480px in SVG coords)
const SOLID_END = 362;   // step 4 dot position in SVG coordinates (367 - 5)

function AnimatedTimeline({ inView }: { inView: boolean }) {
  return (
    <div className="absolute left-[5px] top-[5px]" style={{ height: LINE_HEIGHT }}>
      <svg width="2" height={LINE_HEIGHT} viewBox={`0 0 2 ${LINE_HEIGHT}`} fill="none">
        {/* Full faint track — always visible */}
        <line x1="1" y1="0" x2="1" y2={LINE_HEIGHT} stroke="#D4B896" strokeWidth="2" />

        {/* Solid ember fill — steps 01 through 04 */}
        <motion.path
          d={`M 1 0 L 1 ${SOLID_END}`}
          stroke="#C97B3A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        />

        {/* Dotted ember line — step 04 → 05 (Support = ongoing/optional) */}
        <motion.path
          d={`M 1 ${SOLID_END} L 1 ${LINE_HEIGHT}`}
          stroke="#C97B3A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 7"
          fill="none"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.75, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

export default function Slide07Workflow() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(timelineRef, { once: true, amount: 0.25 });

  return (
    <section
      id="slide-07"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[180px] rounded-full" />
      </div>

      <div className="container relative z-10 py-16">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">

          {/* Left: heading block + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease }}
          >
            {/* Eyebrow — Copy: COPY_PLAN.md § 7.1 */}
            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary inline-block" />
              07 The Process
            </span>
            {/* Heading — Copy: COPY_PLAN.md § 7.2 */}
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
            >
              What working<br />
              with us{" "}
              <span
                className="text-muted-foreground font-normal"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
              >
                looks like.
              </span>
            </h2>
            <p className="text-muted-foreground text-[14px] leading-relaxed max-w-xs mb-10">
              Every project follows the same rigorous path from idea to live. No surprises, no
              shortcuts.
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 2.1, ease }}
            >
              <ContactModal
                buttonText="Start the process →"
                triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-7 h-11 rounded-none text-[14px] transition-colors duration-150"
              />
            </motion.div>
          </motion.div>

          {/* Right: animated timeline */}
          <div ref={timelineRef} className="relative pl-8">
            {/* SVG track + ember fill */}
            <AnimatedTimeline inView={inView} />

            {/* Step rows */}
            {steps.map((step, i) => (
              <StepRow key={step.number} step={step} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
