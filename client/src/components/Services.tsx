import { ArrowRight } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";
import { Link } from "wouter";

const services = [
  {
    id: "01",
    title: "Custom Software",
    description: "Built for your exact problem. Not adapted from a template — written from scratch around how your business actually works.",
    tag: "WEB · BACKEND · API",
    code: 'build({ for: "you" });',
    slug: "custom-development",
  },
  {
    id: "02",
    title: "Web Platforms",
    description: "Fast, polished web applications your team and clients actually want to use. We build for performance and longevity, not just launch day.",
    tag: "REACT · NODE · TYPESCRIPT",
    code: "ship(platform, { fast: true });",
    slug: "web-platforms",
  },
  {
    id: "03",
    title: "System Integration",
    description: "Connect your tools, automate the gaps, and stop paying someone to copy data between systems that should talk to each other.",
    tag: "API · WEBHOOKS · SYNC",
    code: "connect(systemA, systemB);",
    slug: "integrations",
  },
  {
    id: "04",
    title: "Process Automation",
    description: "If your team is doing the same thing more than once a week, it can probably be automated. Let's find out.",
    tag: "WORKFLOWS · TRIGGERS · DATA",
    code: "automate(repetitiveTask);",
    slug: "process-automation",
  },
];

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
    },
  };

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="container relative z-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block inline-flex items-center gap-3">
              <span className="w-6 h-px bg-primary" /> 01 What We Build
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Not just services —<br />
              <span className="text-muted-foreground font-normal">outcomes your business can feel.</span>
            </h2>
          </div>
        </div>

        {/* Service cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5"
        >
          {services.map((service) => (
            <motion.div
              variants={cardVariants}
              key={service.id}
              className="group relative bg-background p-8 flex flex-col gap-6 hover:bg-card transition-colors duration-200"
            >
              {/* Number + tag */}
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-primary tracking-widest">{service.id}</span>
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest">{service.tag}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              {/* Code snippet */}
              <div className="font-mono text-xs text-primary/60 bg-[#0D0804] px-4 py-3 border-l-2 border-primary/30">
                {service.code}
              </div>

              {/* Link */}
              <Link href={`/services/${service.slug}`}>
                <div className="inline-flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                  Learn more <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 p-10 border border-white/8 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Got a complex problem? Good.
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              That's where we do our best work. Tell us what you're dealing with — we'll tell you honestly if we can help.
            </p>
          </div>
          <ContactModal
            buttonText="Start the Conversation"
            triggerClassName="shrink-0 bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none transition-colors duration-150"
          />
        </motion.div>

      </div>
    </section>
  );
}
