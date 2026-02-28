import { motion } from "framer-motion";
import projects from "@/data/projects.json";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Projects() {
    return (
        <section id="projects" className="py-32 relative overflow-hidden bg-background">
            <div className="container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block inline-flex items-center gap-2">
                            <span className="w-8 h-px bg-primary"></span> 02 Selected Projects <span className="w-8 h-px bg-primary"></span>
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 leading-tight">
                            Bridging the gap between <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">idea and execution.</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="space-y-32">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                                } gap-12 lg:gap-20 items-center`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-3/5 group relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="bg-background/20 backdrop-blur-md border-white/20 hover:bg-primary hover:text-white"
                                        >
                                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                View Live Site <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-2/5 space-y-8">
                                <div className="flex flex-wrap gap-3">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-white/60"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div>
                                    <h3 className="text-3xl lg:text-4xl font-display font-medium mb-4 text-white">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                        {project.description}
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {project.features.map((feature, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-white/80 font-light">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-4">
                                    <Button
                                        asChild
                                        className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium group"
                                    >
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            Explore Project <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1/2 bg-primary/5 blur-[120px] pointer-events-none -z-10 rounded-full"></div>
        </section>
    );
}
