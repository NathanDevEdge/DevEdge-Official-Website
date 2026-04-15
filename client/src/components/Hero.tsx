import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ContactModal";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const CODE_LINES = [
  { text: "// Small team. Full attention.", type: "comment" },
  { text: "const devedge = {", type: "code" },
  { text: '  approach:    "precise",', type: "prop" },
  { text: '  farming_out:  false,', type: "prop" },
  { text: '  templates:    false,', type: "prop" },
  { text: '  bs:           0,', type: "prop" },
  { text: "};", type: "code" },
  { text: "", type: "blank" },
  { text: "// Got a complex problem?", type: "comment" },
  { text: "// Good. That's where we", type: "comment" },
  { text: "// do our best work.", type: "comment" },
  { text: "", type: "blank" },
  { text: "devedge.ship(yourProject);", type: "code" },
  { text: "// → It works.", type: "comment" },
];

function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return;
    const delay = visibleLines === 0 ? 700 : CODE_LINES[visibleLines - 1].type === "blank" ? 80 : 160;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="relative w-full rounded-none border border-white/10 bg-[#0D0804] shadow-2xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-auto font-mono text-xs text-white/30 tracking-widest">devedge.ts</span>
      </div>

      {/* Code body */}
      <div className="p-6 font-mono text-sm leading-relaxed min-h-[300px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-5 shrink-0 text-right text-white/20 select-none text-xs pt-0.5">
              {line.type !== "blank" ? i + 1 : ""}
            </span>
            <span
              className={
                line.type === "comment"
                  ? "text-[#A89070]"
                  : line.type === "prop"
                  ? "text-[#E8D9C6]"
                  : "text-[#F5E6D5]"
              }
            >
              {line.text}
              {i === visibleLines - 1 && visibleLines < CODE_LINES.length && (
                <span className="inline-block w-[7px] h-[14px] bg-[#C97B3A] ml-0.5 animate-pulse align-middle" />
              )}
            </span>
          </div>
        ))}
        {visibleLines >= CODE_LINES.length && (
          <div className="flex gap-4 mt-1">
            <span className="w-5 shrink-0" />
            <span className="inline-block w-[7px] h-[14px] bg-[#C97B3A] animate-pulse align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
        <div className="absolute top-1/3 right-0 w-[480px] h-[480px] bg-primary/6 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: Copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-3">
              <span className="w-6 h-px bg-primary" />
              DevEdge · Software & Systems
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-5">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.0] tracking-tight">
              We build things<br />
              that actually{" "}
              <span className="text-primary">work.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-normal">
              Custom software, web platforms, and backend systems
              for businesses that need results — not just deliverables.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
            <ContactModal
              buttonText="Start a Project"
              triggerClassName="group text-base font-semibold px-8 h-12 bg-primary text-[#1A1008] hover:bg-primary/90 transition-colors duration-150 rounded-none"
            />
            <Button
              size="lg"
              variant="outline"
              className="text-base font-medium px-8 h-12 border-white/15 bg-transparent hover:bg-white/5 transition-colors duration-150 rounded-none text-foreground"
            >
              See Our Work <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 border-t border-white/8">
            <p className="font-mono text-xs text-muted-foreground tracking-wide">
              Small team.&nbsp;&nbsp;Full attention.&nbsp;&nbsp;No farming out, no templates.
            </p>
          </motion.div>
        </motion.div>

        {/* Right: Code Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          className="hidden lg:block"
        >
          <CodeTerminal />
        </motion.div>

      </div>
    </section>
  );
}
