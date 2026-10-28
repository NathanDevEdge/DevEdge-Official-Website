import { Link } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";
import { GROUP_LABELS, JOURNEY, getService, servicesByGroup, type ServiceGroup } from "@/data/services";
import { breadcrumbSchema } from "@/lib/schema";

const GROUP_INTROS: Record<ServiceGroup, string> = {
    build: "The website, apps and systems your business runs on.",
    grow: "The marketing that brings customers in, and the tracking that proves it.",
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Services: Websites, Apps, CRM & ERP, Marketing | DevEdge"
                description="Websites, web and mobile apps, CRM and ERP systems, care and hosting, paid media, SEO and tracking. One team that builds the systems and brings the customers."
                jsonLd={breadcrumbSchema([
                    { name: "Home", path: "/" },
                    { name: "Services", path: "/services" },
                ])}
            />
            <Navigation />

            <PageHero
                crumbs={[{ label: "Home", href: "/" }]}
                eyebrow="Services"
                title={
                    <>
                        We build it.
                        <br />
                        <span className="text-primary">Then we grow it.</span>
                    </>
                }
                tagline="Most businesses juggle a web designer, a developer, a CRM consultant and a marketing agency, and nobody owns the whole picture. We do all of it, as one team, so every piece works with the next."
            />

            {/* ── The connected journey ─────────────────────────────── */}
            <section className="bg-[#1A1008] py-24">
                <div className="container">
                    <FadeUp>
                        <Eyebrow light>How it fits together</Eyebrow>
                        <SectionHeading light className="mt-5 mb-14 max-w-3xl">
                            From first click to paid invoice, with nothing lost in between.
                        </SectionHeading>
                        <ol className="grid md:grid-cols-5 gap-px bg-[#2E1F0F] border border-[#2E1F0F]">
                            {JOURNEY.map((j) => (
                                <li key={j.step} className="bg-[#1A1008] p-6 flex flex-col">
                                    <span className="font-mono text-[11px] text-[#C97B3A] tracking-widest">{j.step}</span>
                                    <span className="mt-2 font-display font-black text-[28px] text-[#F5E6D5] tracking-tight">{j.label}</span>
                                    <span className="mt-2 text-[14px] leading-[1.6] text-[#A89070] flex-1">{j.body}</span>
                                    <span className="mt-4 flex flex-col gap-1">
                                        {j.slugs.map((slug) => (
                                            <Link
                                                key={slug}
                                                href={`/services/${slug}`}
                                                className="font-mono text-[11px] tracking-wider text-[#C97B3A] hover:text-[#F5E6D5] transition-colors duration-150"
                                            >
                                                {getService(slug)?.name} →
                                            </Link>
                                        ))}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </FadeUp>
                </div>
            </section>

            {/* ── Service groups ────────────────────────────────────── */}
            {(["build", "grow"] as ServiceGroup[]).map((group) => (
                <section key={group} className="container py-24 border-b border-[#D4B896] last:border-0">
                    <FadeUp>
                        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
                            <div>
                                <Eyebrow>{GROUP_LABELS[group]}</Eyebrow>
                                <SectionHeading className="mt-5">{GROUP_LABELS[group]}.</SectionHeading>
                                <p className="mt-4 text-muted-foreground text-[17px] leading-[1.7] max-w-sm">{GROUP_INTROS[group]}</p>
                            </div>
                            <div className="border-t border-[#D4B896]">
                                {servicesByGroup(group).map((s) => (
                                    <Link key={s.slug} href={`/services/${s.slug}`}>
                                        <div className="group grid sm:grid-cols-[1fr_2fr_auto] gap-2 sm:gap-8 items-baseline py-7 border-b border-[#D4B896]">
                                            <h3 className="font-display font-black text-[30px] tracking-tight group-hover:text-primary transition-colors duration-150">
                                                {s.name}
                                            </h3>
                                            <p className="text-[15px] leading-[1.6] text-muted-foreground">{s.short}</p>
                                            <span className="hidden sm:block text-primary text-xl transition-transform duration-150 group-hover:translate-x-1">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </FadeUp>
                </section>
            ))}

            {/* ── Tradeflow product strip ───────────────────────────── */}
            <section className="container pb-24">
                <FadeUp>
                    <Link href="/products/tradeflow">
                        <div className="group grid md:grid-cols-[auto_1fr_auto] gap-6 items-center bg-[#EDD9C0] border-l-2 border-primary p-8 hover:bg-[#F5DFC8] transition-colors duration-150">
                            <Eyebrow>Our product</Eyebrow>
                            <p className="text-[17px] leading-[1.6]">
                                <strong className="font-display font-black text-[24px] tracking-tight mr-2">Tradeflow</strong>
                                Quoting, purchase orders and supplier management for small businesses. Built and run by DevEdge.
                            </p>
                            <span className="text-primary font-mono text-[12px] tracking-[0.18em] uppercase group-hover:translate-x-1 transition-transform duration-150">Learn more →</span>
                        </div>
                    </Link>
                </FadeUp>
            </section>

            <CtaBand
                eyebrow="Not sure what you need?"
                heading={<>Tell us the problem.<br />We'll find the fix.</>}
                body="Most projects touch more than one service. Start with a free conversation and we'll map out what actually makes sense."
            />
            <Footer />
        </div>
    );
}
