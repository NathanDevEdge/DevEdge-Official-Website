import { Link, useRoute } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp } from "@/components/site/primitives";
import ToolCard, { ToolCardSoon } from "@/components/tools/ToolCard";
import { breadcrumbSchema, toolCollectionSchema } from "@/lib/schema";
import { TOOL_CATEGORIES, getCategory, toolsInCategory } from "@/tools";
import { categoryPath } from "@/tools/categories";
import NotFound from "./NotFound";

export default function ToolCategoryPage() {
    const [, params] = useRoute("/tools/category/:category");
    const category = params ? getCategory(params.category) : undefined;
    if (!category) return <NotFound />;

    const tools = toolsInCategory(category.slug);
    const path = categoryPath(category.slug);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={category.seoTitle}
                description={category.seoDescription}
                jsonLd={[
                    toolCollectionSchema({ path, name: category.name, description: category.seoDescription, tools }),
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Free Tools", path: "/tools" },
                        { name: category.name, path },
                    ]),
                ]}
            />
            <Navigation />

            <PageHero
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Free Tools", href: "/tools" },
                ]}
                eyebrow="Free Tools"
                title={
                    <>
                        {category.short}
                        <br />
                        <span className="text-primary">tools.</span>
                    </>
                }
                tagline={category.intro}
            />

            <section className="container py-20">
                <FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((t) => (
                            <ToolCard key={t.slug} tool={t} showCategory={false} />
                        ))}
                        {tools.length < 3 && <ToolCardSoon />}
                    </div>
                </FadeUp>
            </section>

            <section className="container pb-24">
                <FadeUp>
                    <Eyebrow>More free tools</Eyebrow>
                    <div className="mt-6 border-t border-[#D4B896]">
                        {TOOL_CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
                            <Link key={c.slug} href={categoryPath(c.slug)}>
                                <div className="group grid sm:grid-cols-[1fr_2fr_auto] gap-2 sm:gap-8 items-baseline py-7 border-b border-[#D4B896]">
                                    <h2 className="font-display font-black text-[30px] tracking-tight group-hover:text-primary transition-colors duration-150">{c.name}</h2>
                                    <p className="text-[15px] leading-[1.6] text-muted-foreground">{c.summary}</p>
                                    <span className="hidden sm:block text-primary text-xl transition-transform duration-150 group-hover:translate-x-1">→</span>
                                </div>
                            </Link>
                        ))}
                        <Link href="/tools">
                            <div className="group py-7 border-b border-[#D4B896] font-mono text-[12px] tracking-[0.18em] uppercase text-primary">
                                All free tools <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
                            </div>
                        </Link>
                    </div>
                </FadeUp>
            </section>

            <CtaBand
                eyebrow="Want one of your own?"
                heading={
                    <>
                        We build tools like these
                        <br />
                        for businesses like yours.
                    </>
                }
                body="Calculators, quote forms and portals that plug into your website and CRM. Tell us what you need and we'll tell you honestly what it takes."
                secondary={{ label: "See web & app work →", href: "/services/web-and-mobile-apps" }}
            />
            <Footer />
        </div>
    );
}
