import type { MouseEvent } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { m } from "framer-motion";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/site/HeroBackdrop";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp, FaqList, SectionHeading, ease } from "@/components/site/primitives";
import ToolSurface from "@/components/tools/ToolSurface";
import ToolCard from "@/components/tools/ToolCard";
import EmbedBox from "@/components/tools/EmbedBox";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/schema";
import { getService } from "@/data/services";
import posts from "virtual:blog-posts";
import { getTool, guideFor, primaryCategory, relatedTools, toolPath } from "@/tools";
import { categoryPath } from "@/tools/categories";
import NotFound from "./NotFound";

/** Same article styles as Insights posts */
const PROSE = `prose prose-stone max-w-none
    prose-headings:font-display prose-headings:font-black prose-headings:text-foreground prose-headings:tracking-tight
    prose-h2:text-[34px] prose-h2:leading-[1] prose-h3:text-[24px]
    prose-p:text-muted-foreground prose-p:text-[16px] prose-p:leading-relaxed
    prose-strong:text-foreground prose-strong:font-semibold
    prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:leading-relaxed
    prose-code:text-foreground prose-code:bg-[#EDD9C0] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-code:[overflow-wrap:anywhere]
    prose-table:text-[15px] prose-table:block prose-table:overflow-x-auto prose-th:text-foreground prose-td:text-muted-foreground
    prose-blockquote:border-l-primary prose-blockquote:bg-[#EDD9C0] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:text-foreground prose-blockquote:not-italic prose-blockquote:font-medium
    prose-a:text-primary hover:prose-a:text-primary/80`;

const POSTS = new Map(posts.map((p) => [p.slug, p]));

export default function ToolPage() {
    const [, params] = useRoute("/tools/:slug");
    const [, navigate] = useLocation();
    const tool = params ? getTool(params.slug) : undefined;
    if (!tool) return <NotFound />;

    const category = primaryCategory(tool);
    const guide = guideFor(tool.slug);
    const service = getService(tool.related.service);
    const post = tool.related.post ? POSTS.get(tool.related.post) : undefined;
    const related = relatedTools(tool);
    const url = `https://devedge.com.au${toolPath(tool.slug)}`;
    const { Component, About } = tool;

    // Route plain <a href="/..."> links inside the About text through wouter
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
                title={tool.seoTitle}
                description={tool.seoDescription}
                url={url}
                jsonLd={[
                    webApplicationSchema({ ...tool, category: category.name }),
                    faqSchema(tool.faqs),
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Free Tools", path: "/tools" },
                        { name: category.name, path: categoryPath(category.slug) },
                        { name: tool.name, path: toolPath(tool.slug) },
                    ]),
                ]}
            />
            <Navigation />

            {/* ── Compact hero, so the tool sits above the fold ───────── */}
            <section className="relative bg-background overflow-hidden pt-32 pb-10">
                <HeroBackdrop />
                <m.div
                    className="container relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease }}
                >
                    <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                        <Link href="/tools" className="hover:text-primary transition-colors duration-150">
                            Free Tools
                        </Link>
                        <span className="mx-2 text-[#D4B896]">/</span>
                        <Link href={categoryPath(category.slug)} className="hover:text-primary transition-colors duration-150">
                            {category.short}
                        </Link>
                    </nav>
                    <h1 className="font-display font-black text-foreground leading-[0.9] tracking-tight max-w-[900px]" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>
                        {tool.name}
                    </h1>
                    <p className="mt-5 text-muted-foreground text-[18px] leading-relaxed max-w-[640px]">{tool.tagline}</p>
                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#7A5C3A]">
                        {["Free", "No sign-up", "Works on your phone", "Embed it on your site"].map((x) => (
                            <li key={x} className="inline-flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary inline-block" />
                                {x}
                            </li>
                        ))}
                    </ul>
                </m.div>
            </section>

            {/* ── The tool ─────────────────────────────────────────────── */}
            <section className="container relative z-10 pb-6">
                <ToolSurface>
                    <Component embedded={false} />
                </ToolSurface>
                {guide && (
                    <Link
                        href={`/insights/${guide.slug}`}
                        className="group mt-4 flex flex-wrap items-center justify-between gap-3 bg-[#EDD9C0] border-l-2 border-primary px-6 py-4 hover:bg-[#F5DFC8] transition-colors duration-150"
                    >
                        <span className="text-[15px] leading-[1.5]">
                            <strong className="font-semibold">New to this?</strong> <span className="text-muted-foreground">Read the full guide: {guide.title}</span>
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-primary group-hover:translate-x-1 transition-transform duration-150">
                            Read it →
                        </span>
                    </Link>
                )}
            </section>

            {/* ── How it works + related ──────────────────────────────── */}
            <section className="container py-20">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-16">
                    <div className={PROSE} onClick={onBodyClick}>
                        <About />
                    </div>
                    <aside className="space-y-6 lg:sticky lg:top-28 self-start">
                        {service && (
                            <Link href={`/services/${service.slug}`} className="group block border border-[#D4B896] p-6 hover:border-primary transition-colors duration-150">
                                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Need a hand with this?</span>
                                <span className="mt-2 block font-display font-black text-[26px] leading-[0.95] tracking-tight group-hover:text-primary transition-colors duration-150">
                                    {service.name}
                                </span>
                                <span className="mt-2 block text-[14px] leading-[1.6] text-muted-foreground">{service.short}</span>
                                <span className="mt-4 block font-mono text-[11px] tracking-[0.18em] uppercase text-primary">How we help →</span>
                            </Link>
                        )}
                        {post && post.slug !== guide?.slug && (
                            <Link href={`/insights/${post.slug}`} className="group block border border-[#D4B896] p-6 hover:border-primary transition-colors duration-150">
                                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Related reading</span>
                                <span className="mt-2 block font-display font-bold text-[20px] leading-[1.1] group-hover:text-primary transition-colors duration-150">
                                    {post.title}
                                </span>
                                <span className="mt-4 block font-mono text-[11px] tracking-[0.18em] uppercase text-primary">Read article →</span>
                            </Link>
                        )}
                        <a href="#embed" className="group block bg-[#1A1008] p-6">
                            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#C97B3A]">Free for your website</span>
                            <span className="mt-2 block font-display font-black text-[24px] leading-[0.95] tracking-tight text-[#F5E6D5]">Embed this tool</span>
                            <span className="mt-2 block text-[14px] leading-[1.6] text-[#A89070]">Copy one snippet. Your colours, no cookies, no cost.</span>
                        </a>
                    </aside>
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────────────────────── */}
            {tool.faqs.length > 0 && (
                <section className="container pb-24">
                    <FadeUp>
                        <Eyebrow>Questions</Eyebrow>
                        <SectionHeading className="mt-5 mb-10">Frequently asked.</SectionHeading>
                        <FaqList faqs={tool.faqs} />
                    </FadeUp>
                </section>
            )}

            {/* ── Embed ───────────────────────────────────────────────── */}
            <section id="embed" className="bg-[#1A1008] py-24 scroll-mt-20">
                <div className="container">
                    <FadeUp>
                        <Eyebrow light>Embed this tool</Eyebrow>
                        <SectionHeading light className="mt-5 mb-4">
                            Put it on your own website.
                        </SectionHeading>
                        <p className="text-[#A89070] text-[17px] leading-relaxed mb-12 max-w-2xl">
                            Give your customers the {tool.name} on your own site, in your own colours. Free, no account needed.
                        </p>
                        <EmbedBox tool={tool} />
                    </FadeUp>
                </div>
            </section>

            {/* ── Related tools ───────────────────────────────────────── */}
            {related.length > 0 && (
                <section className="container py-24">
                    <FadeUp>
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                            <div>
                                <Eyebrow>Keep going</Eyebrow>
                                <SectionHeading className="mt-5">More free tools.</SectionHeading>
                            </div>
                            <Link href="/tools" className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase hover:text-foreground transition-colors duration-150">
                                All free tools →
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((t) => (
                                <ToolCard key={t.slug} tool={t} />
                            ))}
                        </div>
                    </FadeUp>
                </section>
            )}

            <CtaBand
                eyebrow="Want one of your own?"
                heading={
                    <>
                        Want this built into
                        <br />
                        your own site?
                    </>
                }
                body="We build custom calculators, quote tools and portals that connect to your CRM. Talk to us. The first conversation is free."
                secondary={{ label: "See web & app work →", href: "/services/web-and-mobile-apps" }}
            />
            <Footer />
        </div>
    );
}
