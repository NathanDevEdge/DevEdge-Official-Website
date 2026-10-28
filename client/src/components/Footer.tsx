import { Link } from "wouter";
import BrandLogo from "@/components/BrandLogo";
import { NAV_LINKS, PORTAL_LOGIN_HREF, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/data/services";

const columns = [
  {
    heading: "Services",
    links: SERVICES.map((s) => ({ name: s.name, href: `/services/${s.slug}` })),
  },
  {
    heading: "Company",
    links: [...NAV_LINKS.filter((l) => l.name !== "Services"), { name: "Tradeflow", href: "/products/tradeflow" }, { name: "Contact", href: "/contact" }, { name: "Client Portal", href: PORTAL_LOGIN_HREF }],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
    ],
  },
];

export default function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("relative overflow-hidden bg-[#1A1008] border-t border-[#2E1F0F] pt-20 pb-10 text-[#F5E6D5]", className)}>
      <div className="container relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex mb-6" aria-label="DevEdge home">
              <BrandLogo size="lg" variant="light" />
            </Link>
            <p className="text-[#F5E6D5] text-sm max-w-sm mb-2 leading-relaxed">
              We build things that actually work.
            </p>
            <p className="text-[#A89070] text-sm max-w-sm mb-8 leading-relaxed">
              Websites, apps, business systems and marketing for Australian
              businesses that need results.
            </p>
            <div className="flex flex-col gap-2 font-mono text-[12px] tracking-wider">
              <a href={`mailto:${SITE.email}`} className="text-[#A89070] hover:text-primary transition-colors duration-150">
                {SITE.email}
              </a>
              <a href={SITE.phoneHref} className="text-[#A89070] hover:text-primary transition-colors duration-150">
                {SITE.phone}
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="font-mono text-[10px] tracking-widest uppercase text-[#A89070] mb-6">{col.heading}</h2>
              <ul className="space-y-4">
                {col.links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#A89070] hover:text-[#F5E6D5] transition-colors duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div className="relative overflow-hidden border-t border-[#2E1F0F] pt-12">
          <span
            className="font-display font-black select-none block text-center leading-none"
            style={{ fontSize: "clamp(80px, 16vw, 200px)", color: "rgba(46,31,15,0.8)", letterSpacing: "-0.02em" }}
            aria-hidden
          >
            DEVEDGE
          </span>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] text-[#A89070]">
          <div>
            © {year} DevEdge{SITE.abn && <> · ABN {SITE.abn}</>}
          </div>
          <div>Built by us. Obviously.</div>
        </div>
      </div>
    </footer>
  );
}
