// Free Tools categories. Add a new one here when DevEdge moves into a new niche:
// it gets its own section on /tools and its own page at /tools/category/<slug>.
import type { CategorySlug } from "./types";

export interface ToolCategory {
    slug: CategorySlug;
    name: string;
    /** Short label for chips and breadcrumbs */
    short: string;
    /** One line for the hub */
    summary: string;
    /** Intro paragraph on the category page */
    intro: string;
    seoTitle: string;
    seoDescription: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
    {
        slug: "marketing",
        name: "Marketing Tools",
        short: "Marketing",
        summary: "Tracking, ads, reviews and SEO tools for any small business.",
        intro:
            "Simple, free tools for the marketing jobs every small business ends up doing: tagging links so you know which ads work, getting more Google reviews and checking how you show up in search.",
        seoTitle: "Free Marketing Tools for Small Business | DevEdge",
        seoDescription:
            "Free marketing tools for Australian small businesses: UTM link builder, Google review links and more. No sign-up, and you can embed them on your own site.",
    },
    {
        slug: "business-finance",
        name: "Business & Finance Tools",
        short: "Business & Finance",
        summary: "Everyday numbers for Australian small businesses.",
        intro:
            "Quick calculators for the numbers small business owners work out every week: margins, rates, GST and the cost of doing things by hand. They only use the figures you type in.",
        seoTitle: "Free Business & Finance Calculators | DevEdge",
        seoDescription:
            "Free business calculators for Australian small businesses: margins, rates, GST and more. Plain English, no sign-up, and free to embed on your own website.",
    },
    {
        slug: "trade-installer",
        name: "Trade & Installer Tools",
        short: "Trade & Installer",
        summary: "Calculators for builders, installers and the suppliers who sell to them.",
        intro:
            "Material calculators for builders, installers, DIYers and the suppliers who sell to them. Work out what to order before you go to the yard, or put the calculator on your own site for your customers.",
        seoTitle: "Free Trade & Installer Calculators | DevEdge",
        seoDescription:
            "Free calculators for builders, installers and trade suppliers, starting with decking. Work out materials in minutes and embed them free on your own website.",
    },
];

const BY_SLUG = new Map(TOOL_CATEGORIES.map((c) => [c.slug, c]));
export const getCategory = (slug: string) => BY_SLUG.get(slug as CategorySlug);
export const categoryPath = (slug: CategorySlug) => `/tools/category/${slug}`;
