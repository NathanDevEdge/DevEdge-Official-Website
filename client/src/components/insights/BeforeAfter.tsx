import type { BeforeAfter as BeforeAfterData } from "@shared/blog";

// Loose, slightly crooked "papers" for the before side
const TILTS = [-6, 5, -3, 7, -5];

/** The messy "now" next to the tidy result. A before item starting with "note:" is drawn as a sticky note. */
export default function BeforeAfter({ before, after }: BeforeAfterData) {
    return (
        <figure className="not-prose my-12 grid md:grid-cols-[1fr_48px_1fr] items-stretch gap-3 md:gap-0">
            <div className="border border-[#D4B896] bg-[#EDD9C0] p-6 md:p-7 flex flex-col">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">Now</span>
                <div className="flex flex-wrap gap-x-3 gap-y-4 py-7 flex-1 content-center">
                    {before.items.map((item, i) => {
                        const note = item.toLowerCase().startsWith("note:");
                        const text = note ? item.slice(5).trim() : item;
                        return (
                            <div
                                key={i}
                                style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
                                className={
                                    note
                                        ? "bg-[#FCEFA8] border border-[#7A5C3A] px-3 py-3 text-[14px] text-[#1A1008] max-w-[130px] shadow-[2px_3px_0_rgba(26,16,8,0.12)]"
                                        : "bg-[#F5E6D5] border border-[#7A5C3A] px-3 pt-2 pb-3 min-w-[130px] max-w-[190px] shadow-[2px_3px_0_rgba(26,16,8,0.12)]"
                                }
                            >
                                <span className={note ? "" : "font-mono text-[12px] text-[#1A1008] break-words"}>{text}</span>
                                {!note && (
                                    <span aria-hidden="true" className="block mt-2 space-y-1.5">
                                        <span className="block h-px bg-[#D4B896] w-full" />
                                        <span className="block h-px bg-[#D4B896] w-3/4" />
                                        <span className="block h-px bg-[#D4B896] w-5/6" />
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <p className="font-display font-extrabold text-foreground leading-tight text-[26px]">{before.caption}</p>
            </div>

            <div aria-hidden="true" className="flex items-center justify-center text-primary">
                <svg width="36" height="28" viewBox="0 0 36 28" className="rotate-90 md:rotate-0">
                    <path d="M2 14h30M20 3l12 11-12 11" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
            </div>

            <div className="bg-[#1A1008] p-6 md:p-7 flex flex-col">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary">After</span>
                <div className="flex flex-col items-center justify-center gap-1.5 py-7 flex-1">
                    {after.items.map((item, i) => (
                        <div
                            key={i}
                            style={{ width: `${72 + i * 9}%` }}
                            className={`px-4 py-3 font-mono text-[11px] md:text-[12px] tracking-[0.14em] uppercase border border-primary ${
                                i === 0 ? "bg-primary text-[#1A1008]" : i % 2 ? "bg-[#3A2814] text-[#F5E6D5]" : "bg-[#2E1F0F] text-[#F5E6D5]"
                            }`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <p className="font-display font-extrabold text-[#F5E6D5] leading-tight text-[26px]">{after.caption}</p>
            </div>
        </figure>
    );
}
