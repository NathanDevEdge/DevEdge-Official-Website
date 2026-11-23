// The shape of a DevEdge Free Tool. See client/src/tools/README.md for how to add one.
import type { ComponentType } from "react";

export type CategorySlug = "marketing" | "business-finance" | "trade-installer";

export interface ToolComponentProps {
    /** true inside /embed/<tool> on someone else's site: hide anything that only makes sense on devedge.com.au */
    embedded: boolean;
}

export interface ToolFaq {
    q: string;
    a: string;
}

export interface ToolDefinition {
    /** URL: /tools/<slug> and /embed/<slug>. Lowercase words joined by hyphens. Never change it once live. */
    slug: string;
    /** Page H1 and card title, e.g. "UTM Link Builder" */
    name: string;
    /** The visible backlink under every embed, e.g. "UTM link builder by DevEdge". Tool name + "DevEdge", nothing keyword-stuffed. */
    linkText: string;
    /** First one is the primary category (breadcrumbs, schema). A tool can sit in more than one. */
    categories: CategorySlug[];
    /** One line for cards on the hub and category pages */
    summary: string;
    /** One or two sentences under the H1 */
    tagline: string;
    /** <title>, about 60 characters */
    seoTitle: string;
    /** Meta description, 140 to 160 characters */
    seoDescription: string;
    /** YYYY-MM-DD. Newest tools are listed first. */
    launched: string;
    /** YYYY-MM-DD of the last real change */
    updated?: string;
    /** Show it in the hub's featured row */
    featured?: boolean;
    /** The tool itself: no page chrome, theme tokens only (bg-card, text-primary, border-border ...) */
    Component: ComponentType<ToolComponentProps>;
    /** 600 to 1,000 words under the tool: how to use it, assumptions, worked examples. Plain h2/h3/p/ul. */
    About: ComponentType;
    /** Shown on the page and sent as FAQPage schema */
    faqs: ToolFaq[];
    related: {
        /** A slug from client/src/data/services.ts */
        service: string;
        /** An Insights post slug (the how-to guide is found automatically from its `tool:` frontmatter) */
        post?: string;
        /** Other tool slugs */
        tools?: string[];
    };
    /** Starting iframe height in px for the embed code (it resizes itself after load) */
    embedHeight: number;
    /** Keep it off the live site (no page, not listed, not in the sitemap). Still shows in `pnpm dev`. */
    draft?: boolean;
}

/** Identity helper so tool files get type checking: `export default defineTool({ ... })` */
export const defineTool = (tool: ToolDefinition) => tool;
