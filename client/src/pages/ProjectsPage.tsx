import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
            <SEO
                title="Projects | DevEdge Solutions"
                description="Explore our portfolio of high-performance web applications and enterprise solutions, including DeckMate and Tradeflow."
            />
            <Navigation />

            <main className="pt-20">
                <div className="container py-24 border-b border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-display font-medium mb-6 tracking-tight">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Portfolio.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                            We specialize in building complex, high-performance digital products that drive real business value. From custom 3D visualizers to enterprise SaaS platforms.
                        </p>
                    </motion.div>
                </div>

                <Projects />
            </main>

            <Footer />
        </div>
    );
}
