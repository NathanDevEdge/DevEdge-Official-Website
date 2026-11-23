import type { Takeaway as TakeawayData } from "@shared/blog";

/** "Ask *how many apps* you'll open" → the starred words in Ember */
function Emphasis({ text }: { text: string }) {
    return (
        <>
            {text.split("*").map((part, i) =>
                i % 2 === 1 ? <span key={i} className="text-primary">{part}</span> : <span key={i}>{part}</span>,
            )}
        </>
    );
}

export default function Takeaway({ label, headline, answer }: TakeawayData) {
    return (
        <aside className="not-prose relative overflow-hidden bg-[#1A1008] text-[#F5E6D5] px-7 py-9 md:px-12 md:py-12 my-12">
            <div className={`relative grid gap-8 items-end ${answer ? "md:grid-cols-[1fr_220px]" : ""}`}>
                <p className="font-display font-extrabold leading-[0.95] tracking-tight" style={{ fontSize: "clamp(32px, 4.4vw, 48px)" }}>
                    <Emphasis text={headline} />
                </p>
                {answer && (
                    <div className="border-l border-[#3A2814] pl-5 text-[15px] leading-relaxed text-[#C9B497]">
                        <span className="block font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-2">{label}</span>
                        {answer}
                    </div>
                )}
            </div>
        </aside>
    );
}
