import { useRoute, Link } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// ── Code block visuals (replaces stock photography) ───────────────────────────
type CodeToken = { t: string; c: string };
type CodeLine = { tokens: CodeToken[] };

interface CodeBlockProps {
    filename: string;
    lines: CodeLine[];
    className?: string;
}

function CodeBlock({ filename, lines, className = "" }: CodeBlockProps) {
    return (
        <div className={`w-full border border-[#2E1F0F] bg-[#1A1008] overflow-hidden ${className}`}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2E1F0F]">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-auto font-mono text-[11px] text-[#664422] tracking-widest">{filename}</span>
            </div>
            {/* Code */}
            <div className="px-6 py-5 font-mono text-[13px] leading-[1.8]">
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-5">
                        <span className="w-4 shrink-0 text-right text-[#332010] select-none text-xs pt-px">
                            {line.tokens.length > 0 ? i + 1 : ""}
                        </span>
                        <span>
                            {line.tokens.map((token, j) => (
                                <span key={j} style={{ color: token.c }}>{token.t}</span>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Code snippet per article — on-brand, topic-relevant
const articleCode: Record<string, { filename: string; lines: CodeLine[] }> = {
    "custom-vs-off-the-shelf-software": {
        filename: "evaluate.ts",
        lines: [
            { tokens: [{ t: "// Should you build custom?", c: "#664422" }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "offTheShelf", c: "#F5E6D5" }, { t: " = {", c: "#A89070" }] },
            { tokens: [{ t: "  cost:        ", c: "#A89070" }, { t: '"$50/user/mo"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  ownership:   ", c: "#A89070" }, { t: "false", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  flexibility: ", c: "#A89070" }, { t: '"their way"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "};", c: "#A89070" }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "custom", c: "#F5E6D5" }, { t: " = {", c: "#A89070" }] },
            { tokens: [{ t: "  cost:        ", c: "#A89070" }, { t: '"once"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  ownership:   ", c: "#A89070" }, { t: "true", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  flexibility: ", c: "#A89070" }, { t: '"your way"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  payback:     ", c: "#A89070" }, { t: '"~18 months"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "};", c: "#A89070" }] },
        ],
    },
    "healthcare-custom-software-australia": {
        filename: "health-config.ts",
        lines: [
            { tokens: [{ t: "// Australian healthcare compliance layer", c: "#664422" }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "config", c: "#F5E6D5" }, { t: ": HealthcareConfig = {", c: "#A89070" }] },
            { tokens: [{ t: "  standard:     ", c: "#A89070" }, { t: '"Australian Privacy Principles"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  myHealthRecord:", c: "#A89070" }, { t: " true", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  encryption:   ", c: "#A89070" }, { t: '"AES-256"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  auditTrail:   ", c: "#A89070" }, { t: "true", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  dataResidency:", c: "#A89070" }, { t: ' "AU"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "};", c: "#A89070" }] },
            { tokens: [] },
            { tokens: [{ t: "export async function ", c: "#C97B3A" }, { t: "processRecord", c: "#F5E6D5" }, { t: "(patient: Patient) {", c: "#A89070" }] },
            { tokens: [{ t: "  await ", c: "#C97B3A" }, { t: "validate", c: "#F5E6D5" }, { t: "(patient, config);", c: "#A89070" }] },
            { tokens: [{ t: "  return ", c: "#C97B3A" }, { t: "store", c: "#F5E6D5" }, { t: "(patient); ", c: "#A89070" }, { t: "// compliant.", c: "#664422" }] },
            { tokens: [{ t: "}", c: "#A89070" }] },
        ],
    },
    "custom-mobile-app-cost-sydney": {
        filename: "estimate.ts",
        lines: [
            { tokens: [{ t: "// Project cost calculator", c: "#664422" }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "estimate", c: "#F5E6D5" }, { t: " = {", c: "#A89070" }] },
            { tokens: [{ t: "  tier:      ", c: "#A89070" }, { t: '"Medium Complexity"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  platforms: ", c: "#A89070" }, { t: '["iOS", "Android"]', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  features:  ", c: "#A89070" }, { t: '["Auth", "API", "Push"]', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  timeline:  ", c: "#A89070" }, { t: '"12–16 weeks"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  range:     ", c: "#A89070" }, { t: '"$50k – $120k"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "};", c: "#A89070" }] },
            { tokens: [] },
            { tokens: [{ t: "// Hidden costs to budget for:", c: "#664422" }] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "annual", c: "#F5E6D5" }, { t: " = estimate.range * ", c: "#A89070" }, { t: "0.15", c: "#C97B3A" }, { t: ";", c: "#A89070" }] },
            { tokens: [{ t: "// → hosting, maintenance, updates", c: "#664422" }] },
        ],
    },
    "legacy-system-modernization-cloud": {
        filename: "migrate.ts",
        lines: [
            { tokens: [{ t: "// Strangler Fig migration pattern", c: "#664422" }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "migration", c: "#F5E6D5" }, { t: " = {", c: "#A89070" }] },
            { tokens: [{ t: "  pattern:  ", c: "#A89070" }, { t: '"Strangler Fig"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  downtime: ", c: "#A89070" }, { t: "0", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  steps: [", c: "#A89070" }] },
            { tokens: [{ t: '    "Audit legacy system"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "Extract bounded contexts"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "Deploy cloud microservices"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "Route traffic gradually"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "Retire legacy — zero drama"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  ],", c: "#A89070" }] },
            { tokens: [{ t: "};", c: "#A89070" }] },
        ],
    },
    "automated-workflow-software-logistics": {
        filename: "dispatch.ts",
        lines: [
            { tokens: [{ t: "// Fully automated dispatch pipeline", c: "#664422" }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: "#C97B3A" }, { t: "workflow", c: "#F5E6D5" }, { t: " = {", c: "#A89070" }] },
            { tokens: [{ t: "  trigger:     ", c: "#A89070" }, { t: '"POD_CAPTURED"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  manualSteps: ", c: "#A89070" }, { t: "0", c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  steps: [", c: "#A89070" }] },
            { tokens: [{ t: '    "validate_delivery"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "generate_invoice"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "email_client"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: '    "sync_to_wms"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "  ],", c: "#A89070" }] },
            { tokens: [{ t: "  timePerOrder: ", c: "#A89070" }, { t: '"<200ms"', c: "#C97B3A" }, { t: ",", c: "#A89070" }] },
            { tokens: [{ t: "};", c: "#A89070" }] },
        ],
    },
};

// ── Blog data ─────────────────────────────────────────────────────────────────
const blogData: Record<string, {
    title: string;
    excerpt: string;
    date: string;
    isoDate: string;
    readTime: string;
    author: string;
    content: React.ReactNode;
}> = {
    "custom-vs-off-the-shelf-software": {
        title: "Custom vs. Off-The-Shelf Software: When to Build Your Own",
        excerpt: "Are you forcing your business to fit a generic SaaS tool? Here's when it makes financial sense to build your own software.",
        date: "May 5, 2026",
        isoDate: "2026-05-05",
        readTime: "7 min read",
        author: "DevEdge Strategy Team",
        content: (
            <>
                <h2>The SaaS Trap</h2>
                <p>Off-the-shelf Software as a Service (SaaS) is fantastic for non-core tasks like email or basic accounting. But when it comes to the lifeblood of your operations, generic tools force you into generic workflows — and generic workflows rarely create competitive advantage.</p>
                <h2>When to Choose Off-The-Shelf</h2>
                <p>If your processes are standard across your industry and your budget is under $20k, off-the-shelf is usually the right call. It's fast to deploy and requires no internal technical management.</p>
                <h2>When to Build Custom</h2>
                <p><strong>1. Competitive advantage:</strong> If your software is how you beat competitors, you cannot afford to use the exact same tool they do.</p>
                <p><strong>2. Subscription fatigue:</strong> $50 per user per month for 500 employees is $300,000 every single year. A custom build often pays for itself within 18 months in saved licensing fees alone.</p>
                <p><strong>3. Complete ownership:</strong> Custom software is an asset on your books. It increases the valuation of your company, whereas SaaS subscriptions are purely operational expenses.</p>
                <blockquote>"The best software investment is the one that fits exactly how you operate — not the one that ships fastest."</blockquote>
                <h2>The DevEdge Approach</h2>
                <p>We always start with an honest conversation about whether you actually need a custom build. If off-the-shelf covers it, we'll tell you. If it doesn't, we'll show you exactly what the custom path looks like — scope, timeline, and cost — before you commit to anything.</p>
            </>
        ),
    },
    "healthcare-custom-software-australia": {
        title: "Custom Software Development for Healthcare in Australia",
        excerpt: "Why off-the-shelf solutions fall short for Australian healthcare providers, and how custom software ensures privacy compliance while improving patient outcomes.",
        date: "Apr 20, 2026",
        isoDate: "2026-04-20",
        readTime: "6 min read",
        author: "DevEdge Engineering Team",
        content: (
            <>
                <h2>The State of Healthcare Tech in Australia</h2>
                <p>The Australian healthcare system demands a rigorous level of security, data privacy, and interoperability that generic software simply cannot provide. From managing sensitive patient records to ensuring seamless communication between specialists and GPs, the technology stack must be robust.</p>
                <h2>Why Custom Development?</h2>
                <p><strong>1. Total compliance:</strong> Custom software is built from the ground up to comply with the Australian Privacy Principles (APPs) and the My Health Record system requirements.</p>
                <p><strong>2. Integration capabilities:</strong> Legacy systems in hospitals often struggle to communicate. Custom middleware and APIs can bridge these gaps without costly total system replacements.</p>
                <p><strong>3. Scalability:</strong> As your practice grows, off-the-shelf software often requires expensive tier upgrades. Custom software grows with you, on your terms.</p>
                <blockquote>"Investing in custom digital infrastructure isn't just an IT upgrade — it's a direct investment in patient care and operational efficiency."</blockquote>
            </>
        ),
    },
    "custom-mobile-app-cost-sydney": {
        title: "How Much Does a Custom Mobile App Cost in Australia?",
        excerpt: "A transparent breakdown of mobile app development costs in 2026, from MVP to enterprise-grade solutions.",
        date: "Apr 18, 2026",
        isoDate: "2026-04-18",
        readTime: "8 min read",
        author: "DevEdge Strategy Team",
        content: (
            <>
                <h2>The Real Cost of App Development</h2>
                <p>If you're looking for a top-tier software agency in Australia, you've likely seen quotes ranging from $20,000 to over $500,000. Why the massive gap?</p>
                <h2>Breakdown by App Complexity</h2>
                <ul>
                    <li><strong>Simple MVP ($20k–$50k):</strong> Basic UI, single platform, limited backend logic. Great for testing a concept.</li>
                    <li><strong>Medium complexity ($50k–$120k):</strong> Custom UI/UX, cross-platform (React Native/Flutter), API integrations, user accounts, and a scalable backend.</li>
                    <li><strong>Enterprise grade ($150k+):</strong> Complex logic, high-level security, real-time data sync, machine learning integrations, and extensive administrative panels.</li>
                </ul>
                <h2>Hidden Costs to Consider</h2>
                <p>Don't forget ongoing costs. Server hosting (AWS/GCP), App Store developer fees, continuous bug fixes, and feature updates typically run 15–20% of the initial development cost annually.</p>
                <h2>How to Get an Accurate Quote</h2>
                <p>The clearest way to get a reliable number is to define your MVP scope — the minimum feature set that would be valuable to your first users. A good agency will scope to that, not to an imaginary perfect product.</p>
            </>
        ),
    },
    "legacy-system-modernization-cloud": {
        title: "Legacy System Modernisation to Cloud: Best Practices",
        excerpt: "A practical guide to migrating aging enterprise systems into scalable, resilient cloud-native architecture — without the downtime.",
        date: "Apr 15, 2026",
        isoDate: "2026-04-15",
        readTime: "10 min read",
        author: "DevEdge Cloud Architecture",
        content: (
            <>
                <h2>The Hidden Risk of Doing Nothing</h2>
                <p>Maintaining legacy on-premise servers is increasingly expensive and poses growing security risks. Modernising isn't just about faster code — it's about business continuity.</p>
                <h2>The 5 'R's of Cloud Migration</h2>
                <p><strong>1. Rehost (Lift and Shift):</strong> Moving the exact same infrastructure from on-prem to AWS/Azure. Quickest, but least optimised.</p>
                <p><strong>2. Refactor:</strong> Tweaking the codebase to utilise PaaS (Platform as a Service) features.</p>
                <p><strong>3. Rearchitect:</strong> Breaking down a monolithic application into microservices for ultimate scalability.</p>
                <p><strong>4. Rebuild:</strong> Rewriting the application from scratch using modern frameworks.</p>
                <p><strong>5. Replace:</strong> Dropping the custom software for a SaaS solution — rarely works for core business logic.</p>
                <h2>Our Recommended Approach</h2>
                <p>For most mid-to-large enterprises, an incremental "Strangler Fig" pattern works best. We slowly replace pieces of the legacy system with cloud services until the old monolith can be safely retired with zero downtime.</p>
            </>
        ),
    },
    "automated-workflow-software-logistics": {
        title: "Automated Workflow Software for Logistics Companies",
        excerpt: "How custom automation is saving Australian supply chain and logistics companies thousands of hours in manual data entry.",
        date: "Apr 10, 2026",
        isoDate: "2026-04-10",
        readTime: "5 min read",
        author: "DevEdge Automation Team",
        content: (
            <>
                <h2>The Spreadsheets Must Go</h2>
                <p>If your dispatch team is still copy-pasting tracking numbers between three different portals, you are losing money every minute.</p>
                <h2>High-Impact Automation Use Cases</h2>
                <ul>
                    <li><strong>Automated dispatch &amp; routing:</strong> Software that calculates the most efficient delivery routes based on real-time traffic and vehicle capacity.</li>
                    <li><strong>API integrations:</strong> Connecting your warehouse management system directly to your carriers (FedEx, Toll, AusPost) so tracking is entirely hands-off.</li>
                    <li><strong>Invoice generation:</strong> Automatically generating and emailing invoices the second a Proof of Delivery is captured via a driver's mobile app.</li>
                </ul>
                <h2>The ROI of Custom Logistics Tech</h2>
                <p>Off-the-shelf logistics software often forces you to change your operations to match the software. Custom automation curves to fit exactly how your warehouse actually runs — and the ROI is usually measurable within the first quarter.</p>
            </>
        ),
    },
};

// ── Shared components ─────────────────────────────────────────────────────────
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

function FooterStrip() {
    return (
        <footer className="border-t border-[#D4B896] py-8">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link href="/" className="font-display font-black text-foreground text-lg tracking-tight">
                    DevEdge
                </Link>
                <p className="font-mono text-[11px] text-muted-foreground tracking-wider">
                    © 2026 DevEdge. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

// ── Blog Index ────────────────────────────────────────────────────────────────
function BlogIndex() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Blog — Software Insights & Strategy | DevEdge"
                description="Practical articles on custom software development, cloud migration, process automation, and building digital products for Australian businesses."
                url="https://devedge.com.au/blog"
                type="website"
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-16 min-h-[50vh] flex items-end">
                <BgDecorations />
                <div className="container relative z-10">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            DevEdge Blog
                        </span>
                    </motion.div>
                    <motion.h1
                        className="mt-6 font-display font-black text-foreground leading-[0.88] tracking-tight"
                        style={{ fontSize: "clamp(52px, 7vw, 90px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        Engineering insights.
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-muted-foreground text-[17px] leading-relaxed max-w-[560px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.16, ease }}
                    >
                        Practical articles on custom software, cloud migration, and building digital products that actually work.
                    </motion.p>
                </div>
            </section>

            {/* Article list */}
            <section className="bg-background">
                <div className="container py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, ease }}
                        className="border-t border-[#D4B896]"
                    >
                        {Object.entries(blogData).map(([slug, post]) => {
                            const code = articleCode[slug];
                            return (
                                <Link key={slug} href={`/blog/${slug}`}>
                                    <div className="border-b border-[#D4B896] py-8 grid md:grid-cols-[1fr_220px] gap-8 items-center group hover:bg-[#F5DFC8] transition-colors duration-150 cursor-pointer">
                                        {/* Text */}
                                        <div>
                                            <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground tracking-widest mb-3">
                                                <span>{post.date}</span>
                                                <span>·</span>
                                                <span>{post.readTime}</span>
                                            </div>
                                            <h2 className="font-display font-bold text-foreground text-2xl leading-tight mb-2 group-hover:text-primary transition-colors duration-150">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-4">
                                                {post.excerpt}
                                            </p>
                                            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-2">
                                                Read article →
                                            </span>
                                        </div>
                                        {/* Code block thumbnail */}
                                        {code && (
                                            <div className="hidden md:block overflow-hidden border border-[#2E1F0F] bg-[#1A1008] group-hover:border-[#C97B3A]/40 transition-colors duration-300">
                                                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#2E1F0F]">
                                                    <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                                                    <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                                                    <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                                                    <span className="ml-auto font-mono text-[9px] text-[#664422] tracking-widest">{code.filename}</span>
                                                </div>
                                                <div className="px-4 py-3 font-mono text-[10px] leading-[1.7] overflow-hidden max-h-[120px]">
                                                    {code.lines.slice(0, 8).map((line, i) => (
                                                        <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {line.tokens.length === 0 ? <>&nbsp;</> : line.tokens.map((tok, j) => (
                                                                <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <FooterStrip />
        </div>
    );
}

// ── Individual Article ────────────────────────────────────────────────────────
export default function BlogPost() {
    const [match, params] = useRoute("/blog/:slug");

    if (!match || !params || !blogData[params.slug]) {
        return <BlogIndex />;
    }

    const post = blogData[params.slug];
    const code = articleCode[params.slug];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={`${post.title} | DevEdge Blog`}
                description={post.excerpt}
                url={`https://devedge.com.au/blog/${params.slug}`}
                type="article"
                publishedTime={post.isoDate}
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-0">
                <BgDecorations />
                <div className="container relative z-10 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="flex items-center gap-6 mb-10"
                    >
                        <Link href="/blog" className="font-mono text-[11px] text-muted-foreground tracking-[0.18em] uppercase inline-flex items-center gap-3 hover:text-primary transition-colors">
                            ← All Articles
                        </Link>
                        <span className="w-px h-4 bg-[#D4B896]" />
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            DevEdge Blog
                        </span>
                    </motion.div>
                    <motion.h1
                        className="font-display font-black text-foreground leading-[0.88] tracking-tight max-w-4xl"
                        style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        {post.title}
                    </motion.h1>
                    <motion.div
                        className="mt-8 flex flex-wrap items-center gap-6 font-mono text-[11px] text-muted-foreground tracking-widest"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.16, ease }}
                    >
                        <span>{post.date}</span>
                        <span className="w-px h-3 bg-[#D4B896]" />
                        <span>{post.readTime}</span>
                        <span className="w-px h-3 bg-[#D4B896]" />
                        <span>{post.author}</span>
                    </motion.div>
                </div>
            </section>

            {/* Code block hero (replaces stock image) */}
            {code && (
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2, ease }}
                        className="my-12"
                    >
                        <CodeBlock filename={code.filename} lines={code.lines} />
                    </motion.div>
                </div>
            )}

            {/* Article body */}
            <div className="container max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.24, ease }}
                    className="prose prose-stone max-w-none
                        prose-headings:font-display prose-headings:font-black prose-headings:text-foreground
                        prose-p:text-muted-foreground prose-p:text-[16px] prose-p:leading-relaxed
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-ul:text-muted-foreground prose-li:leading-relaxed
                        prose-blockquote:border-l-primary prose-blockquote:bg-[#EDD9C0] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:text-foreground prose-blockquote:not-italic prose-blockquote:font-medium
                        prose-a:text-primary hover:prose-a:text-primary/80"
                >
                    {post.content}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.3, ease }}
                    className="border-t border-[#D4B896] mt-20 pt-16 text-center pb-20"
                >
                    <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 justify-center mb-6">
                        <span className="w-8 h-px bg-primary inline-block" />
                        Ready to build?
                    </span>
                    <h3
                        className="font-display font-black text-foreground leading-[0.88] tracking-tight mb-6"
                        style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
                    >
                        Let's put this into practice.
                    </h3>
                    <p className="text-muted-foreground text-[17px] leading-relaxed mb-10 max-w-md mx-auto">
                        Our team is ready to scope your project — first conversation is always free.
                    </p>
                    <ContactModal
                        buttonText="Start a Conversation"
                        triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                    />
                </motion.div>
            </div>

            <FooterStrip />
        </div>
    );
}
