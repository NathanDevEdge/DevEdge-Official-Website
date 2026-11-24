import { Link } from "wouter";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";

type Featured = { client: string; what: string; line: string; href: string; image?: { src: string; alt: string; url: string } };

const FEATURED: Featured[] = [
    {
        client: "DeckMate",
        what: "Deck quoting app, web & iPhone",
        line: "Started as a website with a deck calculator feeding Zoho CRM. Now a full quoting app: draw the deck, and it works out the framing, 3D, cut list and a branded quote.",
        href: "/projects",
        image: { src: "/images/insights/deckmate/after-homepage.webp", alt: "The DeckMate homepage: draw the deck, price it, send the quote", url: "deckmate.com.au" },
    },
    {
        client: "Tradeflow",
        what: "Our own SaaS product",
        line: "Quoting, purchase orders and supplier management for small businesses. Built, launched and run by DevEdge.",
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

                    {FEATURED.filter((p) => p.image).map((p) => (
                        <Link key={p.client} href={p.href}>
                            <article className="group mt-14 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 items-center border-t-2 border-primary pt-6">
                                <div>
                                    <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-primary">{p.what}</p>
                                    <h3 className="mt-1 font-display font-black text-[34px] tracking-tight group-hover:text-primary transition-colors duration-150">
                                        {p.client}
                                    </h3>
                                    <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground max-w-xl">{p.line}</p>
                                </div>
                                <figure className="border border-[#D4B896] bg-white shadow-[0_24px_60px_-30px_rgba(46,31,15,0.45)] overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                                    <div className="flex items-center gap-1.5 px-3 h-7 border-b border-[#E8D9C4] bg-[#F7F1E8]">
                                        <span className="w-2 h-2 rounded-full bg-[#D4B896]" />
                                        <span className="w-2 h-2 rounded-full bg-[#D4B896]" />
                                        <span className="w-2 h-2 rounded-full bg-[#D4B896]" />
                                        <span className="ml-3 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">{p.image!.url}</span>
                                    </div>
                                    <img src={p.image!.src} alt={p.image!.alt} width={1600} height={1000} loading="lazy" decoding="async" className="block w-full h-auto" />
                                </figure>
                            </article>
                        </Link>
                    ))}

                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED.filter((p) => !p.image).map((p) => (
                            <Link key={p.client} href={p.href}>
                                <article className="group h-full border-t-2 border-primary pt-5">
                                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary">{p.what}</p>
                                    <h3 className="mt-1 font-display font-black text-[26px] tracking-tight group-hover:text-primary transition-colors duration-150">{p.client}</h3>
                                    <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">{p.line}</p>
                                </article>
                            </Link>
                        ))}
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
