import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Digital Architecture Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/50 to-background"></div>
        <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-primary/10 via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new projects
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Linking Ideas to <span className="text-gradient">Execution</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
            Unlock your company's potential with cutting-edge digital tools designed for every industry. From automation to analytics, we deliver solutions that drive real results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full text-lg px-8 h-14 bg-primary hover:bg-primary/90 shadow-[0_0_20px_-5px_var(--color-primary)]">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-8 h-14 border-white/20 hover:bg-white/5">
              View Our Work
            </Button>
          </div>

          <div className="pt-8 flex items-center gap-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-display font-bold text-white">80+</div>
              <div className="text-sm text-muted-foreground">Completed Projects</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div>
              <div className="text-3xl font-display font-bold text-white">3+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div>
              <div className="text-3xl font-display font-bold text-white">100%</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </div>

        {/* Right side visual - Code/Tech representation */}
        <div className="hidden lg:block relative animate-in slide-in-from-right-10 duration-1000 fade-in delay-200">
          <div className="relative z-10 glass-panel rounded-2xl p-6 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-500 perspective-1000">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-auto text-xs text-muted-foreground font-mono">main.tsx</div>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex gap-4">
                <span className="text-muted-foreground">01</span>
                <span className="text-purple-400">import</span> <span className="text-yellow-300">{`{ Future }`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@devedge/core'</span>;
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">02</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">03</span>
                <span className="text-purple-400">const</span> <span className="text-blue-400">project</span> = <span className="text-purple-400">await</span> <span className="text-yellow-300">Future</span>.<span className="text-blue-300">build</span>({`{`}
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">04</span>
                <span className="pl-4 text-blue-300">strategy:</span> <span className="text-green-400">'data-driven'</span>,
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">05</span>
                <span className="pl-4 text-blue-300">design:</span> <span className="text-green-400">'cutting-edge'</span>,
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">06</span>
                <span className="pl-4 text-blue-300">performance:</span> <span className="text-orange-400">100</span>,
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">07</span>
                {`});`}
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">08</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">09</span>
                <span className="text-purple-400">return</span> <span className="text-blue-400">project</span>.<span className="text-blue-300">launch</span>();
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -right-8 top-20 bg-card border border-primary/30 p-3 rounded-lg shadow-lg shadow-primary/20 animate-bounce duration-[3000ms]">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -left-4 bottom-10 bg-card border border-purple-500/30 p-3 rounded-lg shadow-lg shadow-purple-500/20 animate-pulse">
              <div className="text-xs font-bold text-purple-400">Deployment Ready</div>
            </div>
          </div>
          
          {/* Decorative glow behind */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full transform scale-75"></div>
        </div>
      </div>
    </section>
  );
}
