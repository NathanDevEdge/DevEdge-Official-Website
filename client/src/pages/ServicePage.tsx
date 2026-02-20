import { useRoute } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

// Data mapping for our services content
const serviceData: Record<string, any> = {
    "custom-development": {
        title: "Custom Development",
        description: "Tailored software solutions built to meet your specific business requirements and scale with your growth.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
        color: "from-blue-500",
        benefits: [
            "Enterprise-grade architecture",
            "Highly scalable infrastructure",
            "Custom third-party integrations",
            "Automated testing pipelines"
        ]
    },
    "mobile-apps": {
        title: "Mobile Applications",
        description: "Native and cross-platform mobile apps that engage your customers and streamline your operations.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
        color: "from-purple-500",
        benefits: [
            "Intuitive UI/UX design",
            "Cross-platform compatibility (React Native/Flutter)",
            "Offline functionality",
            "App Store & Google Play deployment"
        ]
    },
    "cloud-migration": {
        title: "Cloud Migration",
        description: "Seamlessly transition to cloud infrastructure for improved scalability and cost efficiency.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
        color: "from-cyan-500",
        benefits: [
            "Zero-downtime migrations",
            "AWS/GCP/Azure optimization",
            "Cost reduction strategies",
            "Enhanced security & compliance"
        ]
    },
    "process-automation": {
        title: "Process Automation",
        description: "Automate repetitive tasks and workflows to increase productivity and reduce operational costs.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
        color: "from-green-500",
        benefits: [
            "AI-driven workflows",
            "API data synchronization",
            "Elimination of manual entry",
            "Real-time analytics & reporting"
        ]
    }
};

export default function ServicePage() {
    const [match, params] = useRoute("/services/:slug");

    if (!match || !params || !serviceData[params.slug]) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <h2>Service not found</h2>
                <Link href="/">Return Home</Link>
            </div>
        );
    }

    const service = serviceData[params.slug];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white pb-20">
            <SEO
                title={`${service.title} | DevEdge Solutions`}
                description={service.description}
                image={service.image}
            />
            <Navigation />

            <main className="pt-32">
                <div className="container max-w-6xl">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors mb-12">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6">
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${service.color} to-white`}>
                                    {service.title}
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground font-light leading-relaxed mb-10">
                                {service.description}
                            </p>

                            <div className="space-y-6 mb-12">
                                <h3 className="text-xl font-display font-medium text-white/90">What we deliver:</h3>
                                <ul className="space-y-4">
                                    {service.benefits.map((benefit: string, i: number) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-center text-lg text-white/80"
                                        >
                                            <CheckCircle2 className="w-6 h-6 mr-4 text-primary shrink-0" />
                                            {benefit}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            <ContactModal
                                buttonText="Discuss Your Project"
                                triggerClassName="rounded-full bg-white text-black hover:bg-white/90 font-medium px-8 h-14 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl h-[600px]"
                        >
                            <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-10"></div>
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
