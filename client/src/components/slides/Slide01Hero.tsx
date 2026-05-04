// Slide 01 — Hero
// Copy reference: COPY_PLAN.md sections 1.1 – 1.8
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ContactModal from "@/components/ContactModal";

// ─── Typewriter terminal ──────────────────────────────────────────────────────
// Copy: COPY_PLAN.md § 1.8 — [USE SUGGESTED COPY]

const CODE_LINES: { tokens: { t: string; c: string }[] }[] = [
  { tokens: [{ t: 'import type { Project } from "@devedge/core";', c: "#A89070" }] },
  { tokens: [] },
  { tokens: [{ t: "// Got a complex problem? Good.", c: "#A89070" }] },
  { tokens: [{ t: "// That's where we do our best work.", c: "#A89070" }] },
  { tokens: [] },
  { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "devedge", c: "#F5E6D5" }, { t: " = {", c: "#A89070" }] },
  { tokens: [{ t: "  team:        ", c: "#A89070" }, { t: '"small"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { tokens: [{ t: "  attention:   ", c: "#A89070" }, { t: '"full"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { tokens: [{ t: "  farming_out: ", c: "#A89070" }, { t: "false", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { tokens: [{ t: "  templates:   ", c: "#A89070" }, { t: "false", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { tokens: [{ t: "};", c: "#A89070" }] },
  { tokens: [] },
  {
    tokens: [
      { t: "export async function ", c: "#C97B3A" },
      { t: "ship", c: "#F5E6D5" },
      { t: "(project: ", c: "#A89070" },
      { t: "Project", c: "#C97B3A" },
      { t: ") {", c: "#A89070" },
    ],
  },
  {
    tokens: [
      { t: "  return ", c: "#C97B3A" },
      { t: "build", c: "#F5E6D5" },
      { t: "(project); ", c: "#A89070" },
      { t: "// it works.", c: "#664422" },
    ],
  },
  { tokens: [{ t: "}", c: "#A89070" }] },
];

function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return;
    const isBlank = CODE_LINES[visibleLines]?.tokens.length === 0;
    const timer = setTimeout(
      () => setVisibleLines((v) => v + 1),
      visibleLines === 0 ? 900 : isBlank ? 60 : 130
    );
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="w-full border border-[#2E1F0F] bg-[#1A1008] overflow-hidden shadow-[0_32px_80px_-20px_rgba(201,123,58,0.15)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2E1F0F]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-auto font-mono text-[11px] text-[#664422] tracking-widest">devedge.ts</span>
      </div>
      {/* Code lines */}
      <div className="px-6 py-5 font-mono text-[13px] leading-[1.7] min-h-[320px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex gap-5">
            <span className="w-4 shrink-0 text-right text-[#332010] select-none text-xs pt-px">
              {line.tokens.length > 0 ? i + 1 : ""}
            </span>
            <span>
              {line.tokens.map((token, j) => (
                <span key={j} style={{ color: token.c }}>
                  {token.t}
                </span>
              ))}
              {i === visibleLines - 1 && visibleLines < CODE_LINES.length && (
                <span className="inline-block w-[7px] h-[13px] bg-[#C97B3A] ml-px animate-pulse align-middle" />
              )}
            </span>
          </div>
        ))}
        {visibleLines >= CODE_LINES.length && (
          <div className="flex gap-5 mt-0.5">
            <span className="w-4 shrink-0" />
            <span className="inline-block w-[7px] h-[13px] bg-[#C97B3A] animate-pulse align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Scroll helper ────────────────────────────────────────────────────────────
const scrollToSlide = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ─── Hero slide ───────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

export default function Slide01Hero() {
  // Subtle mouse-reactive tilt on the content block
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-1.5, 1.5]), { stiffness: 60, damping: 25 });
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [1, -1]), { stiffness: 60, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  return (
    <section
      id="slide-01"
      // min-h-screen for mobile flow; h-screen + snap-start for desktop snap
      className="relative min-h-screen lg:h-screen lg:snap-start flex items-start pt-36 pb-24 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background layers ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ember glow pools */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#C97B3A]/5 blur-[160px] rounded-full" />
        <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[180px] rounded-full" />

        {/* 3D perspective grid floor */}
        <div className="absolute left-0 right-0 bottom-0" style={{ height: "72%", perspective: "700px" }}>
          {/* Base grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(46,31,15,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.25) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(62deg)",
              transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, transparent 65%)",
            }}
          />
          {/* Ember accent grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(201,123,58,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,123,58,0.2) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(62deg)",
              transformOrigin: "50% 100%",
              maskImage: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 80%)",
            }}
          />
        </div>

        {/* Horizon fade */}
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-background via-background/95 to-transparent" />
      </div>

      {/* ── Content — mouse-reactive tilt ─────────────────────── */}
      <motion.div className="container relative z-10" style={{ rotateX, rotateY }}>
        <div className="grid lg:grid-cols-[1fr_460px] gap-20 items-center">

          {/* Left: text + CTAs */}
          <div>
            {/* Eyebrow — Copy: COPY_PLAN.md § 1.1 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                <span className="w-8 h-px bg-primary inline-block" />
                DevEdge · Software & Systems
              </span>
            </motion.div>

            {/* Headline — Copy: COPY_PLAN.md § 1.2 */}
            <motion.h1
              className="mt-6 font-display font-black leading-[0.88] tracking-tight text-foreground"
              style={{ fontSize: "clamp(64px, 8vw, 108px)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
            >
              We build<br />
              things that<br />
              actually{" "}
              <span className="text-primary">work.</span>
            </motion.h1>

            {/* Subheadline — Copy: COPY_PLAN.md § 1.3 */}
            <motion.p
              className="mt-7 text-[17px] text-muted-foreground max-w-[420px] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease }}
            >
              Custom software, web platforms, and backend systems
              for businesses that need results — not just deliverables.
            </motion.p>

            {/* CTAs — Copy: COPY_PLAN.md § 1.4 + 1.5 */}
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26, ease }}
            >
              {/* Primary CTA — opens contact modal */}
              <ContactModal
                buttonText="Start a Project"
                triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
              />
              {/* Secondary CTA — scrolls to slide-02 */}
              <button
                onClick={() => scrollToSlide("slide-02")}
                className="inline-flex items-center gap-2 px-8 h-12 border border-[#D4B896] text-foreground hover:border-primary hover:text-primary text-[15px] font-medium transition-colors duration-150"
              >
                See How It Works <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Trust tagline — Copy: COPY_PLAN.md § 1.6 */}
            <motion.div
              className="mt-10 pt-8 border-t border-[#D4B896]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="font-mono text-[11px] text-muted-foreground tracking-[0.12em] uppercase">
                Small team&nbsp;·&nbsp;Full attention&nbsp;·&nbsp;No farming out, no templates
              </p>
            </motion.div>
          </div>

          {/* Right: Code terminal — desktop only */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          >
            <CodeTerminal />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator — Copy: COPY_PLAN.md § 1.7 ──────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="font-mono text-[10px] text-muted-foreground/40 tracking-[0.25em] uppercase">
          scroll
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent"
          animate={{ scaleY: [0.2, 1, 0.2], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
