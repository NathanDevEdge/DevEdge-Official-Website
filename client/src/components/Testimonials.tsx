import { motion } from "framer-motion";
import testimonials from "@/data/testimonials.json";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container">

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
              05 Testimonials
            </span>
            <h2
              className="font-display font-black text-foreground leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
            >
              Real stories.<br />
              <span className="text-muted-foreground font-normal" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>
                Straight from our clients.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Cards — horizontal scroll on mobile, 2-col on desktop */}
        <div className="grid md:grid-cols-2 gap-px bg-[#2E1F0F]">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1, ease }}
              className="bg-background hover:bg-[#EDD9C0] transition-colors duration-200 p-10 flex flex-col gap-6 group"
            >
              {/* Opening mark */}
              <span
                className="font-display font-black text-[80px] text-primary/10 group-hover:text-primary/20 transition-colors duration-300 leading-none select-none"
                aria-hidden
              >
                "
              </span>

              {/* Quote */}
              <p className="text-muted-foreground text-[15px] leading-relaxed flex-1 -mt-6">
                {testimonial.content}
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#2E1F0F]">
                <div className="w-9 h-9 bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-xs text-primary">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
