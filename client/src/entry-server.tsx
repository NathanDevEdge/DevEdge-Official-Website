// Build-time renderer: turns each public route into static HTML (see scripts/prerender.mjs).
import { renderToString } from "react-dom/server";
import App from "./App";
import { SERVICES, LEGACY_SERVICE_REDIRECTS } from "./data/services";
import { BLOG_POSTS } from "./pages/BlogPost";
import { TOOLS, TOOL_CATEGORIES, toolsInCategory, toolsLastUpdated } from "./tools";

/** Every public page that should be pre-rendered and listed in the sitemap */
/** `sitemap: false` pre-renders a page but leaves it out of the sitemap (the noindex embeds) */
export const PRERENDER_ROUTES: { path: string; priority: number; changefreq: string; lastmod?: string; sitemap?: boolean }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/services", priority: 0.9, changefreq: "monthly" },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9, changefreq: "monthly" })),
  { path: "/projects", priority: 0.8, changefreq: "monthly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/products/tradeflow", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "yearly" },
  { path: "/insights", priority: 0.7, changefreq: "weekly", lastmod: BLOG_POSTS.map((p) => p.updated ?? p.date).sort().at(-1) },
  ...BLOG_POSTS.map((p) => ({
    path: `/insights/${p.slug}`,
    priority: 0.6,
    changefreq: "monthly",
    lastmod: p.updated ?? p.date,
  })),
  { path: "/tools", priority: 0.8, changefreq: "weekly", lastmod: toolsLastUpdated() },
  ...TOOL_CATEGORIES.map((c) => ({
    path: `/tools/category/${c.slug}`,
    priority: 0.6,
    changefreq: "weekly",
    lastmod: toolsInCategory(c.slug).map((t) => t.updated ?? t.launched).sort().at(-1),
  })),
  ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: 0.8, changefreq: "monthly", lastmod: t.updated ?? t.launched })),
  ...TOOLS.map((t) => ({ path: `/embed/${t.slug}`, priority: 0, changefreq: "yearly", sitemap: false })),
  { path: "/privacy", priority: 0.2, changefreq: "yearly" },
  { path: "/terms", priority: 0.2, changefreq: "yearly" },
];

export { LEGACY_SERVICE_REDIRECTS };

type HelmetData = { helmet?: Record<string, { toString(): string }> };

export function render(url: string) {
  const helmetContext: HelmetData = {};
  const html = renderToString(<App ssrPath={url} helmetContext={helmetContext} />);
  const h = helmetContext.helmet;
  const head = h
    ? [h.title, h.meta, h.link, h.script].map((part) => part?.toString() ?? "").join("\n    ")
    : "";
  return { html, head };
}
