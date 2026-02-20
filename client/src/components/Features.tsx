import { Zap, TrendingUp, Globe, MessageSquare } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Features() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <section className="py-32 bg-black/40 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background pointer-events-none"></div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary"></span> 02 Features <span className="w-8 h-px bg-primary"></span>
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 leading-tight">
            You'll get more than just great design - <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">you'll get results.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Feature 1 - Collaboration */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group transition-colors duration-500 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="flex-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 text-blue-400 shadow-[0_0_30px_-5px_var(--color-blue-500)]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-display font-medium mb-4">Effortless Collaboration</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-light">
                  Real-time updates and fast replies that make you feel like we're right there with you. No ghosting, just clear, immediate communication.
                </p>
              </div>

              {/* Chat UI Mockup */}
              <div className="flex-1 w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl transform group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-700">
                <div className="flex gap-4 items-end">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs border border-primary/30 shrink-0">You</div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-bl-none p-4 text-sm border border-white/5 text-white/90">
                    Just saw the first draft - this is 🔥🔥🔥
                  </div>
                </div>
                <div className="flex gap-4 items-end flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs border border-blue-500/30 shrink-0">Dev</div>
                  <div className="bg-blue-500/20 backdrop-blur-md text-blue-50 rounded-2xl rounded-br-none p-4 text-sm border border-blue-500/20">
                    Yes! So glad you like it. Want me to prep a second direction too?
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 filter blur-3xl mix-blend-screen pointer-events-none"></div>
          </motion.div>

          {/* Feature 2 - Speed */}
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group transition-colors duration-500 shadow-2xl">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-8 text-yellow-400 shadow-[0_0_30px_-5px_var(--color-yellow-500)]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-display font-medium mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground text-lg mb-8 font-light">Projects transformed and launched in as little as</p>
              <div className="text-7xl font-display font-medium text-white tracking-tighter">
                3 <span className="text-2xl text-white/50 font-normal">weeks</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          </motion.div>

          {/* Feature 3 - Conversion */}
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group transition-colors duration-500 shadow-2xl">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 text-green-400 shadow-[0_0_30px_-5px_var(--color-green-500)]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-display font-medium mb-3">Increased Sales</h3>
              <p className="text-muted-foreground text-lg mb-8 font-light">Engineered for maximum conversion rates.</p>
              <div className="text-7xl font-display font-medium text-green-400 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">
                +40%
              </div>
              <p className="text-sm font-medium text-green-400/80 mt-4 tracking-wide uppercase">Revenue Growth</p>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          </motion.div>

          {/* Feature 4 - Global Reach */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group transition-colors duration-500 shadow-2xl">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 text-purple-400 shadow-[0_0_30px_-5px_var(--color-purple-500)]">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-display font-medium mb-4">Stronger Online Presence</h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-light">
                  Rank higher, get found faster, and dramatically expand your reach with highly optimized digital platforms built for scale.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "+200", label: "Countries" },
                  { value: "1M+", label: "Impressions" },
                  { value: "99%", label: "Uptime" },
                  { value: "10x", label: "ROI" }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 group-hover:bg-white/5 transition-colors duration-500">
                    <div className="text-3xl font-display font-medium text-white mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-white/50 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute left-0 bottom-0 w-1/2 h-full bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none filter blur-2xl"></div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
