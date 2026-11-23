import type { Flow } from "@shared/blog";

const GRID =
    "linear-gradient(to right, rgba(212,184,150,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,184,150,0.45) 1px, transparent 1px)";

/** A plain-English picture of a process: one card per step, joined by a dashed path */
export default function FlowDiagram({ caption, steps }: Flow) {
    const last = steps.length - 1;
    return (
        <figure
            className="not-prose my-12 border border-[#D4B896] bg-[#EDD9C0] px-6 py-8 md:px-8 md:py-14"
            style={{ backgroundImage: GRID, backgroundSize: "32px 32px" }}
        >
            <ol className="relative flex flex-col md:flex-row gap-5 md:gap-4 md:items-center">
                {/* The path: down the left on phones, across the middle on wider screens */}
                <span aria-hidden="true" className="absolute left-3 top-2 bottom-2 border-l-2 border-dashed border-primary md:hidden" />
                <span aria-hidden="true" className="hidden md:block absolute left-6 right-6 top-1/2 border-t-2 border-dashed border-primary" />
                {steps.map((step, i) => (
                    <li
                        key={i}
                        className={`relative ml-8 md:ml-0 md:flex-1 border-2 border-[#1A1008] ${i === last ? "bg-primary" : "bg-[#F5E6D5]"} ${i % 2 ? "md:translate-y-7" : "md:-translate-y-7"}`}
                    >
                        <div className="bg-[#1A1008] text-[#F5E6D5] font-mono text-[11px] tracking-[0.16em] uppercase px-3 py-1.5">{step.label}</div>
                        <p className="px-3 py-3 text-[15px] leading-snug text-[#1A1008]">{step.text}</p>
                    </li>
                ))}
            </ol>
            {caption && (
                <figcaption className="mt-8 md:mt-14 font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">{caption}</figcaption>
            )}
        </figure>
    );
}
