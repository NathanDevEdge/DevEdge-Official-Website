import { ArrowRight } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useRef, useState } from "react";

const services = [
  {
    id: "01",
    title: "Custom Software",
    description:
      "Built for your exact problem. Not adapted from a template — written from scratch around how your business actually works.",
    tag: "WEB · BACKEND · API",
    snippet: ["const app = build({", '  for: client,', "  from: scratch,", "});"],
    slug: "custom-development",
  },
  {
    id: "02",
    title: "Web Platforms",
    description:
      "Fast, polished web applications your team and clients actually want to use. Built for performance and longevity, not just launch day.",
    tag: "REACT · NODE · TYPESCRIPT",
    snippet: ["await platform.deploy({", '  speed: "fast",', '  quality: "high",', "});"],
    slug: "web-platforms",
  },
  {
    id: "03",
    title: "System Integration",
    description:
      "Connect your tools and stop paying someone to copy data between systems that should talk to each other.",
    tag: "API · WEBHOOKS · SYNC",
    snippet: ["connect(", "  systemA,", "  systemB,", "); // synced"],
    slug: "integrations",
  },
  {
    id: "04",
    title: "Process Automation",
    description:
      "If your team is doing the same thing more than once a week, it can probably be automated. Let's find out.",
    tag: "WORKFLOWS · TRIGGERS · DATA",
    snippet: ["while (manual) {", "  automate(task);", "}", "// done"],
    slug: "process-automation",
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 400, damping: 35 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 400, damping: 35 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setSpotlight((s) => ({ ...s, visible: false }));
  };

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Spotlight glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(circle 220px at ${spotlight.x}px ${spotlight.y}px, rgba(201,123,58,0.07), transparent 70%)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}

export default function Services() {
  const ease = [0.25, 0.1, 0.25, 1.0] as const;

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="container relative z-10">

        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary inline-block" />
              01 What We Build
            </span>
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
            >
              Not just services —<br />
              <span className="text-muted-foreground font-normal" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>
                outcomes your business can feel.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-px bg-[#2E1F0F]">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease }}
            >
              <TiltCard className="group bg-background hover:bg-[#EDD9C0] transition-colors duration-200 p-10 flex flex-col gap-6 h-full">
                {/* Large background number */}
                <span
                  className="absolute -right-4 -top-4 font-display font-black text-[140px] leading-none select-none pointer-events-none"
                  style={{ color: "rgba(201,123,58,0.04)", zIndex: 0 }}
                  aria-hidden
                >
                  {service.id}
                </span>

                {/* Service number + tag */}
                <div className="flex items-center justify-between relative z-20">
                  <span className="font-mono text-xs text-primary tracking-widest">{service.id}</span>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest opacity-60">{service.tag}</span>
                </div>

                {/* Title */}
                <h3
                  className="font-display font-bold text-foreground group-hover:text-primary transition-colors duration-200 relative z-20"
                  style={{ fontSize: "clamp(28px, 2.5vw, 38px)", lineHeight: 1 }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-[15px] leading-relaxed flex-1 relative z-20">
                  {service.description}
                </p>

                {/* Code snippet */}
                <div className="relative bg-[#1A1008] border border-[#2E1F0F] border-l-2 border-l-primary/50 px-5 py-4 z-20">
                  {service.snippet.map((line, j) => (
                    <div key={j} className="font-mono text-[12px] text-[#A89070] leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>

                {/* Link */}
                <Link href={`/services/${service.slug}`}>
                  <div className="relative z-20 inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors duration-150 cursor-pointer">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="bg-[#EDD9C0] p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ borderTop: "1px solid #2E1F0F" }}
        >
          <div className="max-w-xl">
            <h3 className="font-display font-bold text-foreground text-2xl mb-2">
              Got a complex problem?{" "}
              <span className="text-primary">Good.</span>
            </h3>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              That's where we do our best work. Tell us what you're dealing with
              — we'll tell you honestly if we can help.
            </p>
          </div>
          <ContactModal
            buttonText="Start the Conversation"
            triggerClassName="shrink-0 bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
          />
        </motion.div>

      </div>
    </section>
  );
}
