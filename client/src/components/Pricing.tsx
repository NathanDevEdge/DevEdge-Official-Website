import { Check } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const subscriptionFeatures = [
  "Set number of hours per month",
  "Priority turnaround",
  "Flexible scope (design, dev, SEO)",
  "Direct access to your creative team",
  "Monthly planning & check-ins",
];

const projectFeatures = [
  "Fixed scope, timeline & deliverables",
  "One-time fee based on scope",
  "Full focus on a single goal",
  "Dedicated team for your project",
  "Clear milestones & approvals",
];

const popularServices = [
  { name: "Full Website", price: "from A$2,250" },
  { name: "System Development", price: "from A$1,800" },
  { name: "App Development", price: "from A$3,750" },
  { name: "Cloud Migration", price: "from A$1,200" },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 border-y border-[#2E1F0F] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[160px] rounded-full" />
      </div>

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
              06 Pricing
            </span>
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
            >
              Flexible plans.<br />
              <span className="text-muted-foreground font-normal" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>
                Serious impact.
              </span>
            </h2>
            <p className="mt-6 font-mono text-[11px] text-muted-foreground tracking-widest">
              * Prices are estimates. Contact us for a precise quote.
            </p>
          </motion.div>
        </div>

        {/* Plans grid */}
        <div className="grid lg:grid-cols-2 gap-px bg-[#2E1F0F] mb-px">

          {/* Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="bg-background p-10 flex flex-col hover:bg-[#EDD9C0] transition-colors duration-200 group"
          >
            <div className="mb-2">
              <h3 className="font-display font-bold text-foreground text-3xl mb-2">Subscription</h3>
              <p className="text-muted-foreground text-[14px]">
                Ideal for brands that need regular creative, design, or dev work.
              </p>
            </div>

            <div className="py-8 border-y border-[#2E1F0F] my-8">
              <span className="font-display font-black text-foreground" style={{ fontSize: "clamp(48px, 5vw, 64px)", lineHeight: 1 }}>
                $750
              </span>
              <span className="text-muted-foreground text-lg ml-2">/month</span>
            </div>

            <div className="space-y-4 flex-1 mb-10">
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-4">What's included</p>
              {subscriptionFeatures.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>

            <ContactModal
              buttonText="Start Monthly Plan"
              triggerClassName="w-full bg-foreground hover:bg-primary text-background hover:text-[#1A1008] font-semibold h-12 rounded-none text-[15px] transition-colors duration-150"
            />
          </motion.div>

          {/* Per Project — featured */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="bg-background p-10 flex flex-col relative overflow-hidden group"
            style={{ boxShadow: "inset 0 0 80px -40px rgba(201,123,58,0.12)" }}
          >
            {/* Featured badge */}
            <div className="absolute top-0 right-0 bg-primary text-[#1A1008] font-mono text-[10px] font-bold px-4 py-1.5 tracking-widest uppercase">
              Popular
            </div>

            {/* Ember left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />

            <div className="mb-2">
              <h3 className="font-display font-bold text-foreground text-3xl mb-2">Per Project</h3>
              <p className="text-muted-foreground text-[14px]">
                Perfect for a full-service launch, one-off redesign, or focused sprint.
              </p>
            </div>

            <div className="py-8 border-y border-[#2E1F0F] my-8">
              <span className="font-mono text-muted-foreground text-sm">From</span>
              <span className="font-display font-black text-primary ml-2" style={{ fontSize: "clamp(48px, 5vw, 64px)", lineHeight: 1 }}>
                $300
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-10">
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-4">What's included</p>
              {projectFeatures.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>

            <ContactModal
              buttonText="Get a Custom Quote"
              triggerClassName="w-full bg-primary hover:bg-primary/90 text-[#1A1008] font-semibold h-12 rounded-none text-[15px] transition-colors duration-150"
            />
          </motion.div>
        </div>

        {/* Popular services */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
          className="bg-[#EDD9C0] border border-[#2E1F0F] p-8"
        >
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-6">
            Popular services
          </p>
          <div className="grid md:grid-cols-2 gap-px bg-[#2E1F0F]">
            {popularServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between bg-[#EDD9C0] hover:bg-[#D9C8A8] transition-colors duration-150 px-6 py-4"
              >
                <span className="font-medium text-foreground text-sm">{service.name}</span>
                <span className="font-mono text-primary text-[12px] tracking-widest">{service.price}</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground mt-6">
            We'll tailor the quote to your timeline, goals, and budget.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
