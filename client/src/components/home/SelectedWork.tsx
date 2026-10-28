import { Link } from "wouter";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";

const FEATURED = [
    {
        client: "DeckMate",
        what: "Website, deck calculator & Zoho CRM",
        line: "A website with a built-in deck calculator that gives customers accurate quotes fast, connected to Zoho CRM so every lead lands in the sales pipeline.",
        image: "/images/project-deckmate.webp",
        href: "/projects",
    },
    {
        client: "Tradeflow",
        what: "Our own SaaS product",
        line: "Quoting, purchase orders and supplier management for small businesses. Built, launched and run by DevEdge.",
        image: "/images/project-tradeflow.webp",
        href: "/products/tradeflow",
    },
];

const MORE = [
    { client: "Tennantly", what: "Mobile app development", line: "A landlord management app, taken from an idea to a working product." },
    { client: "TPD Timber", what: "CRM & ERP Systems", line: "Zoho Inventory cleaned up and restructured: product groups, data and opening stock." },
    { client: "WoodEvo", what: "Website & internal tools", line: "Website, plus a custom file request and approval portal built on Google Drive." },
];

export default function SelectedWork() {
    return (
        <section id="work" className="scroll-mt-24 bg-[#EDD9C0]/50 py-28">
            <div className="container">
                <FadeUp>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <Eyebrow>Selected work</Eyebrow>
                            <SectionHeading className="mt-5">Proof, not promises.</SectionHeading>
                        </div>
                        <Link href="/projects" className="font-mono text-[12px] tracking-[0.18em] uppercase text-primary hover:text-primary/80">
                            See all our work →
                        </Link>
                    </div>

                    <div className="mt-14 grid lg:grid-cols-2 gap-10">
                        {FEATURED.map((p) => (
                            <Link key={p.client} href={p.href}>
                                <article className="group">
                                    <div className="overflow-hidden border border-[#D4B896]">
                                        <img
                                            src={p.image}
                                            alt={`${p.client} website`}
                                            width={1600}
                                            height={1000}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                    <p className="mt-5 font-mono text-[11px] tracking-[0.18em] uppercase text-primary">{p.what}</p>
                                    <h3 className="mt-1 font-display font-black text-[34px] tracking-tight group-hover:text-primary transition-colors duration-150">
                                        {p.client}
                                    </h3>
                                    <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground max-w-xl">{p.line}</p>
                                </article>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {MORE.map((p) => (
                            <div key={p.client} className="border-t-2 border-primary pt-5">
                                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{p.what}</p>
                                <h3 className="mt-1 font-display font-black text-[26px] tracking-tight">{p.client}</h3>
                                <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">{p.line}</p>
                            </div>
                        ))}
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}
