import { useRoute, useLocation, Link } from "wouter";
import type { MouseEvent } from "react";
import SEO from "@/components/SEO";
import { blogSchema, breadcrumbSchema } from "@/lib/schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { m } from "framer-motion";
import posts from "virtual:blog-posts";
import type { CodeLine, CodeRole } from "@shared/blog";

// Posts live in content/blog/*.md (see content/blog/README.md).
// Prices never appear in them: every project is quoted privately.

const ease = [0.16, 1, 0.3, 1] as const;

const POSTS_BY_SLUG = new Map(posts.map((p) => [p.slug, p]));
export const BLOG_POSTS = posts;

/** "2026-10-29" → "Oct 29, 2026", the same on the server and in every time zone */
const formatDate = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// ── Code block visuals (replaces stock photography) ───────────────────────────
const CODE_COLOURS: Record<CodeRole, string> = {
    keyword: "#C97B3A",
    name: "#F5E6D5",
    punct: "#A89070",
    comment: "#664422",
};

function CodeBlock({ filename, lines, className = "" }: { filename: string; lines: CodeLine[]; className?: string }) {
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
                            {line.length > 0 ? i + 1 : ""}
                        </span>
                        <span>
                            {line.map((token, j) => (
                                <span key={j} style={{ color: CODE_COLOURS[token.role] }}>{token.text}</span>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

// ── Blog Index ────────────────────────────────────────────────────────────────
function BlogIndex() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Insights: Websites, CRM & ERP, Apps and Marketing | DevEdge"
                description="Practical, honest articles for Australian businesses on websites, custom software, CRM and ERP systems, automation and marketing that works."
                url="https://devedge.com.au/insights"
                type="website"
                jsonLd={[
                    blogSchema(posts),
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Insights", path: "/insights" },
                    ]),
                ]}
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-16 min-h-[50vh] flex items-end">
                <BgDecorations />
                <div className="container relative z-10">
                    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            DevEdge Insights
                        </span>
                    </m.div>
                    <m.h1
                        className="mt-6 font-display font-black text-foreground leading-[0.88] tracking-tight"
                        style={{ fontSize: "clamp(52px, 7vw, 90px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        Straight answers.
                    </m.h1>
                    <m.p
                        className="mt-6 text-muted-foreground text-[17px] leading-relaxed max-w-[560px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.16, ease }}
                    >
                        Practical, honest articles for Australian businesses on websites, custom software, business systems and marketing that works.
                    </m.p>
                </div>
            </section>

            {/* Article list */}
            <section className="bg-background">
                <div className="container py-16">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, ease }}
                        className="border-t border-[#D4B896]"
                    >
                        {posts.map((post) => {
                            const { slug, heroCode: code } = post;
                            return (
                                <Link key={slug} href={`/insights/${slug}`}>
                                    <div className="border-b border-[#D4B896] py-8 grid md:grid-cols-[1fr_220px] gap-8 items-center group hover:bg-[#F5DFC8] transition-colors duration-150 cursor-pointer">
                                        {/* Text */}
                                        <div>
                                            <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground tracking-widest mb-3">
                                                <span>{formatDate(post.date)}</span>
                                                <span>·</span>
                                                <span>{post.readTime}</span>
                                            </div>
                                            <h2 className="font-display font-bold text-foreground text-2xl leading-tight mb-2 group-hover:text-primary transition-colors duration-150">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-4">
                                                {post.description}
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
                                                            {line.length === 0 ? <>&nbsp;</> : line.map((tok, j) => (
                                                                <span key={j} style={{ color: CODE_COLOURS[tok.role] }}>{tok.text}</span>
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
                    </m.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ── Individual Article ────────────────────────────────────────────────────────
export default function BlogPost() {
    const [match, params] = useRoute("/insights/:slug");
    const [, navigate] = useLocation();
    const post = match && params ? POSTS_BY_SLUG.get(params.slug) : undefined;

    if (!post) {
        return <BlogIndex />;
    }

    const code = post.heroCode;
    const url = `https://devedge.com.au/insights/${post.slug}`;

    // The body is plain HTML from Markdown, so route its links to other pages on the
    // site through wouter instead of letting them reload the whole page.
    const onBodyClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as HTMLElement).closest("a");
        const href = a?.getAttribute("href");
        if (!a || !href || a.target || !href.startsWith("/") || href.startsWith("//")) return;
        e.preventDefault();
        navigate(href);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={`${post.title} | DevEdge Insights`}
                description={post.description}
                url={url}
                type="article"
                publishedTime={post.date}
                modifiedTime={post.updated}
                jsonLd={[
                    {
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: post.title,
                        description: post.description,
                        datePublished: post.date,
                        dateModified: post.updated ?? post.date,
                        url,
                        mainEntityOfPage: url,
                        ...(post.category && { articleSection: post.category }),
                        image: "https://devedge.com.au/og-image.jpg",
                        author: { "@type": "Person", name: post.author, url: "https://devedge.com.au/about" },
                        publisher: { "@id": "https://devedge.com.au/#organization" },
                    },
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Insights", path: "/insights" },
                        { name: post.title, path: `/insights/${post.slug}` },
                    ]),
                ]}
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-0">
                <BgDecorations />
                <div className="container relative z-10 pb-16">
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="flex items-center gap-6 mb-10"
                    >
                        <Link href="/insights" className="font-mono text-[11px] text-muted-foreground tracking-[0.18em] uppercase inline-flex items-center gap-3 hover:text-primary transition-colors">
                            ← All Articles
                        </Link>
                        <span className="w-px h-4 bg-[#D4B896]" />
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            DevEdge Insights
                        </span>
                    </m.div>
                    <m.h1
                        className="font-display font-black text-foreground leading-[0.88] tracking-tight max-w-4xl"
                        style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        {post.title}
                    </m.h1>
                    <m.div
                        className="mt-8 flex flex-wrap items-center gap-6 font-mono text-[11px] text-muted-foreground tracking-widest"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.16, ease }}
                    >
                        <span>{formatDate(post.date)}</span>
                        {post.updated && (
                            <>
                                <span className="w-px h-3 bg-[#D4B896]" />
                                <span>Updated {formatDate(post.updated)}</span>
                            </>
                        )}
                        <span className="w-px h-3 bg-[#D4B896]" />
                        <span>{post.readTime}</span>
                        <span className="w-px h-3 bg-[#D4B896]" />
                        <Link href="/about" className="hover:text-primary transition-colors">{post.author}</Link>
                    </m.div>
                </div>
            </section>

            {/* Code block hero (replaces stock image) */}
            {code && (
                <div className="container">
                    <m.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2, ease }}
                        className="my-12"
                    >
                        <CodeBlock filename={code.filename} lines={code.lines} />
                    </m.div>
                </div>
            )}

            {/* Article body */}
            <div className="container max-w-3xl">
                <m.div
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
                    onClick={onBodyClick}
                    dangerouslySetInnerHTML={{ __html: post.html }}
                />

                {/* CTA */}
                <m.div
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
                        Tell us what you're working on. The first conversation is free, and you'll get a straight answer on whether we can help.
                    </p>
                    <ContactModal
                        buttonText="Start a Conversation"
                        triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                    />
                </m.div>
            </div>

            <Footer />
        </div>
    );
}
