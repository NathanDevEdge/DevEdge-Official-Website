import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  team     — meet the team",
    "  stack    — our tech stack",
    "  work     — what we build",
    "  contact  — how to reach us",
  ],
  team: [
    "Nathan Anniss  —  Founder & Technical Lead",
    "",
    "Small team. Senior level. No juniors, no outsourcing.",
    "Every project gets our full attention.",
  ],
  stack: [
    "Frontend:   React · TypeScript · Vite · Tailwind",
    "Backend:    Node.js · Express · PostgreSQL",
    "Deployment: Vercel · Railway · AWS",
    "Tools:      Figma · Linear · Resend",
  ],
  work: [
    "Custom Software   →  built from scratch",
    "Web Platforms     →  fast, polished, scalable",
    "Integrations      →  connect your tools",
    "Automation        →  stop doing it manually",
  ],
  contact: [
    "Email:    nathan@devedge.com.au",
    "LinkedIn: /company/devedge-solutions",
    "GitHub:   /NathanDevEdge",
    "",
    'Or hit "Start a Project" at the top ↑',
  ],
};

interface HistoryEntry {
  type: "input" | "output" | "system";
  lines: string[];
}

function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      type: "system",
      lines: [
        "DevEdge Interactive Terminal v1.0",
        'Type a command or click one below.',
        "",
        "  help · team · stack · work · contact",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (cmd: string) => {
    const normalised = cmd.trim().toLowerCase();
    const output = COMMANDS[normalised] ?? [
      `command not found: ${normalised}`,
      "type 'help' for available commands",
    ];
    setHistory((h) => [
      ...h,
      { type: "input", lines: [normalised] },
      { type: "output", lines: output },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      runCommand(input);
    }
  };

  return (
    <div
      className="bg-[#1A1008] border border-[#2E1F0F] overflow-hidden cursor-text"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2E1F0F]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-auto font-mono text-[11px] text-[#664422] tracking-widest">devedge — interactive</span>
      </div>

      {/* Command chips */}
      <div className="flex flex-wrap gap-2 px-5 pt-4 pb-2 border-b border-[#2E1F0F]">
        {Object.keys(COMMANDS).map((cmd) => (
          <button
            key={cmd}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); runCommand(cmd); }}
            className="font-mono text-[11px] text-muted-foreground border border-[#2E1F0F] px-3 py-1 hover:border-primary/50 hover:text-primary transition-colors duration-150"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Output */}
      <div ref={outputRef} className="px-5 py-4 max-h-60 overflow-y-auto space-y-1 scrollbar-none">
        {history.map((entry, i) => (
          <div key={i}>
            {entry.type === "input" && (
              <div className="flex gap-3">
                <span className="text-primary font-mono text-[12px] shrink-0">›</span>
                <span className="font-mono text-[12px] text-foreground">{entry.lines[0]}</span>
              </div>
            )}
            {(entry.type === "output" || entry.type === "system") && (
              <div className="pl-5 space-y-0.5">
                {entry.lines.map((line, j) => (
                  <div
                    key={j}
                    className={`font-mono text-[12px] leading-relaxed ${
                      entry.type === "system" ? "text-muted-foreground/60" : "text-[#A89070]"
                    }`}
                  >
                    {line || " "}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input line */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-[#2E1F0F]">
        <span className="text-primary font-mono text-[12px] shrink-0">›</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-[12px] text-foreground outline-none caret-primary placeholder:text-muted-foreground/30"
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
        />
        <span className="inline-block w-[6px] h-[12px] bg-primary/70 animate-pulse" />
      </div>
    </div>
  );
}

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function About() {
  return (
    <section id="about" className="py-32 border-y border-[#2E1F0F] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[160px] rounded-full" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary inline-block" />
                04 About
              </span>
              <h2
                className="font-display font-black text-foreground leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: "clamp(44px, 5vw, 72px)" }}
              >
                Creative minds.<br />
                Real humans.<br />
                <span className="text-primary">One tight team.</span>
              </h2>
            </motion.div>

            <motion.p
              className="text-[16px] text-muted-foreground leading-relaxed mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08, ease }}
            >
              We're not just here to make things look good — we're here to make them work.
              From bold startups to growing brands, we help teams bring their ideas to life through
              strategy, design, and digital experiences that matter.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-px bg-[#2E1F0F] mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14, ease }}
            >
              {[
                { value: "80+", label: "Projects" },
                { value: "3+", label: "Years" },
                { value: "100%", label: "Happy Clients" },
              ].map((stat) => (
                <div key={stat.label} className="bg-background p-6">
                  <div className="font-display font-black text-primary mb-1" style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Founder quote */}
            <motion.div
              className="border border-[#D4B896] border-l-2 border-l-primary bg-[#EDD9C0] p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
            >
              <p className="text-[14px] text-muted-foreground italic leading-relaxed mb-4">
                "We're not a big agency — and that's the point. We care more about meaningful work,
                strong partnerships, and results than we do about noise."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-xs text-primary">
                  NA
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Nathan Anniss</div>
                  <div className="font-mono text-[10px] text-primary tracking-widest uppercase">Founder</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Interactive Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            <div className="mb-6">
              <p className="font-mono text-[11px] text-muted-foreground tracking-[0.12em] uppercase">
                Interactive — type a command or click a chip
              </p>
            </div>
            <InteractiveTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
