import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import SEO from "@/components/SEO";
import ToolSurface, { cleanHex, type EmbedTheme } from "@/components/tools/ToolSurface";
import { trackEmbedView } from "@/lib/analytics";
import { getTool } from "@/tools";
import NotFound from "./NotFound";

/**
 * /embed/<tool>: the bare tool for iframes on other sites. No header or footer, never indexed,
 * left out of the sitemap. Options come from the query string (?theme=dark&accent=2563eb).
 * It tells the parent page its height so the iframe can fit its content.
 */
export default function ToolEmbed() {
    const [, params] = useRoute("/embed/:slug");
    const tool = params ? getTool(params.slug) : undefined;
    const [theme, setTheme] = useState<EmbedTheme>("light");
    const [accent, setAccent] = useState<string | undefined>();
    const ref = useRef<HTMLDivElement>(null);

    // Options are read after load: the page is pre-rendered once, without a query string
    useEffect(() => {
        const q = new URLSearchParams(window.location.search);
        setTheme(q.get("theme") === "dark" ? "dark" : "light");
        setAccent(cleanHex(q.get("accent")));
        if (tool && !q.has("preview")) trackEmbedView(tool.slug);
    }, [tool]);

    // Match the page background to the theme so no light edge shows around a dark embed
    useEffect(() => {
        const prev = document.body.style.background;
        document.body.style.background = theme === "dark" ? "#1A1008" : "#F5E6D5";
        return () => {
            document.body.style.background = prev;
        };
    }, [theme]);

    useEffect(() => {
        if (!tool || !ref.current || window.parent === window) return;
        const el = ref.current;
        let last = 0;
        const send = () => {
            const height = Math.ceil(el.getBoundingClientRect().height);
            if (height === last) return;
            last = height;
            window.parent.postMessage({ type: "devedge-embed-height", tool: tool.slug, height }, "*");
        };
        const ro = new ResizeObserver(send);
        ro.observe(el);
        send();
        return () => ro.disconnect();
    }, [tool]);

    if (!tool) return <NotFound />;
    const { Component } = tool;

    return (
        <div ref={ref}>
            <SEO title={`${tool.name} | DevEdge`} description={tool.seoDescription} noindex />
            <ToolSurface theme={theme} accent={accent} bare>
                <Component embedded />
            </ToolSurface>
        </div>
    );
}
