import { Users, Code, Palette, Terminal } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-black/40 border-y border-white/5">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[04 About]</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Creative minds. Real humans. <span className="text-white">One tight-knit team.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We're not just here to make things look good - we're here to make them work. From bold startups to growing brands, we help teams bring their ideas to life through strategy, design, and digital experiences that matter.
            </p>

            <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 mb-8">
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">80+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">3+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Years</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">100%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Happy Clients</div>
              </div>
            </div>

            <div className="bg-card/30 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">NA</div>
                <div>
                  <div className="font-bold text-white">Nathan Anniss</div>
                  <div className="text-sm text-primary">Founder</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "We're not a big agency - and that's the point. We care more about meaningful work, strong partnerships, and results than we do about noise."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="bg-card/20 border border-white/5 p-6 rounded-2xl hover:bg-card/40 transition-colors">
                <Code className="w-8 h-8 text-blue-400 mb-4" />
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-sm text-muted-foreground">Developers</div>
              </div>
              <div className="bg-card/20 border border-white/5 p-6 rounded-2xl hover:bg-card/40 transition-colors">
                <Palette className="w-8 h-8 text-purple-400 mb-4" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-muted-foreground">Designer</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-card/20 border border-white/5 p-6 rounded-2xl hover:bg-card/40 transition-colors">
                <Users className="w-8 h-8 text-yellow-400 mb-4" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-muted-foreground">Project Manager</div>
              </div>
              <div className="bg-card/20 border border-white/5 p-6 rounded-2xl hover:bg-card/40 transition-colors">
                <Terminal className="w-8 h-8 text-green-400 mb-4" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-muted-foreground">Technical Lead</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
