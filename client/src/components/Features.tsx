import { Zap, TrendingUp, Globe, MessageSquare } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-black/40 border-y border-white/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[02 Features]</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            You'll get more than just great design - <span className="text-gradient">you'll get results.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature 1 - Collaboration */}
          <div className="lg:col-span-2 bg-card/20 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Effortless Collaboration</h3>
              <p className="text-muted-foreground max-w-md mb-8">
                Real-time updates and fast replies that make you feel like we're right there with you. No ghosting, just clear communication.
              </p>
              
              {/* Chat UI Mockup */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 max-w-md space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">You</div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 text-sm">
                    Just saw the first draft - this is 🔥🔥🔥
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">Dev</div>
                  <div className="bg-blue-500/20 text-blue-100 rounded-2xl rounded-tr-none p-3 text-sm">
                    Yes! So glad you like it. Want me to prep a second direction too?
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 w-1/2 h-full bg-linear-to-l from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Feature 2 - Speed */}
          <div className="bg-card/20 border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6 text-yellow-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground mb-8">Projects launched in as little as</p>
              <div className="text-6xl font-display font-bold text-white tracking-tighter">
                3 <span className="text-2xl text-muted-foreground font-normal">weeks</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-radial-[circle_at_top_right,_var(--tw-gradient-stops)] from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Feature 3 - Conversion */}
          <div className="bg-card/20 border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Increased Sales</h3>
              <p className="text-muted-foreground mb-8">Clear messaging and conversion-focused design.</p>
              <div className="text-6xl font-display font-bold text-green-400 tracking-tighter">
                +40%
              </div>
              <p className="text-sm text-muted-foreground mt-2">Higher Conversion Rates</p>
            </div>
            <div className="absolute inset-0 bg-radial-[circle_at_bottom_left,_var(--tw-gradient-stops)] from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Feature 4 - Global Reach */}
          <div className="lg:col-span-2 bg-card/20 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Stronger Online Presence</h3>
                <p className="text-muted-foreground mb-6">
                  Rank higher, get found faster, and stay top-of-mind with designs and content that keep people clicking, scrolling, and sharing.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-white mb-1">+200</div>
                  <div className="text-xs text-muted-foreground">Countries Reached</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-white mb-1">+1M</div>
                  <div className="text-xs text-muted-foreground">Impressions</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-white mb-1">+3k</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-white mb-1">+30k</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
              </div>
            </div>
            <div className="absolute left-0 bottom-0 w-1/2 h-full bg-linear-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
