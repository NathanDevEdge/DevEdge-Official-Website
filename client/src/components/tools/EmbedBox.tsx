import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { ToolDefinition } from "@/tools";
import { cleanHex, type EmbedTheme } from "./ToolSurface";

const SWATCHES = [
    { name: "DevEdge Ember", hex: "#C97B3A" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Green", hex: "#16A34A" },
    { name: "Red", hex: "#DC2626" },
    { name: "Charcoal", hex: "#334155" },
];

/** The copy-paste embed code: an iframe plus one plain, visible link back to the tool page */
export function embedCode(tool: ToolDefinition, theme: EmbedTheme, accent: string) {
    const params = new URLSearchParams();
    if (theme !== "light") params.set("theme", theme);
    if (accent.toLowerCase() !== "#c97b3a") params.set("accent", accent.replace("#", ""));
    const query = params.toString() ? `?${params}` : "";
    const src = `${SITE.url}/embed/${tool.slug}${query}`;
    const page = `${SITE.url}/tools/${tool.slug}`;
    return [
        `<iframe src="${src}" title="${tool.name}" data-devedge-tool="${tool.slug}" width="100%" height="${tool.embedHeight}" style="border:0;width:100%;max-width:100%" loading="lazy"></iframe>`,
        `<p style="margin:8px 0 0;font-size:14px"><a href="${page}">${tool.linkText}</a></p>`,
        // Optional: lets the iframe grow and shrink with its content. Without it the height above is used.
        `<script>addEventListener("message",function(e){var d=e.data;if(e.origin!=="${SITE.url}"||!d||d.type!=="devedge-embed-height")return;document.querySelectorAll('iframe[data-devedge-tool="'+d.tool+'"]').forEach(function(f){f.style.height=d.height+"px"})})</script>`,
    ].join("\n");
}

/** "Put this tool on your website": options, live preview and the code to copy */
export default function EmbedBox({ tool }: { tool: ToolDefinition }) {
    const [theme, setTheme] = useState<EmbedTheme>("light");
    const [accent, setAccent] = useState("#C97B3A");
    const [copied, setCopied] = useState(false);
    const code = useMemo(() => embedCode(tool, theme, cleanHex(accent) ?? "#C97B3A"), [tool, theme, accent]);
    const [previewHeight, setPreviewHeight] = useState(tool.embedHeight);
    // The preview resizes itself the same way a real embed does
    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            const d = e.data;
            if (e.origin !== window.location.origin || d?.type !== "devedge-embed-height" || d.tool !== tool.slug) return;
            setPreviewHeight(Math.max(120, Math.min(2000, Number(d.height) || tool.embedHeight)));
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [tool]);
    const previewSrc = `/embed/${tool.slug}?preview=1&theme=${theme}&accent=${(cleanHex(accent) ?? "#C97B3A").slice(1)}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = code;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        trackEvent("tool_embed_copy", { tool: tool.slug, theme });
    };

    const label = "font-mono text-[11px] tracking-[0.18em] uppercase text-[#A89070]";

    return (
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10">
            <div>
                <ol className="space-y-6 text-[15px] leading-[1.6] text-[#A89070]">
                    <li>
                        <span className={label}>1. Pick a look</span>
                        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Theme">
                            {(["light", "dark"] as EmbedTheme[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    role="radio"
                                    aria-checked={theme === t}
                                    onClick={() => setTheme(t)}
                                    className={cn(
                                        "px-4 h-10 border text-[14px] font-medium capitalize transition-colors duration-150",
                                        theme === t ? "border-[#C97B3A] text-[#F5E6D5] bg-[#2E1F0F]" : "border-[#2E1F0F] text-[#A89070] hover:border-[#C97B3A]/60",
                                    )}
                                >
                                    {t} background
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Accent colour">
                            {SWATCHES.map((s) => (
                                <button
                                    key={s.hex}
                                    type="button"
                                    role="radio"
                                    aria-checked={accent.toLowerCase() === s.hex.toLowerCase()}
                                    aria-label={s.name}
                                    title={s.name}
                                    onClick={() => setAccent(s.hex)}
                                    className={cn(
                                        "w-9 h-9 border-2 transition-transform duration-150 hover:scale-105",
                                        accent.toLowerCase() === s.hex.toLowerCase() ? "border-[#F5E6D5]" : "border-transparent",
                                    )}
                                    style={{ background: s.hex }}
                                />
                            ))}
                            <label className="inline-flex items-center gap-2 ml-1 text-[13px]">
                                <span className="sr-only">Your own colour</span>
                                <input
                                    type="color"
                                    value={cleanHex(accent) ?? "#c97b3a"}
                                    onChange={(e) => setAccent(e.target.value)}
                                    className="w-9 h-9 bg-transparent border border-[#2E1F0F] cursor-pointer"
                                />
                                Your brand colour
                            </label>
                        </div>
                    </li>
                    <li>
                        <span className={label}>2. Copy the code</span>
                        <div className="mt-3 relative">
                            <textarea
                                readOnly
                                value={code}
                                aria-label="Embed code"
                                onFocus={(e) => e.currentTarget.select()}
                                className="w-full h-40 resize-none bg-[#120B05] border border-[#2E1F0F] p-4 pr-24 font-mono text-[12px] leading-[1.6] text-[#D4B896] focus:outline-none focus:border-[#C97B3A]"
                            />
                            <button
                                type="button"
                                onClick={copy}
                                className="absolute top-3 right-3 bg-[#C97B3A] hover:bg-[#b8692e] text-[#1A1008] font-semibold text-[13px] px-4 h-9 transition-colors duration-150"
                            >
                                {copied ? "Copied ✓" : "Copy"}
                            </button>
                        </div>
                    </li>
                    <li>
                        <span className={label}>3. Paste it into your site</span>
                        <p className="mt-2">
                            Paste it into a custom HTML or embed block in WordPress, Squarespace, Wix, Shopify or Webflow. It's free, there's
                            no sign-up, and it sets no cookies on your site. Please keep the small link under the tool: it's how we keep these free.
                        </p>
                    </li>
                </ol>
            </div>
            <div>
                <span className={label}>Preview</span>
                <div className={cn("mt-3 p-4 border border-[#2E1F0F]", theme === "dark" ? "bg-[#0E0904]" : "bg-[#F5E6D5]")}>
                    <iframe
                        key={previewSrc}
                        src={previewSrc}
                        title={`${tool.name} embed preview`}
                        loading="lazy"
                        className="w-full border-0 block"
                        style={{ height: previewHeight }}
                    />
                    <p className={cn("mt-2 text-[14px] underline", theme === "dark" ? "text-[#D4B896]" : "text-[#1A1008]")}>{tool.linkText}</p>
                </div>
            </div>
        </div>
    );
}
