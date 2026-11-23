import { Link } from "wouter";
import StackArt from "@/components/insights/StackArt";
import { getCategory, toolPath, type ToolDefinition } from "@/tools";

/** A tool in a grid on /tools and the category pages */
export default function ToolCard({ tool, showCategory = true }: { tool: ToolDefinition; showCategory?: boolean }) {
    const category = getCategory(tool.categories[0]);
    return (
        <Link href={toolPath(tool.slug)} className="group flex flex-col bg-[#FBEFD9] border border-[#D4B896] hover:border-primary transition-colors duration-150 h-full">
            <div className="h-[120px] overflow-hidden border-b border-[#D4B896] group-hover:border-primary/60 transition-colors duration-150">
                <StackArt seed={`tool-${tool.slug}`} variant="thumb" />
            </div>
            <div className="p-6 flex flex-col flex-1">
                {showCategory && category && (
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{category.short}</span>
                )}
                <h3 className="mt-2 font-display font-black text-[28px] leading-[0.95] tracking-tight text-foreground group-hover:text-primary transition-colors duration-150">
                    {tool.name}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-muted-foreground flex-1">{tool.summary}</p>
                <span className="mt-5 font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-2">
                    Use it free <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                </span>
            </div>
        </Link>
    );
}

/** Placeholder for a category that has no live tools yet */
export function ToolCardSoon({ label = "More tools on the way" }: { label?: string }) {
    return (
        <div className="flex flex-col justify-center border border-dashed border-[#D4B896] p-6 min-h-[180px] h-full">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Coming soon</span>
            <p className="mt-3 font-display font-black text-[24px] leading-[0.95] tracking-tight text-[#7A5C3A]/70">{label}</p>
        </div>
    );
}
