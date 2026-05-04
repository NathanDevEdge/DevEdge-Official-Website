// Slide 04 — Services
// Copy reference: COPY_PLAN.md sections 4.1 – 4.11
// STATUS: Full implementation — expandable module interaction (no pricing shown)
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import ContactModal from "@/components/ContactModal";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// Copy: COPY_PLAN.md § 4.4 – 4.9 — no pricing per brief
const services = [
  {
    id: "custom-dev",
    name: "Custom Software Development",
    description: "Purpose-built tools that do exactly what your business needs.",
    expanded:
      "We design and build software from scratch — no off-the-shelf compromises. Whether it's an internal tool, a customer-facing platform, or something that doesn't have a category yet, we scope it properly and build it to last.",
    tag: "Most Complex",
  },
  {
    id: "web-platform",
    name: "Web Platforms & E-commerce",
    description: "Fast, polished, and built to convert — not just look good.",
    expanded:
      "Websites and web apps that perform. From conversion-optimised landing pages to full e-commerce builds, every project is engineered for speed, SEO, and real business results — not just aesthetics.",
    tag: "Popular",
  },
  {
    id: "integrations",
    name: "System Integrations & APIs",
    description: "Connect your tools, automate the handoffs, eliminate the gaps.",
    expanded:
      "If your tools don't talk to each other, you're bleeding time. We build the bridges — custom APIs, webhooks, and middleware that make your stack work as one seamless system.",
    tag: null,
  },
  {
    id: "automation",
    name: "Process Automation",
    description: "Stop doing manually what a system can handle for you.",
    expanded:
      "Identify the repetitive tasks eating your team's hours and replace them with reliable automated workflows. From data entry to report generation to notification systems — we build automations that actually run without babysitting.",
    tag: null,
  },
  {
    id: "cloud",
    name: "Cloud Migration & DevOps",
    description: "Move to modern infrastructure without the downtime or drama.",
    expanded:
      "Whether you're on legacy servers, a slow shared host, or an over-engineered setup, we migrate you to the right cloud infrastructure — with CI/CD pipelines, environment management, and monitoring built in from day one.",
    tag: null,
  },
  {
    id: "design",
    name: "UI/UX Design",
    description: "Interfaces that make sense — designed for users, not portfolios.",
    expanded:
      "Design that serves the product. We create wireframes, prototypes, and production-ready UI that's informed by how real users actually behave — not what looks impressive in a Dribbble screenshot.",
    tag: null,
  },
];

function ServiceCard({
  service,
  isOpen,
  onToggle,
}: {
  service: (typeof services)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className={`relative flex flex-col border-b border-[#D4B896] overflow-hidden transition-colors duration-200 ${
        isOpen ? "bg-[#EDD9C0]" : "bg-background hover:bg-[#F5DFC8]"
      }`}
      style={{ borderLeft: isOpen ? "2px solid #C97B3A" : "2px solid transparent" }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="font-display font-bold text-foreground text-[16px] leading-tight">
              {service.name}
            </h3>
            {service.tag && (
              <span className="font-mono text-[9px] bg-primary text-[#1A1008] px-2 py-0.5 tracking-widest uppercase shrink-0">
                {service.tag}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-[13px] leading-relaxed">{service.description}</p>
        </div>
        <span
          className={`w-6 h-6 border flex items-center justify-center shrink-0 pt-0.5 transition-all duration-200 ${
            isOpen ? "border-primary text-primary" : "border-[#D4B896] text-muted-foreground"
          }`}
        >
          {isOpen ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="px-6 pb-6 border-t border-[#D4B896]">
              <p className="text-[14px] text-foreground leading-relaxed mt-4 mb-5 max-w-2xl">
                {service.expanded}
              </p>
              {/* CTA — Copy: COPY_PLAN.md § 4.10 */}
              <ContactModal
                buttonText="Get a quote for this →"
                triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-6 h-10 rounded-none text-[13px] transition-colors duration-150"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Slide04Services() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section
      id="slide-04"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[#C97B3A]/4 blur-[160px] rounded-full" />
      </div>

      <div className="container relative z-10 py-12">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Eyebrow — Copy: COPY_PLAN.md § 4.1 */}
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-primary inline-block" />
            04 Services
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {/* Heading — Copy: COPY_PLAN.md § 4.2 */}
              <h2
                className="font-display font-black text-foreground leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
              >
                Pick your modules.
              </h2>
              {/* Subheading — Copy: COPY_PLAN.md § 4.3 */}
              <p className="text-muted-foreground text-[14px] mt-2 max-w-md">
                Every engagement is scoped to your goals. These are the building blocks.
              </p>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest shrink-0 pb-1">
              Click a module to expand
            </p>
          </div>
        </motion.div>

        {/* Service accordion list */}
        <motion.div
          className="border-t border-[#D4B896]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isOpen={openId === service.id}
              onToggle={() => toggle(service.id)}
            />
          ))}
        </motion.div>

        {/* Quote note — Copy: COPY_PLAN.md § 4.11 */}
        <motion.p
          className="font-mono text-[10px] text-muted-foreground tracking-widest mt-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          * Every project is scoped and quoted individually. First conversation is always free.
        </motion.p>
      </div>
    </section>
  );
}
