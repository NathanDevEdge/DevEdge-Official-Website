import { Link } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const TRADEFLOW_URL = "https://tradeflow.devedge.com.au";

const FEATURES = [
    { title: "Quotes with live margins", body: "Build quotes fast and see your margin on every line before you send." },
    { title: "Purchase orders", body: "Raise POs from quotes, with smart buy-price logic for pack and loose pricing." },
    { title: "Supplier price lists", body: "Upload supplier price lists by CSV and keep your costs current." },
    { title: "Customers & suppliers", body: "Every contact in one place, linked to their quotes and orders." },
    { title: "Branded PDFs", body: "Professional quotes and POs with your logo, ABN and details." },
    { title: "Built for teams", body: "Multi-user access with roles, so the whole team works from one system." },
];

const WHO_FOR = [
    "Small businesses and sole traders",
    "Wholesale and distribution businesses: fencing, building materials, outdoor living, trades",
    "Anyone quoting and ordering from spreadsheets or pen and paper",
];

export default function TradeflowPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Tradeflow: Quoting & Purchase Order Software by DevEdge"
                description="Tradeflow is quoting, purchase order and supplier management software for small businesses, built and run by DevEdge. Better than spreadsheets, without the enterprise price tag."
                jsonLd={[
                    {
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        name: "Tradeflow",
                        applicationCategory: "BusinessApplication",
                        operatingSystem: "Web",
                        url: TRADEFLOW_URL,
                        description: "Quoting, purchase orders and supplier management for small businesses.",
                        creator: { "@id": `${SITE.url}/#organization` },
                    },
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Tradeflow", path: "/products/tradeflow" },
                    ]),
                ]}
            />
            <Navigation />

            <PageHero
                crumbs={[{ label: "Home", href: "/" }]}
                eyebrow="Our product · Built by DevEdge"
                title={
                    <>
                        Tradeflow.
                        <br />
                        <span className="text-primary">Better than spreadsheets.</span>
                    </>
                }
                tagline="Quoting, purchase orders and supplier management for small businesses, without the enterprise price tag or the weeks of setup."
            >
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href={TRADEFLOW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 text-[15px] transition-colors duration-150"
                    >
                        Visit Tradeflow →
                    </a>
                </div>
            </PageHero>

            <section className="container pb-24">
                <FadeUp>
                    <img
                        src="/images/project-tradeflow.webp"
                        alt="Tradeflow homepage showing the quotes dashboard"
                        width={1600}
                        height={1000}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto border border-[#D4B896] shadow-[0_32px_80px_-20px_rgba(46,31,15,0.25)]"
                    />
                </FadeUp>
            </section>

            <section className="bg-[#1A1008] py-24">
                <div className="container">
                    <FadeUp>
                        <Eyebrow light>What it does</Eyebrow>
                        <SectionHeading light className="mt-5 mb-14 max-w-2xl">
                            The admin that eats your evenings, handled.
                        </SectionHeading>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2E1F0F] border border-[#2E1F0F]">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="bg-[#1A1008] p-8">
                                    <h3 className="font-display font-black text-[24px] text-[#F5E6D5] tracking-tight">{f.title}</h3>
                                    <p className="mt-3 text-[15px] leading-[1.7] text-[#A89070]">{f.body}</p>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            <section className="container py-24">
                <FadeUp className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <Eyebrow>Who it's for</Eyebrow>
                        <SectionHeading className="mt-5">Built for the people doing the work.</SectionHeading>
                        <ul className="mt-8 space-y-4">
                            {WHO_FOR.map((w) => (
                                <li key={w} className="flex gap-3 text-[16px] leading-[1.6]">
                                    <span className="w-px h-5 bg-primary shrink-0 mt-0.5" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#EDD9C0] border-l-2 border-primary p-8 self-start">
                        <Eyebrow>Why we built it</Eyebrow>
                        <p className="mt-5 text-[17px] leading-[1.7]">
                            We kept seeing small businesses stuck between spreadsheets that break and enterprise software that costs a
                            fortune and takes weeks to set up. So we built the middle option, and we run it ourselves.
                        </p>
                        <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">
                            Need something like this, but built around exactly how your business works?{" "}
                            <Link href="/services/crm-erp-systems" className="text-primary font-semibold hover:text-primary/80">
                                See our CRM & ERP Systems service →
                            </Link>
                        </p>
                    </div>
                </FadeUp>
            </section>

            <CtaBand
                eyebrow="Need a system built for you?"
                heading={<>Tradeflow is what we build.<br />Yours could be next.</>}
                body="If off-the-shelf doesn't fit how your business works, we'll build something that does."
                secondary={{ label: "CRM & ERP Systems →", href: "/services/crm-erp-systems" }}
            />
            <Footer />
        </div>
    );
}
