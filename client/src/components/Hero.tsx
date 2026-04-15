import ContactModal from "@/components/ContactModal";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Typing terminal ──────────────────────────────────────────────────────────
const CODE_LINES: { text: string; tokens: { t: string; c: string }[] }[] = [
  { text: "", tokens: [{ t: 'import type { Project } from "@devedge/core";', c: "#A89070" }] },
  { text: "", tokens: [] },
  { text: "", tokens: [{ t: "// Got a complex problem? Good.", c: "#A89070" }] },
  { text: "", tokens: [{ t: "// That's where we do our best work.", c: "#A89070" }] },
  { text: "", tokens: [] },
  {
    text: "", tokens: [
      { t: "const ", c: "#C97B3A" }, { t: "devedge", c: "#F5E6D5" }, { t: " = {", c: "#A89070" },
    ]
  },
  { text: "", tokens: [{ t: '  team:        ', c: "#A89070" }, { t: '"small"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { text: "", tokens: [{ t: "  attention:   ", c: "#A89070" }, { t: '"full"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { text: "", tokens: [{ t: "  farming_out: ", c: "#A89070" }, { t: "false", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { text: "", tokens: [{ t: "  templates:   ", c: "#A89070" }, { t: "false", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
  { text: "", tokens: [{ t: "};", c: "#A89070" }] },
  { text: "", tokens: [] },
  {
    text: "", tokens: [
      { t: "export async function ", c: "#C97B3A" },
      { t: "ship", c: "#F5E6D5" },
      { t: "(project: ", c: "#A89070" },
      { t: "Project", c: "#C97B3A" },
      { t: ") {", c: "#A89070" },
    ]
  },
  { text: "", tokens: [{ t: "  return ", c: "#C97B3A" }, { t: "build", c: "#F5E6D5" }, { t: "(project); ", c: "#A89070" }, { t: "// it works.", c: "#664422" }] },
  { text: "", tokens: [{ t: "}", c: "#A89070" }] },
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
    <div className="w-full border border-[#2E1F0F] bg-[#0D0804] overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2E1F0F]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-auto font-mono text-[11px] text-[#664422] tracking-widest">devedge.ts</span>
      </div>
      {/* code */}
      <div className="px-6 py-5 font-mono text-[13px] leading-[1.7] min-h-[320px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex gap-5">
            <span className="w-4 shrink-0 text-right text-[#332010] select-none text-xs pt-px">
              {line.tokens.length > 0 ? i + 1 : ""}
            </span>
            <span>
              {line.tokens.map((token, j) => (
                <span key={j} style={{ color: token.c }}>{token.t}</span>
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(201,123,58,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C97B3A]/4 blur-[140px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%,#000 60%,transparent 100%)",
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_460px] gap-20 items-center">

          {/* ── Left ── */}
          <div>
            {/* Eyebrow */}
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

            {/* Headline */}
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

            {/* Sub */}
            <motion.p
              className="mt-7 text-[17px] text-muted-foreground max-w-[420px] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease }}
            >
              Custom software, web platforms, and backend systems
              for businesses that need results — not just deliverables.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26, ease }}
            >
              <ContactModal
                buttonText="Start a Project"
                triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
              />
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-8 h-12 border border-white/15 text-foreground hover:border-primary/50 hover:text-primary text-[15px] font-medium transition-colors duration-150"
              >
                See Our Work <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Differentiator */}
            <motion.div
              className="mt-10 pt-8 border-t border-white/8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="font-mono text-[11px] text-muted-foreground tracking-[0.12em] uppercase">
                Small team&nbsp;·&nbsp;Full attention&nbsp;·&nbsp;No farming out, no templates
              </p>
            </motion.div>
          </div>

          {/* ── Right: Terminal ── */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          >
            <CodeTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
