import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";
import { VALUES } from "@/components/home/About";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const STATS = [
    { value: "100+", label: "Projects delivered" },
    { value: "18", label: "Systems running today" },
    { value: "3", label: "Years in business" },
    { value: "3", label: "Countries: Australia, the UK and Poland" },
];

const DIFFERENT = [
    {
        title: "Built to hand over",
        body: "Every website, system and ad account we set up is documented and owned by you. If you ever want to move on, handover is simple. We'd rather keep you because we're good, not because you're stuck.",
    },
    {
        title: "Scope you can actually read",
        body: "You'll know exactly what's included before we start. If something falls outside the scope, we tell you up front, not on the invoice.",
    },
    {
        title: "Your outcome, not our retainer",
        body: "We'll tell you if something won't work, or if you don't need us at all. Clear advice, clear updates, and no upsell creep.",
    },
];

const OUTCOMES = [
    { label: "Software", body: "Your team actually uses it, it feels efficient, and it delivers what we planned together in discovery." },
    { label: "Marketing", body: "We hit the targets you set, then aim past them." },
    { label: "Always", body: "You're happy with what you've got, and you could walk away with all of it tomorrow if you wanted to." },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="About DevEdge: Development & Marketing, One Team | Melbourne"
                description="DevEdge brings custom development and marketing together under one roof. Based in Melbourne CBD, working with businesses across Australia, the UK and Poland. No lock-in, no surprise bills."
                jsonLd={[
                    {
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        url: `${SITE.url}/about`,
                        name: "About DevEdge",
                        about: { "@id": `${SITE.url}/#organization` },
                    },
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "About", path: "/about" },
                    ]),
                ]}
            />
            <Navigation />

            <PageHero
                crumbs={[{ label: "Home", href: "/" }]}
                eyebrow="About DevEdge"
                title={
                    <>
                        Two passions.
                        <br />
                        <span className="text-primary">One edge.</span>
                    </>
                }
                tagline="DevEdge brings development and marketing together, so the thing we build and the customers it brings in are planned by the same people. Based in Melbourne CBD, working with clients across Australia, the UK and Poland."
            />

            <section className="container pb-24">
                <FadeUp className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4B896] border border-[#D4B896]">
                    {STATS.map((s) => (
                        <div key={s.label} className="bg-background p-7">
                            <div className="font-display font-black text-[56px] leading-none tracking-tight text-primary">{s.value}</div>
                            <div className="mt-3 text-[14px] leading-[1.5] text-muted-foreground">{s.label}</div>
                        </div>
                    ))}
                </FadeUp>
            </section>

            {/* Founder story. A professional photo slots into the right-hand column once it's ready. */}
            <section className="container pb-28">
                <FadeUp className="grid lg:grid-cols-[1.4fr_1fr] gap-16">
                    <div>
                        <Eyebrow>The story</Eyebrow>
                        <SectionHeading className="mt-5">I've been making things since I was six.</SectionHeading>
                        <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-foreground/85 max-w-2xl">
                            <p>
                                It started with movies for my family and content just for me. At school it turned into games and useful little
                                tools around the house. Making something people genuinely enjoy using has always been the hook, and so has the
                                people side of it. I've loved working with people my whole life.
                            </p>
                            <p>
                                Then life got interesting. A placement had me working on an AI intrusion detection system with the University of
                                Manchester: real problems, real stakes, and a first proper look at what good software can do.
                            </p>
                            <p>
                                After that I moved to Australia to build something of my own. I started running marketing campaigns for people
                                and found I was genuinely good at it. In 2024 I started working with trade, building and supply businesses,
                                loved the people in the industry, and never left.
                            </p>
                            <p>
                                DevEdge is those two passions in one place. Everything I know is self-taught and proven on real projects. Most
                                businesses hire one company for the website, another for the software and a third for the ads, then spend their
                                time getting them to talk to each other. We do all of it, so it works together from day one.
                            </p>
                        </div>
                        <p className="mt-8 font-display font-black text-[22px] tracking-tight">Nathan Anniss</p>
                        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Founder, DevEdge</p>
                    </div>
                    <div className="bg-[#1A1008] p-10 self-start">
                        <Eyebrow light>Home base</Eyebrow>
                        <p className="mt-5 font-display font-black text-[40px] leading-[0.95] tracking-tight text-[#F5E6D5]">
                            Melbourne CBD.
                            <br />
                            <span className="text-[#C97B3A]">Working everywhere.</span>
                        </p>
                        <p className="mt-6 text-[15px] leading-[1.7] text-[#A89070]">
                            Most of our clients are Australian businesses, from sole traders to established suppliers. We also work with
                            clients in the UK and Poland. Everything runs remotely, and we're always a call away.
                        </p>
                    </div>
                </FadeUp>
            </section>

            <section className="bg-[#1A1008] py-24">
                <div className="container">
                    <FadeUp>
                        <Eyebrow light>Why we work the way we do</Eyebrow>
                        <SectionHeading light className="mt-5 max-w-3xl">
                            Too many agencies work in a way that suits the agency.
                        </SectionHeading>
                        <p className="mt-6 mb-14 text-[17px] leading-[1.7] text-[#A89070] max-w-2xl">
                            Websites built so nobody else can touch them. Scopes so vague the extra bills are guaranteed. We built DevEdge to
                            be the opposite.
                        </p>
                        <div className="grid lg:grid-cols-3 gap-px bg-[#2E1F0F] border border-[#2E1F0F]">
                            {DIFFERENT.map((d) => (
                                <div key={d.title} className="bg-[#1A1008] p-8">
                                    <h3 className="font-display font-black text-[26px] text-[#F5E6D5] tracking-tight">{d.title}</h3>
                                    <p className="mt-3 text-[15px] leading-[1.7] text-[#A89070]">{d.body}</p>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            <section className="container py-28">
                <FadeUp className="grid lg:grid-cols-[1fr_1.2fr] gap-16">
                    <div>
                        <Eyebrow>What good looks like</Eyebrow>
                        <SectionHeading className="mt-5">
                            Happy clients.
                            <br />
                            <span className="text-primary">Not trapped ones.</span>
                        </SectionHeading>
                    </div>
                    <div className="divide-y divide-[#D4B896] border-y border-[#D4B896]">
                        {OUTCOMES.map((o) => (
                            <div key={o.label} className="py-7 grid sm:grid-cols-[140px_1fr] gap-3">
                                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-primary pt-1">{o.label}</span>
                                <p className="text-[17px] leading-[1.65]">{o.body}</p>
                            </div>
                        ))}
                    </div>
                </FadeUp>
            </section>

            <section className="container pb-28">
                <FadeUp>
                    <Eyebrow>What we stand for</Eyebrow>
                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4B896] border border-[#D4B896]">
                        {VALUES.map((v) => (
                            <div key={v.name} className="bg-background p-7">
                                <h3 className="font-display font-black text-[28px] tracking-tight text-primary">{v.name}</h3>
                                <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground">{v.line}</p>
                            </div>
                        ))}
                    </div>
                </FadeUp>
            </section>

            <CtaBand
                eyebrow="Let's talk"
                heading={<>Got something to build<br />or grow?</>}
                body="Tell us what you're working on. You'll get a straight answer on whether we can help."
            />
            <Footer />
        </div>
    );
}
