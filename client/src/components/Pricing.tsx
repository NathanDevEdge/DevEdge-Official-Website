import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black/40 border-y border-white/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[06 Pricing]</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Flexible plans. Serious impact. <span className="text-white">We are here for you.</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            *Prices listed are estimates based on typical project scopes. For a precise quote, please contact us.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Subscription Plan */}
          <div className="bg-card/20 border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col hover:border-primary/30 transition-colors relative overflow-hidden">
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold mb-2">Subscription</h3>
              <p className="text-muted-foreground text-sm">Ideal for brands that need regular creative, design, or dev work.</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$750</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 grow">
              <div className="text-sm font-medium text-white mb-2">What's Included</div>
              {[
                "Set number of hours per month",
                "Priority turnaround",
                "Flexible scope (design, dev, SEO)",
                "Direct access to your creative team",
                "Monthly planning & check-ins"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <Button className="w-full rounded-full bg-white text-black hover:bg-white/90 font-bold h-12">
              Start Monthly Plan
            </Button>
          </div>

          {/* Per Project Plan */}
          <div className="bg-card/20 border border-primary/50 rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden shadow-[0_0_50px_-20px_var(--color-primary)]">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
              Popular Choice
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold mb-2">Per Project</h3>
              <p className="text-muted-foreground text-sm">Perfect for brands that need a full-service launch, a one-off redesign, or a focused creative sprint.</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-4xl font-bold text-white ml-2">$300</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 grow">
              <div className="text-sm font-medium text-white mb-2">What's Included</div>
              {[
                "Fixed scope, timeline & deliverables",
                "One-time fee based on scope",
                "Full focus on a single goal",
                "Dedicated team for your project",
                "Clear milestones & approvals"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-[0_0_20px_-5px_var(--color-primary)]">
              Get a Custom Quote
            </Button>
          </div>
        </div>

        {/* Popular Services List */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-display font-bold mb-6 text-center">Popular Services</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Full Website", price: "from A$2250" },
              { name: "System Developments", price: "from A$1800" },
              { name: "App Development", price: "from A$3750" },
              { name: "Cloud Migrations", price: "from $1200" }
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card/30 border border-white/5 hover:border-white/10 transition-colors">
                <span className="font-medium text-white">{service.name}</span>
                <span className="text-primary font-mono text-sm">{service.price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8">
            We'll tailor the quote to your timeline, goals, and budget.
          </p>
        </div>
      </div>
    </section>
  );
}
