import { useRoute } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { Link } from "wouter";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";

// Our 5 core SEO pillar articles
const blogData: Record<string, any> = {
    "healthcare-custom-software-australia": {
        title: "Custom Software Development for Healthcare in Australia",
        excerpt: "Why off-the-shelf solutions fall short for Australian healthcare providers, and how custom software ensures HIPAA & privacy compliance while improving patient outcomes.",
        date: "Feb 20, 2026",
        readTime: "6 min read",
        author: "DevEdge Engineering Team",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
        content: (
            <>
                <h2>The State of Healthcare Tech in Australia</h2>
                <p>The Australian healthcare system demands a rigorous level of security, data privacy, and interoperability that generic software simply cannot provide. From managing sensitive patient records to ensuring seamless communication between specialists and GPs, the technology stack must be robust.</p>

                <h2>Why Custom Development?</h2>
                <p>1. <strong>Total Compliance:</strong> Custom software is built from the ground up to comply with the Australian Privacy Principles (APPs) and the My Health Record system requirements.</p>
                <p>2. <strong>Integration Capabilities:</strong> Legacy systems in hospitals often struggle to communicate. Custom middleware and APIs can bridge these gaps without costly total system replacements.</p>
                <p>3. <strong>Scalability:</strong> As your practice grows, off-the-shelf software often requires expensive tier upgrades. Custom software grows with you, on your terms.</p>

                <blockquote>"Investing in custom digital infrastructure isn't just an IT upgrade; it's a direct investment in patient care and operational efficiency."</blockquote>
            </>
        )
    },
    "custom-mobile-app-cost-sydney": {
        title: "How Much Does a Custom Mobile App Cost in Sydney?",
        excerpt: "A transparent breakdown of mobile app development costs in 2026, from MVP to enterprise-grade solutions.",
        date: "Feb 18, 2026",
        readTime: "8 min read",
        author: "DevEdge Strategy Team",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
        content: (
            <>
                <h2>The Real Cost of App Development</h2>
                <p>If you're looking for a top-tier software agency in Sydney, you've likely seen quotes ranging from $20,000 to over $500,000. Why the massive gap?</p>

                <h2>Breakdown by App Complexity</h2>
                <ul>
                    <li><strong>Simple MVP ($20k - $50k):</strong> Basic UI, single platform, limited backend logic. Great for testing a concept.</li>
                    <li><strong>Medium Complexity ($50k - $120k):</strong> Custom UI/UX, cross-platform (React Native/Flutter), API integrations, user accounts, and a scalable backend.</li>
                    <li><strong>Enterprise Grade ($150k+):</strong> Complex logic, high-level security, real-time data sync, machine learning integrations, and extensive administrative panels.</li>
                </ul>

                <h2>Hidden Costs to Consider</h2>
                <p>Don't forget maintenance! Server hosting (AWS/GCP), App Store developer fees, continuous bug fixes, and feature updates typically cost 15-20% of the initial development cost annually.</p>
            </>
        )
    },
    "legacy-system-modernization-cloud": {
        title: "Legacy System Modernization to Cloud: Best Practices",
        excerpt: "A CTO's guide to migrating aging enterprise monoliths into scalable, resilient cloud-native microservices.",
        date: "Feb 15, 2026",
        readTime: "10 min read",
        author: "DevEdge Cloud Architecture",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
        content: (
            <>
                <h2>The Hidden Risk of Doing Nothing</h2>
                <p>Maintaining legacy on-premise servers is increasingly expensive and poses massive security risks. Modernizing isn't just about faster code; it's about business continuity.</p>

                <h2>The 5 'R's of Cloud Migration</h2>
                <p>1. <strong>Rehost (Lift and Shift):</strong> Moving the exact same infrastructure from on-prem to AWS/Azure. Quickest, but least optimized.</p>
                <p>2. <strong>Refactor:</strong> Tweaking the codebase to utilize PaaS (Platform as a Service) features.</p>
                <p>3. <strong>Rearchitect:</strong> Breaking down a monolithic application into microservices for ultimate scalability.</p>
                <p>4. <strong>Rebuild:</strong> Rewriting the application from scratch using modern frameworks (like React, Node.js, Go).</p>
                <p>5. <strong>Replace:</strong> Dropping the custom software for a SaaS solution (rarely works for core IP).</p>

                <h2>Our Recommended Approach</h2>
                <p>For most mid-to-large enterprises, an incremental "Strangler Fig" pattern works best. We slowly replace pieces of the legacy system with cloud microservices until the old monolith can be safely retired with zero downtime.</p>
            </>
        )
    },
    "automated-workflow-software-logistics": {
        title: "Automated Workflow Software for Logistics Companies",
        excerpt: "How custom automation is saving supply chain and logistics companies thousands of hours in manual data entry.",
        date: "Feb 10, 2026",
        readTime: "5 min read",
        author: "DevEdge Automation Team",
        image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c1590a?auto=format&fit=crop&q=80&w=1200",
        content: (
            <>
                <h2>The Spreadsheets Must Die</h2>
                <p>If your dispatch team is still copy-pasting tracking numbers between three different portals, you are losing money every minute.</p>

                <h2>High-Impact Automation Use Cases</h2>
                <ul>
                    <li><strong>Automated Dispatch & Routing:</strong> Software that calculates the most efficient delivery routes based on real-time traffic and vehicle capacity.</li>
                    <li><strong>API Integrations:</strong> Connecting your warehouse management system (WMS) directly to your carriers (FedEx, Toll, AusPost) so tracking is entirely hands-off.</li>
                    <li><strong>Invoice Generation:</strong> Automatically generating and emailing invoices the second a POD (Proof of Delivery) is captured via a driver's mobile app.</li>
                </ul>

                <h2>The ROI of Custom Logistics Tech</h2>
                <p>Off-the-shelf logistics software often forces you to change your operations to match the software. Custom automation curves to fit exactly how your warehouse actually runs.</p>
            </>
        )
    },
    "custom-vs-off-the-shelf-software": {
        title: "Benefits of Custom vs. Off-The-Shelf Software for Enterprise",
        excerpt: "Are you forcing your business to fit a generic SaaS tool? When it makes financial sense to build your own.",
        date: "Feb 05, 2026",
        readTime: "7 min read",
        author: "DevEdge Strategy Team",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
        content: (
            <>
                <h2>The SaaS Trap</h2>
                <p>Off-the-shelf Software as a Service (SaaS) is fantastic for non-core tasks (like email or basic accounting). But when it comes to the lifeblood of your operations, generic tools force you into generic workflows.</p>

                <h2>When to choose Off-The-Shelf</h2>
                <p>If your processes are standard across your industry, and you have a limited budget (under $20k), off-the-shelf is usually the right call. It's fast to deploy and requires no internal technical management.</p>

                <h2>When to Build Custom</h2>
                <p>1. <strong>Competitive Advantage:</strong> If your software is how you beat competitors, you cannot afford to use the exact same tool they do.</p>
                <p>2. <strong>Subscription Fatigue:</strong> $50/user/month for 500 employees is $300,000 every single year. A custom build often pays for itself within 18 months in saved licensing fees alone.</p>
                <p>3. <strong>Complete Ownership & Valuation:</strong> Custom software is an asset on your books. It increases the valuation of your company, whereas SaaS subscriptions are purely operational expenses.</p>
            </>
        )
    }
};

export default function BlogPost() {
    const [match, params] = useRoute("/blog/:slug");

    if (!match || !params || !blogData[params.slug]) {
        // If not a specific post, render the Blog Index
        return <BlogIndex />;
    }

    const post = blogData[params.slug];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white pb-20">
            <SEO
                title={`${post.title} | DevEdge Blog`}
                description={post.excerpt}
                image={post.image}
            />
            <Navigation />

            <main className="pt-32">
                <article className="container max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors mb-12">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 text-white">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm font-medium">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/30 text-primary">
                                    {post.author.charAt(0)}
                                </div>
                                {post.author}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {post.date}
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {post.readTime}
                            </div>
                        </div>
                    </header>

                    <div className="w-full h-[400px] md:h-[500px] aspect-video rounded-3xl overflow-hidden mb-16 border border-white/10 relative">
                        <div className="absolute inset-0 bg-black/20 mix-blend-multiply z-10"></div>
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-li:text-muted-foreground">
                        {post.content}
                    </div>

                    <div className="mt-20 pt-12 border-t border-white/10 text-center">
                        <h3 className="text-2xl font-display font-medium text-white mb-4">Ready to implement what you've read?</h3>
                        <p className="text-muted-foreground mb-8">Our engineering team is ready to architect your next solution.</p>
                        <ContactModal
                            buttonText="Start a Project"
                            triggerClassName="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 h-14 shadow-[0_0_30px_-5px_var(--color-primary)]"
                        />
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}

// Sub-component for the Blog Index list
function BlogIndex() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white pb-20">
            <SEO
                title="Engineering & Strategy Blog | DevEdge Solutions"
                description="Insights, tutorials, and deep-dives into custom software development, cloud computing, and digital transformation for Australian enterprises."
            />
            <Navigation />

            <main className="pt-32">
                <div className="container max-w-5xl">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-6xl font-display font-medium mb-6">
                            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Insights.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                            Deep dives into software architecture, enterprise modernization, and building digital products that scale.
                        </p>
                    </div>

                    <div className="grid gap-12">
                        {Object.entries(blogData).map(([slug, post]) => (
                            <Link key={slug} href={`/blog/${slug}`}>
                                <div className="group flex flex-col md:flex-row gap-8 items-center bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/20 hover:bg-white/10 rounded-3xl p-6 transition-all duration-300 cursor-pointer">
                                    <div className="w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden rounded-2xl relative">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="w-full md:w-2/3 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-xs font-mono text-primary mb-4 tracking-wider uppercase">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground text-lg font-light leading-relaxed mb-6 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center text-sm font-medium text-white/70">
                                            Read Article <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
