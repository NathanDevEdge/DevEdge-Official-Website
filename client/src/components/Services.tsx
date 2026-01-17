import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "01",
    title: "Custom Development",
    description: "Tailored software solutions built to meet your specific business requirements and scale with your growth.",
    image: "/images/service-custom-dev.jpg",
    color: "text-blue-400",
    borderColor: "group-hover:border-blue-500/50",
    glowColor: "group-hover:shadow-blue-500/20"
  },
  {
    id: "02",
    title: "Mobile Applications",
    description: "Native and cross-platform mobile apps that engage your customers and streamline your operations.",
    image: "/images/service-mobile.jpg",
    color: "text-purple-400",
    borderColor: "group-hover:border-purple-500/50",
    glowColor: "group-hover:shadow-purple-500/20"
  },
  {
    id: "03",
    title: "Cloud Migration",
    description: "Seamlessly transition to cloud infrastructure for improved scalability and cost efficiency.",
    image: "/images/service-cloud.jpg",
    color: "text-cyan-400",
    borderColor: "group-hover:border-cyan-500/50",
    glowColor: "group-hover:shadow-cyan-500/20"
  },
  {
    id: "04",
    title: "Process Automation",
    description: "Automate repetitive tasks and workflows to increase productivity and reduce operational costs.",
    image: "/images/service-automation.jpg",
    color: "text-green-400",
    borderColor: "group-hover:border-green-500/50",
    glowColor: "group-hover:shadow-green-500/20"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[01 Services]</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Not just services - we deliver <span className="text-white">growth, clarity, and real impact.</span>
            </h2>
          </div>
          <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/5">
            View All Services
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`group relative bg-card/30 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${service.borderColor} ${service.glowColor}`}
            >
              <div className="mb-6 relative h-48 w-full overflow-hidden rounded-xl bg-black/20">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 font-mono text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white/70">
                  {service.id}
                </div>
              </div>
              
              <h3 className={`text-xl font-display font-bold mb-3 ${service.color}`}>
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              
              <div className="flex items-center text-sm font-medium text-white group-hover:text-primary transition-colors cursor-pointer">
                Learn more <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 rounded-3xl bg-linear-to-r from-primary/20 to-purple-500/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-2">Ready to Start?</h3>
            <p className="text-muted-foreground">Let's turn your vision into reality today.</p>
          </div>
          <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-8">
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
}
