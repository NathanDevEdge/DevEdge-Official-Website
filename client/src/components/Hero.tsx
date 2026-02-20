import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ContactModal";
import { ArrowRight, Code2, Cpu, Globe2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full opacity-50 mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full opacity-50 mix-blend-screen"></div>

        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Column - Typography & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/90 tracking-wide">Next-Gen Software Agency</span>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-medium leading-[1.1] tracking-tight">
              Linking Ideas to <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/80 to-primary">Execution.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-light">
              Elevate your digital presence. We engineer custom, high-performance web and mobile solutions that drive enterprise growth and unparalleled user experiences.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 pt-4">
            <ContactModal
              buttonText="Start a Project"
              triggerClassName="group rounded-full text-base font-medium px-8 h-14 bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
            />
            <Button size="lg" variant="outline" className="rounded-full text-base font-medium px-8 h-14 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white">
              Explore Our Work
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-10 grid grid-cols-3 gap-8 border-t border-white/5">
            <div>
              <div className="text-3xl font-display font-semibold text-white mb-1">80+</div>
              <div className="text-sm text-muted-foreground">Digital Products</div>
            </div>
            <div>
              <div className="text-3xl font-display font-semibold text-white mb-1">99%</div>
              <div className="text-sm text-muted-foreground">Client Success</div>
            </div>
            <div>
              <div className="text-3xl font-display font-semibold text-white mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Global Support</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Premium Visual */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: 15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="hidden lg:block relative perspective-1000"
        >
          {/* Main Glass Card */}
          <div className="relative z-10 w-full aspect-square max-h-[600px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8 overflow-hidden group hover:border-primary/30 transition-colors duration-700">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative h-full flex flex-col justify-between">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 font-mono tracking-wider">
                  SYSTEM.READY
                </div>
              </div>

              {/* Center Abstract Visualization */}
              <div className="flex-1 flex items-center justify-center relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-white/10 m-8"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-primary/20 m-16"
                ></motion.div>

                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {[
                    { icon: Globe2, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { icon: Code2, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { icon: Cpu, color: "text-green-400", bg: "bg-green-500/10" },
                    { icon: Sparkles, color: "text-yellow-400", bg: "bg-yellow-500/10" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className={`w-20 h-20 rounded-2xl ${item.bg} border border-white/5 flex items-center justify-center backdrop-blur-md shadow-lg`}
                    >
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Code Snippet */}
              <div className="mt-8 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm">
                <div className="flex gap-3 text-white/50 mb-1">
                  <span>1</span>
                  <span className="text-purple-400">const</span>
                  <span className="text-blue-400">vision</span>
                  <span className="text-white/80">=</span>
                  <span className="text-yellow-300">new</span>
                  <span className="text-green-400">Project</span>()
                </div>
                <div className="flex gap-3 text-white/50">
                  <span>2</span>
                  <span className="pl-4 text-blue-400">vision</span>.
                  <span className="text-yellow-300">execute</span>()
                  <span className="text-white/80">;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 blur-[60px] rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/30 blur-[60px] rounded-full"></div>
        </motion.div>

      </div>
    </section>
  );
}
