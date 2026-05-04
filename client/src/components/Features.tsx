import { motion } from "framer-motion";
import { MessageSquare, Zap, TrendingUp, Globe } from "lucide-react";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function Features() {
  return (
    <section className="py-32 border-y border-[#2E1F0F] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C97B3A]/3 blur-[160px] rounded-full" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary inline-block" />
            02 Why DevEdge
          </span>
          <h2
            className="font-display font-black text-foreground leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
          >
            You'll get more than<br />
            <span className="text-muted-foreground font-normal" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>
              just great code — you'll get results.
            </span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2E1F0F]"
        >
          {/* Collaboration — wide */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-background hover:bg-[#EDD9C0] transition-colors duration-300 p-10 group relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center h-full">
              <div className="flex-1">
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-8 text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3
                  className="font-display font-bold text-foreground mb-4 leading-tight"
                  style={{ fontSize: "clamp(26px, 2.2vw, 34px)" }}
                >
                  Effortless Collaboration
                </h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
                  Real-time updates and fast replies that make you feel like we're right there with you.
                  No ghosting, just clear, immediate communication.
                </p>
              </div>

              {/* Chat mockup — warm palette */}
              <div className="flex-1 w-full bg-[#1A1008] border border-[#2E1F0F] p-6 space-y-4 group-hover:-rotate-1 group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex gap-3 items-end">
                  <div className="w-7 h-7 bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-mono text-primary shrink-0">
                    YOU
                  </div>
                  <div className="bg-[#2E1F0F] border border-[#2E1F0F] p-3 text-sm text-[#F5E6D5] font-sans">
                    Just saw the first draft — this is exactly what I wanted.
                  </div>
                </div>
                <div className="flex gap-3 items-end flex-row-reverse">
                  <div className="w-7 h-7 bg-[#2E1F0F] border border-[#2E1F0F] flex items-center justify-center text-[10px] font-mono text-[#F5E6D5] shrink-0">
                    DEV
                  </div>
                  <div className="bg-primary/10 border border-primary/20 p-3 text-sm text-primary/90">
                    Great! I'll prep the second direction and send it over tonight.
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest">Nathan is typing...</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Speed */}
          <motion.div
            variants={itemVariants}
            className="bg-background hover:bg-[#EDD9C0] transition-colors duration-300 p-10 flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-8 text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-foreground text-2xl mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                Projects launched in as little as
              </p>
            </div>
            <div className="mt-8">
              <span className="font-display font-black text-primary" style={{ fontSize: "clamp(56px, 6vw, 80px)", lineHeight: 1 }}>3</span>
              <span className="font-display text-muted-foreground text-2xl ml-2">weeks</span>
            </div>
            <div
              className="absolute bottom-0 right-0 w-32 h-32 bg-[#C97B3A]/5 blur-[60px] rounded-full pointer-events-none"
            />
          </motion.div>

          {/* Results */}
          <motion.div
            variants={itemVariants}
            className="bg-background hover:bg-[#EDD9C0] transition-colors duration-300 p-10 flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-8 text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-foreground text-2xl mb-3">Increased Revenue</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                Engineered for maximum conversion and real business impact.
              </p>
            </div>
            <div className="mt-8">
              <span className="font-display font-black text-primary group-hover:scale-105 inline-block transition-transform duration-300 origin-left" style={{ fontSize: "clamp(56px, 6vw, 80px)", lineHeight: 1 }}>+40%</span>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-2">Avg. revenue growth</p>
            </div>
          </motion.div>

          {/* Online Presence — wide */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-background hover:bg-[#EDD9C0] transition-colors duration-300 p-10 group relative overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center h-full">
              <div>
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-8 text-primary">
                  <Globe className="w-5 h-5" />
                </div>
                <h3
                  className="font-display font-bold text-foreground mb-4 leading-tight"
                  style={{ fontSize: "clamp(26px, 2.2vw, 34px)" }}
                >
                  Stronger Online Presence
                </h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  Rank higher, get found faster, and dramatically expand your reach with highly
                  optimized digital platforms built for scale.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-px bg-[#2E1F0F]">
                {[
                  { value: "+200", label: "Countries" },
                  { value: "1M+", label: "Impressions" },
                  { value: "99%", label: "Uptime" },
                  { value: "10x", label: "ROI" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background group-hover:bg-[#EDD9C0] transition-colors duration-300 p-6 flex flex-col gap-1"
                  >
                    <span className="font-display font-black text-primary" style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1 }}>
                      {stat.value}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
