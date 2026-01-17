import { Search, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "Deep understanding of your business, forming the foundation for an impactful strategy.",
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    number: "02",
    title: "Design",
    description: "Crafting innovative concepts and user-focused designs that effectively speak to your audience.",
    icon: PenTool,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    number: "03",
    title: "Development",
    description: "Turning ideas into projects, built with precision, delivered on time, and fully optimized for results.",
    icon: Code2,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10"
  },
  {
    number: "04",
    title: "Launch",
    description: "Deploying your project, monitoring performance, and refining strategies for ongoing success.",
    icon: Rocket,
    color: "text-green-400",
    bg: "bg-green-500/10"
  }
];

export default function Workflow() {
  return (
    <section className="py-24 relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[03 Workflow]</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            No guesswork, just a clear path from <span className="text-gradient">ideas → results.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={step.number} className="group">
                <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 mx-auto border border-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/50`}>
                  <step.icon className="w-8 h-8" />
                </div>
                
                <div className="text-center bg-card/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-card/80 transition-colors">
                  <div className="font-mono text-sm text-muted-foreground mb-2">{step.number}</div>
                  <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
