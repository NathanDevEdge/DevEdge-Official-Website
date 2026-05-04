import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on the scope. A landing page might take 2–3 weeks, while a full branding and website package could take 6–10. We'll give you a clear timeline before we begin.",
  },
  {
    question: "What if I don't know exactly what I need?",
    answer:
      "No problem. We'll help you figure it out. Whether it's a quick call or a deeper discovery session, we'll guide you through it.",
  },
  {
    question: "Do I need to start with a full project, or can we begin small?",
    answer:
      "Absolutely. You can book a single service or bundle multiple — whatever fits your goals and timeline.",
  },
  {
    question: "How do payments work?",
    answer:
      "For projects, we usually split payments into 2 or 3 milestones. For monthly plans, billing is done upfront each month. Everything is clear and agreed upon before we start.",
  },
  {
    question: "Do you provide ongoing support after the project?",
    answer:
      "Absolutely. Once your project goes live, we don't just disappear. We can stay involved to monitor performance, make improvements, or add new features as your business grows. Whether you need a quick fix, continued development, or a long-term partner, we'll be there.",
  },
];

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 relative">
      <div className="container max-w-4xl">

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
              07 FAQ
            </span>
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
            >
              Smarter decisions<br />
              <span className="text-muted-foreground font-normal" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>
                start with clear answers.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Accordion */}
        <div className="space-y-px bg-[#2E1F0F]">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease }}
            >
              <div
                className={`bg-background transition-colors duration-200 ${open === i ? "bg-[#EDD9C0]" : "hover:bg-[#EDD9C0]"}`}
              >
                <button
                  className="w-full flex items-center justify-between p-8 text-left gap-6 group"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span
                    className={`font-display font-bold text-lg transition-colors duration-200 ${
                      open === i ? "text-primary" : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 border flex items-center justify-center shrink-0 transition-all duration-200 ${
                      open === i
                        ? "border-primary text-primary rotate-45"
                        : "border-[#2E1F0F] text-muted-foreground group-hover:border-primary/50"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 border-l-2 border-primary/60 ml-8">
                        <p className="text-muted-foreground text-[15px] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
