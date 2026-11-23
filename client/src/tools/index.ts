// The Free Tools registry. Every folder in client/src/tools/<slug>/ with an index.tsx that
// default-exports defineTool({...}) is picked up here automatically: routes, pre-render,
// sitemap, schema, the hub and category pages all read from this list.
import posts from "virtual:blog-posts";
import type { CategorySlug, ToolDefinition } from "./types";
import { TOOL_CATEGORIES, getCategory } from "./categories";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const modules = import.meta.glob<{ default: ToolDefinition }>("./*/index.tsx", { eager: true });

function validate(tool: ToolDefinition, file: string) {
    const fail = (msg: string) => {
        throw new Error(`${file}: ${msg}`);
    };
    if (!SLUG.test(tool.slug)) fail(`slug "${tool.slug}" must be lowercase words joined by hyphens`);
    if (!file.includes(`/${tool.slug}/`)) fail(`the folder name must match the slug "${tool.slug}"`);
    if (!tool.categories?.length) fail("needs at least one category");
    for (const c of tool.categories) if (!getCategory(c)) fail(`unknown category "${c}"`);
    if (!DATE.test(tool.launched)) fail(`"launched" must be YYYY-MM-DD`);
    if (tool.updated && !DATE.test(tool.updated)) fail(`"updated" must be YYYY-MM-DD`);
    if (!/DevEdge/.test(tool.linkText)) fail(`linkText should name DevEdge, e.g. "${tool.name} by DevEdge"`);
}

const all = Object.entries(modules).map(([file, mod]) => {
    validate(mod.default, file);
    return mod.default;
});

const includeDrafts = import.meta.env.DEV;

/** Live tools, newest first */
export const TOOLS: ToolDefinition[] = all
    .filter((t) => includeDrafts || !t.draft)
    .sort((a, b) => b.launched.localeCompare(a.launched) || a.name.localeCompare(b.name));

const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));
export const getTool = (slug: string) => BY_SLUG.get(slug);
export const toolPath = (slug: string) => `/tools/${slug}`;
export const toolsInCategory = (slug: CategorySlug) => TOOLS.filter((t) => t.categories.includes(slug));
export const primaryCategory = (tool: ToolDefinition) => getCategory(tool.categories[0])!;

/** The how-to post that teaches the job a tool does: the newest post with `tool: <slug>` in its frontmatter */
export const guideFor = (slug: string) => posts.find((p) => p.tool === slug);

/** Up to `n` related tools: the ones the tool names first, then others in the same category */
export function relatedTools(tool: ToolDefinition, n = 3) {
    const named = (tool.related.tools ?? []).map(getTool).filter((t): t is ToolDefinition => !!t);
    const sameCategory = TOOLS.filter((t) => t.slug !== tool.slug && t.categories.some((c) => tool.categories.includes(c)));
    const rest = TOOLS.filter((t) => t.slug !== tool.slug);
    const out: ToolDefinition[] = [];
    for (const t of [...named, ...sameCategory, ...rest]) {
        if (t.slug !== tool.slug && !out.includes(t)) out.push(t);
        if (out.length === n) break;
    }
    return out;
}

/** Last time anything on the hub changed (for the sitemap) */
export const toolsLastUpdated = () => TOOLS.map((t) => t.updated ?? t.launched).sort().at(-1);

export { TOOL_CATEGORIES, getCategory };
export type { ToolDefinition, CategorySlug };
