import type { ReactNode } from "react";
import { Link } from "wouter";
import { m } from "framer-motion";
import HeroBackdrop from "@/components/site/HeroBackdrop";
import { Eyebrow, ease } from "@/components/site/primitives";

/** Standard hero for inner pages: breadcrumb, eyebrow, H1, tagline, optional actions */
export default function PageHero({
    crumbs,
    eyebrow,
    title,
    tagline,
    children,
}: {
    crumbs?: { label: string; href: string }[];
    eyebrow: string;
    title: ReactNode;
    tagline?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <section className="relative bg-background overflow-hidden pt-36 pb-20 min-h-[60vh] flex items-end">
            <HeroBackdrop />
            <m.div
                className="container relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
            >
                {crumbs && (
                    <nav aria-label="Breadcrumb" className="mb-10 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                        {crumbs.map((c, i) => (
                            <span key={c.href}>
                                {i > 0 && <span className="mx-2 text-[#D4B896]">/</span>}
                                <Link href={c.href} className="hover:text-primary transition-colors duration-150">
                                    {c.label}
                                </Link>
                            </span>
                        ))}
                    </nav>
                )}
                <Eyebrow>{eyebrow}</Eyebrow>
                <h1
                    className="mt-6 font-display font-black text-foreground leading-[0.9] tracking-tight max-w-[900px]"
                    style={{ fontSize: "clamp(52px, 7.5vw, 100px)" }}
                >
                    {title}
                </h1>
                {tagline && <p className="mt-6 text-muted-foreground text-[19px] leading-relaxed max-w-[620px]">{tagline}</p>}
                {children && <div className="mt-10">{children}</div>}
            </m.div>
        </section>
    );
}
