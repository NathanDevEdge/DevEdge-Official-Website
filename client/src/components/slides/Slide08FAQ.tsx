// Slide 08 — FAQ
// Copy reference: COPY_PLAN.md sections 8.1 – 8.8
// STATUS: Full implementation — polished two-column layout, functional accordion
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import ContactModal from "@/components/ContactModal";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

// Copy: COPY_PLAN.md § 8.3 – 8.8 — [USE SUGGESTED COPY]
const faqs = [
  {
    q: "How long does a project take?",
    a: "It depends on scope, but most projects land between 2 and 8 weeks. A focused landing page or automation can be live in under 2 weeks. A full platform build typically takes 6–10 weeks. We'll give you a real timeline in the first conversation — not a vague 'it depends.'",
  },
  {
    q: "How does pricing work?",
    a: "Every project is scoped and quoted individually — we don't do fixed packages because every brief is different. You'll get a clear quote before anything starts. No hourly surprises, no scope creep without a conversation first.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Yes — and some of our best work has been for them. We take on a small number of projects at a time, so you get real attention regardless of your size. If your problem is interesting and your goals are serious, we want to talk.",
  },
  {
    q: "Do you outsource any of the work?",
    a: "No. Everything is done in-house by our team. We don't use offshore contractors, freelancer marketplaces, or junior devs to execute work we've sold. What you see is who builds it.",
  },
  {
    q: "What happens if I need changes after launch?",
    a: "We offer ongoing support on a per-request or monthly basis — your choice. Nothing is locked in. If something breaks, we're available. If you want to evolve the product, we're ready for that conversation.",
  },
  {
    q: "Can you work with our existing tech stack?",
    a: "Usually yes. We'll assess what you have in the Discovery phase and tell you honestly whether it makes sense to build on top of it or start fresh. We won't recommend a rewrite just to bill more hours.",
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      className={`border-b border-[#D4B896] transition-colors duration-200 ${
        isOpen ? "border-l-2 border-l-primary pl-4" : "pl-0"
      }`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-5 py-5 text-left group"
      >
        <span
          className={`font-medium text-[15px] leading-snug transition-colors duration-150 ${
            isOpen ? "text-foreground" : "text-foreground group-hover:text-primary"
          }`}
        >
          {q}
        </span>
        <span
          className={`shrink-0 w-5 h-5 border flex items-center justify-center mt-0.5 transition-all duration-200 ${
            isOpen
              ? "border-primary text-primary rotate-45"
              : "border-[#D4B896] text-muted-foreground group-hover:border-primary/50"
          }`}
        >
          <Plus className="w-3 h-3" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
          >
            <p className="pb-5 text-[14px] text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Slide08FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="slide-08"
      className="relative min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#C97B3A]/3 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[#C97B3A]/2 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">

          {/* Left: heading + CTA */}
          <motion.div
            className="lg:sticky lg:top-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease }}
          >
            {/* Eyebrow — Copy: COPY_PLAN.md § 8.1 */}
            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary inline-block" />
              08 FAQ
            </span>
            {/* Heading — Copy: COPY_PLAN.md § 8.2 */}
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: "clamp(40px, 4.5vw, 60px)" }}
            >
              Straight<br />answers.
            </h2>
            <p className="text-muted-foreground text-[13px] leading-relaxed mb-8">
              Still have questions? We'd rather answer them in a real conversation.
            </p>
            <ContactModal
              buttonText="Ask us anything →"
              triggerClassName="bg-foreground text-background hover:bg-primary hover:text-[#1A1008] font-semibold px-6 h-11 rounded-none text-[13px] transition-colors duration-150"
            />
          </motion.div>

          {/* Right: accordion */}
          <div>
            <div className="border-t border-[#D4B896]">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  index={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>

            {/* Bottom note */}
            <motion.p
              className="font-mono text-[10px] text-muted-foreground tracking-widest mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
            >
              * All pricing and timelines are project-specific. First conversation is always free.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
