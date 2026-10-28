// Build-time renderer: turns each public route into static HTML (see scripts/prerender.mjs).
import { renderToString } from "react-dom/server";
import App from "./App";
import { SERVICES, LEGACY_SERVICE_REDIRECTS } from "./data/services";
import { BLOG_SLUGS } from "./pages/BlogPost";

/** Every public page that should be pre-rendered and listed in the sitemap */
export const PRERENDER_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/services", priority: 0.9, changefreq: "monthly" },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9, changefreq: "monthly" })),
  { path: "/projects", priority: 0.8, changefreq: "monthly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/products/tradeflow", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "yearly" },
  { path: "/blog", priority: 0.7, changefreq: "weekly" },
  ...BLOG_SLUGS.map((slug) => ({ path: `/blog/${slug}`, priority: 0.6, changefreq: "monthly" })),
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
