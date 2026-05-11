import { useRoute, Link } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const serviceData: Record<string, {
    title: string;
    tagline: string;
    description: string;
    keywords: string;
    benefits: string[];
    detail: string;
}> = {
    "custom-development": {
        title: "Custom Development",
        tagline: "Software that fits your business — not the other way around.",
        description: "Tailored software solutions built specifically for your business. From internal tools to customer-facing platforms, we build exactly what you need — no bloat, no compromises.",
        keywords: "custom software development australia, bespoke software, tailored web applications australia",
        benefits: [
            "Enterprise-grade architecture that scales with your growth",
            "Custom third-party API and system integrations",
            "Automated testing pipelines built in from day one",
            "Full source code ownership — no vendor lock-in",
        ],
        detail: "Generic software forces your team to adapt their workflows to fit the tool. We flip that — building software that matches exactly how your business operates, giving you a competitive edge that no off-the-shelf product can replicate.",
    },
    "web-platform": {
        title: "Web Platform",
        tagline: "High-performance platforms your customers will actually use.",
        description: "Custom web platforms and applications built for performance, scalability, and a great user experience. From customer portals to full SaaS products.",
        keywords: "web platform development australia, custom web application, saas development sydney",
        benefits: [
            "Fast, responsive interfaces built with modern frameworks",
            "Scalable cloud infrastructure from day one",
            "Custom user authentication and permission systems",
            "Built-in analytics and reporting dashboards",
        ],
        detail: "Whether you need a client portal, an internal operations platform, or a full SaaS product, we design and build web platforms that are fast, intuitive, and built to grow with your user base.",
    },
    "system-integration": {
        title: "System Integration",
        tagline: "Make your existing tools talk to each other.",
        description: "Connect your existing software systems, databases, and third-party services so data flows automatically and your team stops re-entering the same information twice.",
        keywords: "system integration australia, api integration services, software integration consultant",
        benefits: [
            "Seamless connection between CRMs, ERPs, and custom tools",
            "Real-time data synchronisation across platforms",
            "Custom middleware and API gateway development",
            "Legacy system integration without full replacement",
        ],
        detail: "Most businesses run on 5–15 different software tools that don't talk to each other. We build the connective tissue — APIs, middleware, and automated pipelines — so your data flows where it needs to without manual intervention.",
    },
    "process-automation": {
        title: "Process Automation",
        tagline: "Stop paying people to do what software can do in seconds.",
        description: "Automate repetitive tasks and workflows to increase productivity, reduce errors, and free your team to focus on work that actually matters.",
        keywords: "process automation australia, workflow automation software, business process automation",
        benefits: [
            "Automated data entry and document processing",
            "AI-driven workflow decision making",
            "Scheduled reporting and real-time alert systems",
            "Elimination of manual copy-paste between tools",
        ],
        detail: "If your team spends hours every week copying data between spreadsheets, chasing approvals, or generating the same reports manually — that's time and money left on the table. We build automation that runs in the background so your people don't have to.",
    },
    "cloud-migration": {
        title: "Cloud Migration",
        tagline: "Move to the cloud without the headaches.",
        description: "Seamlessly migrate your existing systems to modern cloud infrastructure. Reduce costs, improve reliability, and scale on demand — without downtime.",
        keywords: "cloud migration australia, aws migration, azure cloud migration, cloud infrastructure services",
        benefits: [
            "Zero-downtime migration planning and execution",
            "AWS, GCP, and Azure optimisation",
            "Cost reduction through right-sizing and managed services",
            "Enhanced security, backup, and disaster recovery",
        ],
        detail: "Legacy on-premise infrastructure is expensive to maintain, difficult to scale, and a growing security risk. We plan and execute cloud migrations that are methodical, low-risk, and optimised to actually reduce your infrastructure costs.",
    },
    "mobile-apps": {
        title: "Mobile Applications",
        tagline: "Apps your customers will actually open.",
        description: "Native and cross-platform mobile applications for iOS and Android. Built for performance and UX — so your customers engage with it and keep coming back.",
        keywords: "mobile app development australia, ios android app development, react native development sydney",
        benefits: [
            "Intuitive UI/UX designed around your real users",
            "Cross-platform (iOS & Android) from a single codebase",
            "Offline functionality and push notifications",
            "App Store and Google Play submission handled for you",
        ],
        detail: "A mobile app is only valuable if people actually use it. We build apps with performance and user experience as first principles — not just shipping something to the App Store — so your customers engage with it and keep coming back.",
    },
};

// ── Background decorations (matching Slide01Hero exactly) ─────────────────────
function BgDecorations() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Ember glow pools */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#C97B3A]/5 blur-[160px] rounded-full" />
            <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[180px] rounded-full" />
            {/* 3D perspective grid floor */}
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
            {/* Horizon fade */}
            <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-background via-background/95 to-transparent" />
        </div>
    );
}

export default function ServicePage() {
    const [match, params] = useRoute("/services/:slug");

    if (!match || !params || !serviceData[params.slug]) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <p className="font-mono text-[11px] text-muted-foreground tracking-[0.18em] uppercase">Service not found</p>
                <Link href="/" className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase hover:text-primary/80 transition-colors">
                    Return Home
                </Link>
            </div>
        );
    }

    const service = serviceData[params.slug];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={`${service.title} | DevEdge`}
                description={service.description}
                keywords={service.keywords}
                url={`https://devedge.com.au/services/${params.slug}`}
            />
            <Navigation />

            {/* ── Hero section ───────────────────────────────────── */}
            <section className="relative bg-background overflow-hidden pt-32 pb-20 min-h-[65vh] flex items-end">
                <BgDecorations />

                <div className="container relative z-10">
                    {/* Back link */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="mb-10"
                    >
                        <Link
                            href="/"
                            className="font-mono text-[11px] text-muted-foreground tracking-[0.18em] uppercase inline-flex items-center gap-3 hover:text-primary transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </motion.div>

                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05, ease }}
                    >
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            Service
                        </span>
                    </motion.div>

                    {/* Giant heading */}
                    <motion.h1
                        className="mt-6 font-display font-black text-foreground leading-[0.88] tracking-tight"
                        style={{ fontSize: "clamp(56px, 8vw, 100px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease }}
                    >
                        {service.title}
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        className="mt-6 text-muted-foreground text-[18px] leading-relaxed max-w-[500px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.18, ease }}
                    >
                        {service.tagline}
                    </motion.p>
                </div>
            </section>

            {/* ── Content section ────────────────────────────────── */}
            <section className="relative bg-background overflow-hidden">
                <div className="container py-20">
                    <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-start">

                        {/* LEFT col */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, ease }}
                        >
                            {/* Detail paragraph */}
                            <p className="text-muted-foreground text-[17px] leading-relaxed mb-12">
                                {service.detail}
                            </p>

                            {/* "What we deliver" eyebrow */}
                            <div className="mb-6">
                                <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                                    <span className="w-8 h-px bg-primary inline-block" />
                                    What we deliver
                                </span>
                            </div>

                            {/* Benefits list */}
                            <div className="mb-12 border-t border-[#D4B896]">
                                {service.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-[#D4B896]">
                                        <span className="w-px h-4 bg-primary shrink-0" />
                                        <span className="text-foreground text-[15px] leading-relaxed">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <ContactModal
                                buttonText="Discuss Your Project"
                                triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                            />
                        </motion.div>

                        {/* RIGHT col */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.15, ease }}
                            className="flex flex-col gap-8"
                        >
                            {/* Stat grid */}
                            <div className="grid grid-cols-2 gap-px bg-[#2E1F0F]">
                                <div className="bg-background p-8 flex flex-col gap-2">
                                    <span className="font-display font-black text-primary leading-none" style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>
                                        80+
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Projects delivered</span>
                                </div>
                                <div className="bg-background p-8 flex flex-col gap-2">
                                    <span className="font-display font-black text-primary leading-none" style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>
                                        3+
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Years in market</span>
                                </div>
                                <div className="bg-background p-8 flex flex-col gap-2">
                                    <span className="font-display font-black text-primary leading-none" style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>
                                        98%
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Client satisfaction</span>
                                </div>
                                <div className="bg-background p-8 flex flex-col gap-2">
                                    <span className="font-display font-black text-primary leading-none" style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>
                                        2wk
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Avg. delivery start</span>
                                </div>
                            </div>

                            {/* Highlighted callout card */}
                            <div className="bg-[#EDD9C0] border-l-2 border-[#C97B3A] p-8">
                                <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-4">
                                    <span className="w-8 h-px bg-primary inline-block" />
                                    Why DevEdge
                                </span>
                                <p className="font-display font-black text-foreground text-2xl leading-tight mb-4">
                                    Small team.<br />Big accountability.
                                </p>
                                <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                                    You won't be handed off to a junior team after signing. The same people you talk to are the ones building your product.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Direct communication — no account managers",
                                        "Transparent progress, every step",
                                        "First consultation is always free",
                                    ].map((point) => (
                                        <li key={point} className="flex items-center gap-3">
                                            <span className="w-px h-4 bg-primary shrink-0" />
                                            <span className="font-mono text-[11px] text-muted-foreground tracking-widest">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Dark CTA section ───────────────────────────────── */}
            <section className="relative bg-[#1A1008] overflow-hidden py-24">
                {/* Subtle ember glow on dark */}
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
                            Got a complex problem? Good.
                        </span>
                        <h2
                            className="font-display font-black text-[#F5E6D5] leading-[0.88] tracking-tight mb-6"
                            style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
                        >
                            That's where we do<br />our best work.
                        </h2>
                        <p className="text-[#A89070] text-[17px] leading-relaxed mb-10 max-w-md mx-auto">
                            First conversation is always free. No pitch, no pressure — just an honest look at what you need.
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
                                See how we work →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer strip ───────────────────────────────────── */}
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
