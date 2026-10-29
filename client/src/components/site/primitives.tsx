import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

export const ease = [0.16, 1, 0.3, 1] as const;

/** Brand eyebrow: Ember rule + mono uppercase label */
export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
    return (
        <span
            className={cn(
                "font-mono text-[11px] tracking-[0.18em] uppercase inline-flex items-center gap-3",
                light ? "text-[#C97B3A]" : "text-primary",
                className,
            )}
        >
            <span className={cn("w-8 h-px inline-block", light ? "bg-[#C97B3A]" : "bg-primary")} />
            {children}
        </span>
    );
}

/** One fade-up per section, per the brand motion rules (20px, 300ms, ease-out, 20% in view) */
export function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay, ease }}
            className={className}
        >
            {children}
        </m.div>
    );
}

/** Section heading in the display face */
export function SectionHeading({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
    return (
        <h2
            className={cn(
                "font-display font-black leading-[0.92] tracking-tight",
                light ? "text-[#F5E6D5]" : "text-foreground",
                className,
            )}
            style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}
        >
            {children}
        </h2>
    );
}

/** Accessible FAQ list that works without JavaScript */
export function FaqList({ faqs, light }: { faqs: { q: string; a: string }[]; light?: boolean }) {
    return (
        <div className={cn("border-t", light ? "border-[#2E1F0F]" : "border-[#D4B896]")}>
            {faqs.map((f) => (
                <details key={f.q} className={cn("group border-b py-5", light ? "border-[#2E1F0F]" : "border-[#D4B896]")}>
                    <summary
                        className={cn(
                            "flex items-center justify-between gap-6 cursor-pointer list-none font-semibold text-[16px] transition-colors duration-150 [&::-webkit-details-marker]:hidden",
                            light ? "text-[#F5E6D5] hover:text-[#C97B3A]" : "text-foreground hover:text-primary",
                        )}
                    >
                        {f.q}
                        <span className="text-primary text-xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className={cn("mt-3 text-[15px] leading-[1.7] max-w-3xl", light ? "text-[#A89070]" : "text-muted-foreground")}>
                        {f.a}
                    </p>
                </details>
            ))}
        </div>
    );
}
