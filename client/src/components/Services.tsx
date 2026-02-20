import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";
import { Link } from "wouter";

const services = [
  {
    id: "01",
    title: "Custom Development",
    description: "Tailored software solutions built to meet your specific business requirements and scale with your growth.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    color: "text-blue-400",
    borderColor: "group-hover:border-blue-500/50",
    glowColor: "group-hover:shadow-[0_0_30px_-5px_var(--color-blue-500)]",
    slug: "custom-development"
  },
  {
    id: "02",
    title: "Mobile Applications",
    description: "Native and cross-platform mobile apps that engage your customers and streamline your operations.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    color: "text-purple-400",
    borderColor: "group-hover:border-purple-500/50",
    glowColor: "group-hover:shadow-[0_0_30px_-5px_var(--color-purple-500)]",
    slug: "mobile-apps"
  },
  {
    id: "03",
    title: "Cloud Migration",
    description: "Seamlessly transition to cloud infrastructure for improved scalability and cost efficiency.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    color: "text-cyan-400",
    borderColor: "group-hover:border-cyan-500/50",
    glowColor: "group-hover:shadow-[0_0_30px_-5px_var(--color-cyan-500)]",
    slug: "cloud-migration"
  },
  {
    id: "04",
    title: "Process Automation",
    description: "Automate repetitive tasks and workflows to increase productivity and reduce operational costs.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    color: "text-green-400",
    borderColor: "group-hover:border-green-500/50",
    glowColor: "group-hover:shadow-[0_0_30px_-5px_var(--color-green-500)]",
    slug: "process-automation"
  }
];

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const }
    }
  };

  return (
    <section id="services" className="py-32 relative overflow-hidden bg-background">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full point-events-none -z-10"></div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block inline-flex items-center gap-2">
              <span className="w-8 h-px bg-primary"></span> 01 Services
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight">
              Not just services - we deliver <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">growth, clarity, and real impact.</span>
            </h2>
          </div>
          <Button variant="outline" className="rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors h-12 px-6">
            View All Services
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10 }}
              key={service.id}
              className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 ${service.borderColor} ${service.glowColor}`}
            >
              <div className="mb-8 relative h-56 w-full overflow-hidden rounded-2xl bg-black/40">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 font-mono text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white tracking-widest border border-white/10">
                  {service.id}
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              </div>

              <h3 className={`text-2xl font-display font-medium mb-4 ${service.color}`}>
                {service.title}
              </h3>

              <p className="text-muted-foreground text-base leading-relaxed mb-8 font-light">
                {service.description}
              </p>

              <Link href={`/services/${service.slug}`}>
                <div className="absolute bottom-6 left-6 flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors cursor-pointer">
                  Explore solution <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 p-10 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-display font-medium mb-3 text-white">Ready to Architect the Future?</h3>
            <p className="text-muted-foreground text-lg">Let's turn your complex vision into a seamless digital reality.</p>
          </div>
          <ContactModal
            buttonText="Start the Conversation"
            triggerClassName="relative z-10 rounded-full bg-white text-black hover:bg-white/90 font-medium px-8 h-14 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
