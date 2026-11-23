import { Link } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";
import ToolCard, { ToolCardSoon } from "@/components/tools/ToolCard";
import ToolsSignup from "@/components/tools/ToolsSignup";
import { breadcrumbSchema, toolCollectionSchema } from "@/lib/schema";
import { TOOLS, TOOL_CATEGORIES, toolsInCategory } from "@/tools";
import { categoryPath } from "@/tools/categories";

const DESCRIPTION =
    "Free calculators and generators for Australian businesses: marketing, business and trade tools. No sign-up, and you can embed any of them on your own website.";

export default function ToolsHub() {
    const featured = [...TOOLS.filter((t) => t.featured), ...TOOLS.filter((t) => !t.featured)].slice(0, 3);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Free Tools for Australian Businesses | DevEdge"
                description={DESCRIPTION}
                jsonLd={[
                    toolCollectionSchema({ path: "/tools", name: "DevEdge Free Tools", description: DESCRIPTION, tools: TOOLS }),
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Free Tools", path: "/tools" },
                    ]),
                ]}
            />
            <Navigation />

            <PageHero
                crumbs={[{ label: "Home", href: "/" }]}
                eyebrow="DevEdge Free Tools"
                title={
                    <>
                        Free tools.
                        <br />
                        <span className="text-primary">No catch.</span>
                    </>
                }
                tagline="Calculators and generators for the jobs small businesses do every week. Use them here for free, with no sign-up, or put them on your own website."
            >
                <nav aria-label="Tool categories" className="flex flex-wrap gap-2">
                    {TOOL_CATEGORIES.map((c) => (
                        <a
                            key={c.slug}
                            href={`#${c.slug}`}
                            className="inline-flex items-center h-10 px-4 border border-[#D4B896] hover:border-primary text-[14px] font-medium text-foreground hover:text-primary transition-colors duration-150"
                        >
                            {c.short}
                        </a>
                    ))}
                </nav>
            </PageHero>

            {/* ── Newest / featured ───────────────────────────────────── */}
            {featured.length > 0 && (
                <section className="container py-20">
                    <FadeUp>
                        <Eyebrow>Start here</Eyebrow>
                        <SectionHeading className="mt-5 mb-10">The newest tools.</SectionHeading>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.map((t) => (
                                <ToolCard key={t.slug} tool={t} />
                            ))}
                        </div>
                    </FadeUp>
                </section>
            )}

            {/* ── Categories ──────────────────────────────────────────── */}
            {TOOL_CATEGORIES.map((c) => {
                const tools = toolsInCategory(c.slug);
                return (
                    <section key={c.slug} id={c.slug} className="container py-20 border-t border-[#D4B896] scroll-mt-28">
                        <FadeUp>
                            <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
                                <div>
                                    <Eyebrow>{c.short}</Eyebrow>
                                    <SectionHeading className="mt-5">{c.name}.</SectionHeading>
                                    <p className="mt-4 text-muted-foreground text-[17px] leading-[1.7] max-w-sm">{c.summary}</p>
                                    <Link
                                        href={categoryPath(c.slug)}
                                        className="mt-6 inline-flex font-mono text-[11px] text-primary tracking-[0.18em] uppercase hover:text-foreground transition-colors duration-150"
                                    >
                                        All {c.short.toLowerCase()} tools →
                                    </Link>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {tools.map((t) => (
                                        <ToolCard key={t.slug} tool={t} showCategory={false} />
                                    ))}
                                    {tools.length < 2 && <ToolCardSoon />}
                                </div>
                            </div>
                        </FadeUp>
                    </section>
                );
            })}

            {/* ── Embed explainer + signup ────────────────────────────── */}
            <section className="bg-[#1A1008] py-24">
                <div className="container grid lg:grid-cols-2 gap-16">
                    <FadeUp>
                        <Eyebrow light>Free for your website</Eyebrow>
                        <SectionHeading light className="mt-5 mb-8">
                            Put any tool on your own site.
                        </SectionHeading>
                        <ol className="grid gap-px bg-[#2E1F0F] border border-[#2E1F0F]">
                            {[
                                ["01", "Open the tool", "Every tool page has an “Embed this tool” section at the bottom."],
                                ["02", "Pick your colours", "Light or dark, in your own brand colour."],
                                ["03", "Paste the code", "Into any website builder. No account, no cookies, no cost."],
                            ].map(([n, title, body]) => (
                                <li key={n} className="bg-[#1A1008] p-6 grid grid-cols-[48px_1fr] gap-4">
                                    <span className="font-mono text-[12px] text-[#C97B3A] tracking-widest pt-1">{n}</span>
                                    <span>
                                        <span className="block font-display font-black text-[24px] text-[#F5E6D5] tracking-tight">{title}</span>
                                        <span className="block mt-1 text-[15px] leading-[1.6] text-[#A89070]">{body}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </FadeUp>
                    <FadeUp delay={0.05}>
                        <Eyebrow light>New tools</Eyebrow>
                        <SectionHeading light className="mt-5 mb-6">
                            Get the next one first.
                        </SectionHeading>
                        <p className="text-[#A89070] text-[17px] leading-relaxed mb-8 max-w-md">
                            We add new tools every few weeks. Leave your email and we'll let you know when one goes live. Nothing else, and you can
                            ask us to take you off any time.
                        </p>
                        <ToolsSignup source="hub" />
                    </FadeUp>
                </div>
            </section>

            <CtaBand
                eyebrow="Need something more specific?"
                heading={
                    <>
                        Want a tool built
                        <br />
                        for your business?
                    </>
                }
                body="Quote calculators, booking forms, client portals. We build custom tools that plug into your website and CRM. The first conversation is free."
                secondary={{ label: "See web & app work →", href: "/services/web-and-mobile-apps" }}
            />
            <Footer />
        </div>
    );
}
