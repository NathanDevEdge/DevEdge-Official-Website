// Vite plugin: reads blog posts from content/blog/*.md and serves them to the app as the
// "virtual:blog-posts" module. Markdown is turned into HTML here, at build time, so no
// Markdown parser ships to the browser. A post with bad frontmatter fails the build.
import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import { parse as parseYaml } from "yaml";
import type { Plugin } from "vite";
import { BLOG_CATEGORIES, type BlogPost } from "../shared/blog";
import { LEGACY_BLOG_REDIRECTS } from "../client/src/data/blogRedirects";

const VIRTUAL_ID = "virtual:blog-posts";
const RESOLVED_ID = "\0" + VIRTUAL_ID;
const DEFAULT_AUTHOR = "Nathan Anniss";
const WORDS_PER_MINUTE = 230;
const SITE_HOST = "devedge.com.au";

const markdown = new Marked({
  gfm: true,
  renderer: {
    // Links to other sites open in a new tab; links within the site stay as they are
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      const external = /^https?:\/\//.test(href) && !new URL(href).hostname.endsWith(SITE_HOST);
      const extra = external ? ` target="_blank" rel="noopener noreferrer"` : "";
      return `<a href="${escapeAttr(href)}"${titleAttr}${extra}>${text}</a>`;
    },
  },
});

function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Splits "---\nyaml\n---\nbody" into its two parts */
function splitFrontmatter(raw: string, file: string) {
  const match = raw.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: must start with a --- frontmatter block`);
  return { data: (parseYaml(match[1]) ?? {}) as Record<string, unknown>, body: match[2] };
}

function asDate(value: unknown, field: string, file: string, required: boolean): string | undefined {
  if (value == null || value === "") {
    if (required) throw new Error(`${file}: "${field}" is required (YYYY-MM-DD)`);
    return undefined;
  }
  const s = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  if (!ISO_DATE.test(s) || Number.isNaN(Date.parse(s))) {
    throw new Error(`${file}: "${field}" must be a date like 2026-10-29, got "${s}"`);
  }
  return s;
}

function asText(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${file}: "${field}" is required`);
  return value.trim();
}

// ── Loading ───────────────────────────────────────────────────────────────────
export function loadPosts(dir: string, { includeDrafts }: { includeDrafts: boolean }): BlogPost[] {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md") : [];
  const posts: BlogPost[] = [];
  const seen = new Map<string, string>();

  for (const name of files) {
    const file = `content/blog/${name}`;
    const { data, body } = splitFrontmatter(fs.readFileSync(path.join(dir, name), "utf8"), file);

    const slug = data.slug == null ? name.replace(/\.md$/, "") : String(data.slug);
    if (!SLUG.test(slug)) throw new Error(`${file}: slug "${slug}" must be lowercase words joined by hyphens`);
    if (seen.has(slug)) throw new Error(`${file}: slug "${slug}" is already used by ${seen.get(slug)}`);
    if (slug in LEGACY_BLOG_REDIRECTS) {
      throw new Error(`${file}: slug "${slug}" is a retired URL that redirects elsewhere (client/src/data/blogRedirects.ts)`);
    }
    seen.set(slug, file);

    const category = data.category == null ? undefined : String(data.category);
    if (category && !(BLOG_CATEGORIES as readonly string[]).includes(category)) {
      throw new Error(`${file}: category must be one of ${BLOG_CATEGORIES.join(", ")}`);
    }
    if (data.draft != null && typeof data.draft !== "boolean") throw new Error(`${file}: "draft" must be true or false`);

    const date = asDate(data.date, "date", file, true)!;
    const updated = asDate(data.updated, "updated", file, false);
    if (updated && updated < date) throw new Error(`${file}: "updated" is before "date"`);

    const words = body.replace(/[#>*_`[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
    const post: BlogPost = {
      slug,
      title: asText(data.title, "title", file),
      description: asText(data.description, "description", file),
      date,
      updated,
      author: data.author == null ? DEFAULT_AUTHOR : asText(data.author, "author", file),
      readTime: data.readTime == null ? `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read` : String(data.readTime),
      category: category as BlogPost["category"],
      draft: data.draft === true,
      html: markdown.parse(body, { async: false }) as string,
    };
    if (post.draft && !includeDrafts) continue;
    posts.push(post);
  }

  // Newest first; same-day posts keep a stable, alphabetical order
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export default function blogPlugin(contentDir: string): Plugin {
  let includeDrafts = false;
  return {
    name: "devedge-blog",
    configResolved(config) {
      includeDrafts = config.command === "serve";
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      this.addWatchFile(contentDir);
      return `export default ${JSON.stringify(loadPosts(contentDir, { includeDrafts }))};`;
    },
    configureServer(server) {
      // Editing, adding or removing a post reloads the page in dev
      server.watcher.add(contentDir);
      const reload = (file: string) => {
        if (!file.startsWith(contentDir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("change", reload);
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
  };
}
