// Pre-renders every public page to static HTML after `vite build`, and writes the sitemap.
// Output: dist/public/__pages/<route>.html (served by server/index.ts) + dist/public/sitemap.xml
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "dist/public");
const pagesDir = path.join(publicDir, "__pages");
const SITE = "https://devedge.com.au";

const { render, PRERENDER_ROUTES } = await import(pathToFileURL(path.join(root, "dist/ssr/entry-server.js")).href);
const template = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");

if (!template.includes("<!--seo-start-->") || !template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--seo-start--> / <!--app-html--> markers");
}

export const fileForRoute = (route) => (route === "/" ? "index" : route.slice(1).replace(/\//g, "__"));

function page(url) {
  const { html, head } = render(url);
  return template
    .replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, head)
    .replace("<!--app-html-->", html);
}

fs.rmSync(pagesDir, { recursive: true, force: true });
fs.mkdirSync(pagesDir, { recursive: true });

for (const { path: route } of PRERENDER_ROUTES) {
  fs.writeFileSync(path.join(pagesDir, `${fileForRoute(route)}.html`), page(route));
}
// Rendered for unknown URLs, served with a real 404 status
fs.writeFileSync(path.join(pagesDir, "404.html"), page("/404"));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PRERENDER_ROUTES.map(
  (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`,
).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

console.log(`✓ Pre-rendered ${PRERENDER_ROUTES.length} pages + 404, sitemap written`);
