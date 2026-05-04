// Slide 05 — Why DevEdge
// Copy reference: COPY_PLAN.md sections 5.1 – 5.10
// STATUS: Full implementation — animated stat counters + rotating features panel
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const scrollToSlide = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1.8, inView: boolean) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  return display;
}

// Copy: COPY_PLAN.md § 5.3 – 5.6 — [USE SUGGESTED COPY]
const stats: { prefix: string; value: number; suffix: string; label: string }[] = [
  { prefix: "", value: 80, suffix: "+", label: "Projects delivered" },
  { prefix: "", value: 3, suffix: "+", label: "Years operating" },
  { prefix: "+", value: 40, suffix: "%", label: "Avg. revenue growth" },
  { prefix: "", value: 98, suffix: "%", label: "Client satisfaction" },
];

function StatCard({
  stat,
  index,
  inView,
}: {
  stat: (typeof stats)[0];
  index: number;
  inView: boolean;
}) {
  const count = useCounter(stat.value, 1.6 + index * 0.2, inView);

  return (
    <motion.div
      className="bg-background p-8 flex flex-col gap-2"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08, ease }}
    >
      <span
        className="font-display font-black text-primary leading-none"
        style={{ fontSize: "clamp(40px, 5vw, 60px)" }}
      >
        {stat.prefix}{count}{stat.suffix}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
        {stat.label}
      </span>
    </motion.div>
  );
}

// Copy: COPY_PLAN.md § 5.7 – 5.9 — [USE SUGGESTED COPY]
const features = [
  {
    headline: "Lightning fast.",
    body: "Projects delivered in as little as 2 weeks.",
    stat: "2 wks",
  },
  {
    headline: "Effortless collaboration.",
    body: "Real-time updates. No ghosting. Ever.",
    stat: "24hr",
  },
  {
    headline: "Stronger online presence.",
    body: "Built to rank, built to scale, built to last.",
    stat: "+200",
  },
];

export default function Slide05WhyDevEdge() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="slide-05"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[160px] rounded-full" />
      </div>

      <div className="container relative z-10 py-16">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Eyebrow — Copy: COPY_PLAN.md § 5.1 */}
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary inline-block" />
            05 Why DevEdge
          </span>
          {/* Heading — Copy: COPY_PLAN.md § 5.2 */}
          <h2
            className="font-display font-black text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(44px, 5.5vw, 72px)" }}
          >
            Results,{" "}
            <span
              className="text-muted-foreground font-normal"
              style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
            >
              not promises.
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Animated stats grid */}
          <div ref={statsRef} className="grid grid-cols-2 gap-px bg-[#2E1F0F]">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} inView={statsInView} />
            ))}
          </div>

          {/* Right: Rotating feature panel */}
          <div className="flex flex-col gap-8">
            {/* Feature display */}
            <div className="relative h-40 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  {/* Large rotating stat */}
                  <p
                    className="font-display font-black text-primary leading-none mb-3"
                    style={{ fontSize: "clamp(56px, 6vw, 80px)" }}
                  >
                    {features[activeFeature].stat}
                  </p>
                  <p className="font-display font-bold text-foreground text-[22px] mb-2">
                    {features[activeFeature].headline}
                  </p>
                  <p className="text-muted-foreground text-[14px]">
                    {features[activeFeature].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators + manual nav */}
            <div className="flex items-center gap-3">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={`h-px transition-all duration-300 ${
                    i === activeFeature
                      ? "w-8 bg-primary"
                      : "w-4 bg-[#D4B896] hover:bg-primary/50"
                  }`}
                  aria-label={`Show feature ${i + 1}`}
                />
              ))}
            </div>

            {/* Transition CTA — Copy: COPY_PLAN.md § 5.10 */}
            <button
              onClick={() => scrollToSlide("slide-06")}
              className="inline-flex items-center gap-2 font-mono text-[12px] text-primary tracking-[0.15em] uppercase group w-fit"
            >
              <span className="group-hover:underline underline-offset-4 transition-all duration-200">
                See what clients say
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
