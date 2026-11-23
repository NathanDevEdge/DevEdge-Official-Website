# Free Tools

Every folder here is one free tool on https://devedge.com.au/tools. Each tool gets:

| URL | What it is |
| --- | --- |
| `/tools` | The hub: newest tools, every category, embed explainer, "email me new tools" signup |
| `/tools/category/<category>` | One page per category (`marketing`, `business-finance`, `trade-installer`) |
| `/tools/<slug>` | The tool, how it works, FAQ, embed code, related tools and a soft CTA |
| `/embed/<slug>` | The bare tool for iframes on other sites. `noindex`, not in the sitemap, frameable anywhere |

Tool URLs stay flat, so a tool can change category without its URL or backlinks changing.

## Adding a tool

1. Make a folder named after the slug: `client/src/tools/<slug>/`.
2. Add `index.tsx` that default-exports `defineTool({...})` (see `types.ts` for every field, and
   `utm-builder/` for a full example). Nothing else to register: the list in `index.ts` finds it,
   and routes, pre-render, sitemap, schema (WebApplication, FAQPage, BreadcrumbList), the hub and
   the category pages all follow.
3. Write its how-to post in `content/blog/` with `tool: <slug>` in the frontmatter. The post gets a
   "Try the free tool" card near the top and the tool page links back with "Read the full guide".
   The post targets the question people search ("how to track links in google analytics"); the
   tool page targets the tool search ("utm builder"). Don't let them compete.
4. `pnpm dev`, check `/tools/<slug>` and `/embed/<slug>?theme=dark&accent=2563eb`, then `pnpm build`.

`draft: true` keeps a tool off the live site (it still shows in `pnpm dev`).

## Rules for the tool component

- **Theme tokens only**: `bg-background`, `bg-card`, `bg-secondary`, `text-foreground`,
  `text-muted-foreground`, `text-primary`, `bg-primary`, `text-primary-foreground`, `border-border`,
  `ring-ring`. No hex colours like `#C97B3A`: the embed's light/dark and accent-colour options work
  by swapping those tokens.
- **No page chrome**: no `Navigation`, `Footer`, `SEO` or hero inside the component. It gets
  `{ embedded }`; when `embedded` is true, hide anything that only makes sense on devedge.com.au.
- **Works without sign-up**, on a phone, with the keyboard, and only from numbers the user enters.
- **No DevEdge prices**, ever (ROADMAP.md).
- Resizing inside an iframe is handled by `/embed`; the tool needs nothing for it.
- Keep it in the browser unless it truly needs a server. Nothing the user types is sent anywhere.

## The About text

600 to 1,000 words under the tool, plain `h2`/`h3`/`p`/`ul`/`ol`/`table`: how to use it, the formula
or assumptions, a worked example. Plain English for business owners. It's what makes the page rank.
Link other pages with plain `<a href="/services/...">` (they route without a reload).

## Embeds and backlinks

The embed code is an iframe of `/embed/<slug>` plus one plain, visible link under it (the tool's
`linkText`, e.g. "UTM link builder by DevEdge"), because a link inside an iframe doesn't count for
the host site. Keep that link honest: tool name plus DevEdge, no keyword stuffing (Google's spam policy
calls out keyword-rich widget links). An optional one-line script lets the iframe resize itself.

Each embed load sends one cookieless GA4 event, `tool_embed_view`, with `tool` and `embed_host`.
Copying the code sends `tool_embed_copy`, and the signup sends `tools_signup`.

The live nginx config must not add `X-Frame-Options` to `/embed/` (see the `location /embed/` block in
`nginx.conf`), or embeds show as blank boxes on other sites.
