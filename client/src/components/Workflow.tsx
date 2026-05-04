import { Search, PenTool, Code2, Rocket } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "Deep understanding of your business, forming the foundation for an impactful strategy.",
    icon: Search,
  },
  {
    number: "02",
    title: "Design",
    description: "Crafting innovative concepts and user-focused designs that effectively speak to your audience.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Development",
    description: "Turning ideas into products, built with precision, delivered on time, and fully optimised for results.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch",
    description: "Deploying your project, monitoring performance, and refining for ongoing success.",
    icon: Rocket,
  },
];

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 65%", "end 65%"],
  });
  const lineWidth = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
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
              03 How We Work
            </span>
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
            >
              No guesswork —<br />
              <span className="text-muted-foreground font-normal" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>
                a clear path from idea to result.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Scroll-animated connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-[#2E1F0F] z-0">
            <motion.div
              className="h-full bg-primary/60 origin-left"
              style={{ width: lineWidth }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2E1F0F] relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="bg-background hover:bg-[#EDD9C0] transition-colors duration-200 group"
              >
                {/* Step number dot (connects to the line) */}
                <div className="hidden lg:flex justify-center pt-[40px] pb-0">
                  <div className="w-6 h-6 border border-[#2E1F0F] bg-background group-hover:border-primary group-hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center">
                    <span className="w-2 h-2 bg-primary/60 group-hover:bg-primary transition-colors duration-200" />
                  </div>
                </div>

                <div className="p-8">
                  {/* Icon */}
                  <div className="w-10 h-10 border border-[#2E1F0F] group-hover:border-primary/40 flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary transition-colors duration-200">
                    <step.icon className="w-4 h-4" />
                  </div>

                  {/* Number */}
                  <span className="font-mono text-[10px] text-primary tracking-widest uppercase block mb-3">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="font-display font-bold text-foreground text-xl mb-3 group-hover:text-primary transition-colors duration-200">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-[14px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
