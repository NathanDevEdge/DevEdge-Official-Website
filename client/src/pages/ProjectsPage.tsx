import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import projects from "@/data/projects.json";

const ease = [0.16, 1, 0.3, 1] as const;

function BgDecorations() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#C97B3A]/5 blur-[160px] rounded-full" />
            <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[180px] rounded-full" />
            <div className="absolute left-0 right-0 bottom-0" style={{ height: "60%", perspective: "700px" }}>
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(to right, rgba(46,31,15,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.25) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    transform: "rotateX(62deg)",
                    transformOrigin: "50% 100%",
                    maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, transparent 65%)",
                }} />
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(to right, rgba(201,123,58,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,123,58,0.2) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    transform: "rotateX(62deg)",
                    transformOrigin: "50% 100%",
                    maskImage: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 80%)",
                }} />
            </div>
            <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-background via-background/95 to-transparent" />
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SEO
                title="Projects | DevEdge"
                description="Real projects. Real outcomes. See how DevEdge has helped Australian businesses build custom software, platforms, and automation that actually works."
                url="https://devedge.com.au/projects"
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-20 min-h-[55vh] flex items-end">
                <BgDecorations />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            Selected Work
                        </span>
                    </motion.div>
                    <motion.h1
                        className="mt-6 font-display font-black text-foreground leading-[0.88] tracking-tight"
                        style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        Work that does<br />what it's supposed to.
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-muted-foreground text-[17px] leading-relaxed max-w-[520px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.16, ease }}
                    >
                        Every project starts with a real problem. These are the outcomes.
                    </motion.p>
                </div>
            </section>

            {/* Projects */}
            <section className="bg-background">
                <div className="container py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.3, ease }}
                        className="border-t border-[#D4B896] space-y-0"
                    >
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className={`border-b border-[#D4B896] py-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
                            >
                                {/* Screenshot */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.3, ease }}
                                    className="relative overflow-hidden border border-[#D4B896] group"
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                    {/* Ember tint on hover */}
                                    <div className="absolute inset-0 bg-[#C97B3A]/0 group-hover:bg-[#C97B3A]/5 transition-colors duration-300" />
                                </motion.div>

                                {/* Case study content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.3, delay: 0.08, ease }}
                                    className="flex flex-col justify-center"
                                >
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="font-mono text-[9px] bg-primary text-[#1A1008] px-2 py-0.5 tracking-widest uppercase"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Project name */}
                                    <h2
                                        className="font-display font-black text-foreground leading-[0.9] tracking-tight mb-6"
                                        style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
                                    >
                                        {project.title}
                                    </h2>

                                    {/* Case study rows */}
                                    <div className="border-t border-[#D4B896] mb-8">
                                        <div className="grid grid-cols-[100px_1fr] py-4 border-b border-[#D4B896] gap-4">
                                            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase pt-0.5">Project</span>
                                            <span className="text-foreground text-[15px] leading-snug">{project.description}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] py-4 border-b border-[#D4B896] gap-4">
                                            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase pt-0.5">What we built</span>
                                            <ul className="space-y-2">
                                                {project.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[15px] text-foreground leading-snug">
                                                        <span className="w-px h-4 bg-primary shrink-0 mt-1" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* View live link */}
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 font-mono text-[11px] text-primary tracking-[0.18em] uppercase group w-fit hover:gap-4 transition-all duration-150"
                                    >
                                        <span className="w-8 h-px bg-primary inline-block" />
                                        View live site
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Dark CTA */}
            <section className="relative bg-[#1A1008] overflow-hidden py-24">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C97B3A]/8 blur-[120px] rounded-full" />
                </div>
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.3, ease }}
                    >
                        <span className="font-mono text-[11px] text-[#C97B3A] tracking-[0.18em] uppercase inline-flex items-center gap-3 justify-center mb-6">
                            <span className="w-8 h-px bg-[#C97B3A] inline-block" />
                            Your project is next.
                        </span>
                        <h2
                            className="font-display font-black text-[#F5E6D5] leading-[0.88] tracking-tight mb-6"
                            style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
                        >
                            Let's build something<br />worth showing off.
                        </h2>
                        <p className="text-[#A89070] text-[17px] leading-relaxed mb-10 max-w-md mx-auto">
                            First conversation is always free. No pitch, no pressure.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <ContactModal
                                buttonText="Start a Project"
                                triggerClassName="bg-[#C97B3A] text-[#1A1008] hover:bg-[#b8692e] font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                            />
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-8 h-12 border border-[#2E1F0F] hover:border-[#C97B3A] text-[#A89070] hover:text-[#C97B3A] text-[15px] font-medium transition-colors duration-150"
                            >
                                Back to home →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1A1008] border-t border-[#2E1F0F] py-8">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Link href="/" className="font-display font-black text-[#F5E6D5] text-lg tracking-tight">
                        DevEdge
                    </Link>
                    <p className="font-mono text-[11px] text-[#664422] tracking-wider">
                        © 2026 DevEdge. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
