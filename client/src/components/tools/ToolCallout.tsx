import { Link } from "wouter";
import { getTool, primaryCategory, toolPath } from "@/tools";

/** "Try the free tool" card at the top of a how-to post (frontmatter `tool: <slug>`) */
export default function ToolCallout({ slug }: { slug: string }) {
    const tool = getTool(slug);
    if (!tool) return null;
    return (
        <Link
            href={toolPath(tool.slug)}
            className="not-prose group my-10 grid sm:grid-cols-[1fr_auto] gap-4 items-center bg-[#1A1008] border-l-2 border-[#C97B3A] p-6 sm:p-8"
        >
            <span>
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#C97B3A]">
                    Free tool · {primaryCategory(tool).short}
                </span>
                <span className="mt-2 block font-display font-black text-[30px] leading-[0.95] tracking-tight text-[#F5E6D5]">{tool.name}</span>
                <span className="mt-2 block text-[15px] leading-[1.6] text-[#A89070]">{tool.summary}</span>
            </span>
            <span className="inline-flex items-center justify-center h-12 px-6 bg-[#C97B3A] group-hover:bg-[#b8692e] text-[#1A1008] font-semibold text-[15px] transition-colors duration-150 whitespace-nowrap">
                Try it free →
            </span>
        </Link>
    );
}
