import { Link, Redirect, useRoute } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp, FaqList, SectionHeading } from "@/components/site/primitives";
import NotFound from "@/pages/NotFound";
import { GROUP_LABELS, LEGACY_SERVICE_REDIRECTS, getService } from "@/data/services";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

const HOW_WE_WORK = [
    { step: "01", title: "Scope", body: "A free conversation about what you need. We tell you honestly what will work and send a clear, fixed quote." },
    { step: "02", title: "Build", body: "We do the work and keep you updated as we go. You deal directly with the people doing it." },
    { step: "03", title: "Launch & grow", body: "We launch, measure what's working and keep improving it with you, as long as you need us." },
];

export default function ServicePage() {
    const [, params] = useRoute("/services/:slug");
    const slug = params?.slug ?? "";

    if (LEGACY_SERVICE_REDIRECTS[slug]) return <Redirect to={LEGACY_SERVICE_REDIRECTS[slug]} replace />;

    const service = getService(slug);
    if (!service) return <NotFound />;

    const related = service.worksWith.map(getService).filter((s): s is NonNullable<typeof s> => Boolean(s));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={service.seoTitle}
                description={service.seoDescription}
                jsonLd={[
                    serviceSchema(service),
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Services", path: "/services" },
                        { name: service.name, path: `/services/${service.slug}` },
                    ]),
                    faqSchema(service.faqs),
                ]}
            />
            <Navigation />

            <PageHero
                crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]}
                eyebrow={`${GROUP_LABELS[service.group]} · ${service.name}`}
                title={service.name}
                tagline={service.tagline}
            >
                <ContactModal
                    buttonText="Start a Project"
                    triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                />
            </PageHero>

            {/* ── Intro + sound familiar ─────────────────────────────── */}
            <section className="container py-20">
                <FadeUp className="grid lg:grid-cols-[3fr_2fr] gap-16 items-start">
                    <div className="space-y-6">
                        {service.intro.map((p) => (
                            <p key={p.slice(0, 24)} className="text-foreground/85 text-[18px] leading-[1.7]">
                                {p}
                            </p>
                        ))}
                    </div>
                    <div className="bg-[#EDD9C0] border-l-2 border-[#C97B3A] p-8">
                        <Eyebrow className="mb-5">Sound familiar?</Eyebrow>
                        <ul className="space-y-4">
                            {service.signs.map((sign) => (
                                <li key={sign} className="flex gap-3 text-[15px] leading-[1.6] text-foreground/85">
                                    <span className="w-px h-5 bg-primary shrink-0 mt-0.5" />
                                    {sign}
                                </li>
                            ))}
                        </ul>
                    </div>
                </FadeUp>
            </section>

            {/* ── What we do ────────────────────────────────────────── */}
            <section className="bg-[#1A1008] py-24">
                <div className="container">
                    <FadeUp>
                        <Eyebrow light>What we do</Eyebrow>
                        <SectionHeading light className="mt-5 mb-14 max-w-2xl">
                            Everything it takes, handled by one team.
                        </SectionHeading>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2E1F0F] border border-[#2E1F0F]">
                            {service.deliverables.map((d, i) => (
                                <div key={d.title} className="bg-[#1A1008] p-8">
                                    <span className="font-mono text-[11px] text-[#664422] tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                                    <h3 className="mt-3 font-display font-black text-[24px] text-[#F5E6D5] tracking-tight">{d.title}</h3>
                                    <p className="mt-3 text-[15px] leading-[1.7] text-[#A89070]">{d.body}</p>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ── Proof ─────────────────────────────────────────────── */}
            {service.proof && service.proof.length > 0 && (
                <section className="container py-24">
                    <FadeUp>
                        <Eyebrow>Recent work</Eyebrow>
                        <SectionHeading className="mt-5 mb-12">Proof, not promises.</SectionHeading>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {service.proof.map((p) => {
                                const card = (
                                    <div className="h-full border border-[#D4B896] p-7 transition-colors duration-150 hover:border-primary">
                                        <p className="font-display font-black text-[26px] tracking-tight">{p.client}</p>
                                        <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">{p.line}</p>
                                    </div>
                                );
                                return p.href ? (
                                    <Link key={p.client} href={p.href}>
                                        {card}
                                    </Link>
                                ) : (
                                    <div key={p.client}>{card}</div>
                                );
                            })}
                        </div>
                        <Link href="/projects" className="inline-block mt-8 font-mono text-[12px] tracking-[0.18em] uppercase text-primary hover:text-primary/80">
                            See all our work →
                        </Link>
                    </FadeUp>
                </section>
            )}

            {/* ── How we work ───────────────────────────────────────── */}
            <section className={service.proof?.length ? "bg-[#EDD9C0]/50 py-24" : "py-24"}>
                <div className="container">
                    <FadeUp>
                        <Eyebrow>How we work</Eyebrow>
                        <SectionHeading className="mt-5 mb-12">Simple, honest, no surprises.</SectionHeading>
                        <div className="grid md:grid-cols-3 gap-10">
                            {HOW_WE_WORK.map((s) => (
                                <div key={s.step} className="border-t-2 border-primary pt-6">
                                    <span className="font-mono text-[11px] text-primary tracking-widest">{s.step}</span>
                                    <h3 className="mt-2 font-display font-black text-[28px] tracking-tight">{s.title}</h3>
                                    <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">{s.body}</p>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────── */}
            <section className="container py-24">
                <FadeUp className="grid lg:grid-cols-[2fr_3fr] gap-12">
                    <div>
                        <Eyebrow>Questions</Eyebrow>
                        <SectionHeading className="mt-5">
                            {service.name}: straight answers.
                        </SectionHeading>
                    </div>
                    <FaqList faqs={service.faqs} />
                </FadeUp>
            </section>

            {/* ── Works best with ───────────────────────────────────── */}
            <section className="container pb-24">
                <FadeUp>
                    <Eyebrow>Works best with</Eyebrow>
                    <p className="mt-4 mb-10 text-muted-foreground text-[17px] max-w-2xl leading-[1.7]">
                        Our services are built to work together, and it's the same team doing all of it. Pair {service.name.toLowerCase()} with:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {related.map((r) => (
                            <Link key={r.slug} href={`/services/${r.slug}`}>
                                <div className="group h-full bg-[#1A1008] p-7 transition-colors duration-150 hover:bg-[#2E1F0F]">
                                    <span className="font-mono text-[10px] tracking-widest uppercase text-[#664422]">{GROUP_LABELS[r.group]}</span>
                                    <p className="mt-2 font-display font-black text-[26px] text-[#F5E6D5] tracking-tight group-hover:text-[#C97B3A] transition-colors duration-150">
                                        {r.name} →
                                    </p>
                                    <p className="mt-2 text-[14px] leading-[1.6] text-[#A89070]">{r.short}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </FadeUp>
            </section>

            <CtaBand />
            <Footer />
        </div>
    );
}
