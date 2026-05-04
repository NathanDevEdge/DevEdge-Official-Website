// Slide 03 — System Build Reveal
// Copy reference: COPY_PLAN.md sections 3.1 – 3.6
// STATUS: Full implementation — animated SVG pipeline, nodes pop in as line draws through
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ContactModal from "@/components/ContactModal";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// Copy: COPY_PLAN.md § 3.3 + 3.4
// Note: Nathan changed "Nothing ships broken" → "Nothing delivers broken" in § 3.4
const nodes = [
  { label: "Brief",       sub: "Your goals, your terms",        icon: "01" },
  { label: "Discovery",   sub: "We map the full picture",       icon: "02" },
  { label: "Design",      sub: "Wireframes & visual direction", icon: "03" },
  { label: "Development", sub: "Built clean, built to last",    icon: "04" },
  { label: "Testing",     sub: "Nothing delivers broken",       icon: "05" },
  { label: "Deploy",      sub: "Live, monitored, documented",   icon: "06" },
  { label: "Monitor",     sub: "We stay on it",                 icon: "07" },
];

const TOTAL_NODES = nodes.length;
// Line animation total duration — each segment draws sequentially
const LINE_DURATION = 2.0;
// Delay before the whole sequence starts
const START_DELAY = 0.3;

// Each node gets a delay proportional to when the line reaches it
function nodeDelay(index: number) {
  if (index === 0) return START_DELAY;
  return START_DELAY + (index / (TOTAL_NODES - 1)) * LINE_DURATION - 0.05;
}

// ─── Desktop horizontal pipeline ─────────────────────────────────────────────
function DesktopPipeline({ inView }: { inView: boolean }) {
  return (
    <div className="hidden lg:block relative w-full">
      {/* SVG connecting line — sits behind the nodes */}
      <div className="absolute top-[22px] left-[calc(100%/14)] right-[calc(100%/14)]">
        <svg
          width="100%"
          height="4"
          preserveAspectRatio="none"
          viewBox="0 0 100 4"
        >
          {/* Track */}
          <line x1="0" y1="2" x2="100" y2="2" stroke="#D4B896" strokeWidth="1.5" />
          {/* Ember fill draws left → right */}
          <motion.line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            stroke="#C97B3A"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: LINE_DURATION, delay: START_DELAY, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Node row */}
      <div className="grid grid-cols-7 gap-2">
        {nodes.map((node, i) => (
          <motion.div
            key={node.label}
            className="flex flex-col items-center text-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: nodeDelay(i), ease }}
          >
            {/* Node dot */}
            <motion.div
              className="w-11 h-11 bg-background border-2 border-primary flex items-center justify-center z-10 relative"
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : { scale: 0 }}
              transition={{
                duration: 0.35,
                delay: nodeDelay(i),
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <span className="font-mono text-[10px] text-primary font-bold tracking-wider">
                {node.icon}
              </span>
            </motion.div>

            {/* Label */}
            <div className="space-y-1">
              <p className="font-display font-bold text-foreground text-[13px] leading-tight">
                {node.label}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground leading-snug tracking-wide">
                {node.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile vertical pipeline ─────────────────────────────────────────────────
function MobilePipeline({ inView }: { inView: boolean }) {
  return (
    <div className="lg:hidden relative pl-10">
      {/* Vertical track */}
      <div className="absolute left-[18px] top-[22px] bottom-[22px]">
        <svg width="4" height="100%" viewBox="0 0 4 100" preserveAspectRatio="none">
          <line x1="2" y1="0" x2="2" y2="100" stroke="#D4B896" strokeWidth="1.5" />
          <motion.line
            x1="2"
            y1="0"
            x2="2"
            y2="100"
            stroke="#C97B3A"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: LINE_DURATION, delay: START_DELAY, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Nodes */}
      <div className="space-y-6">
        {nodes.map((node, i) => (
          <motion.div
            key={node.label}
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.4, delay: nodeDelay(i), ease }}
          >
            {/* Dot — positioned to sit on the line */}
            <motion.div
              className="absolute -left-[6px] w-[16px] h-[16px] rounded-full bg-primary border-2 border-background z-10 mt-[3px]"
              style={{ left: "10px" }}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: nodeDelay(i), ease: [0.34, 1.56, 0.64, 1] }}
            />
            <div className="ml-2">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-primary tracking-widest">{node.icon}</span>
                <h3 className="font-display font-bold text-foreground text-[16px]">{node.label}</h3>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">{node.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main slide ───────────────────────────────────────────────────────────────
export default function Slide03SystemBuild() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pipelineRef, { once: true, amount: 0.3 });

  return (
    <section
      id="slide-03"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#C97B3A]/4 blur-[180px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #2E1F0F 1px, transparent 1px), linear-gradient(to bottom, #2E1F0F 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container relative z-10 py-16">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Eyebrow — Copy: COPY_PLAN.md § 3.1 */}
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary inline-block" />
            03 How We Build
          </span>
          {/* Heading — Copy: COPY_PLAN.md § 3.2 */}
          <h2
            className="font-display font-black text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
          >
            Here's how every project
            <br />
            <span
              className="text-muted-foreground font-normal"
              style={{ fontSize: "clamp(28px, 3.5vw, 50px)" }}
            >
              gets built.
            </span>
          </h2>
        </motion.div>

        {/* Animated pipeline — triggers when it enters viewport */}
        <div ref={pipelineRef} className="mb-16">
          <DesktopPipeline inView={inView} />
          <MobilePipeline inView={inView} />
        </div>

        {/* Closing line + CTA */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: START_DELAY + LINE_DURATION + 0.2, ease }}
        >
          {/* Copy: COPY_PLAN.md § 3.5 */}
          <p className="text-[15px] text-muted-foreground max-w-sm">
            This is what every project looks like. Yours starts here.
          </p>
          {/* CTA — Copy: COPY_PLAN.md § 3.6 */}
          <ContactModal
            buttonText="Start the process →"
            triggerClassName="shrink-0 bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-7 h-11 rounded-none text-[14px] transition-colors duration-150"
          />
        </motion.div>
      </div>
    </section>
  );
}
