# Insights posts

Every file in this folder ending in `.md` is a post on https://devedge.com.au/insights (the old /blog URLs 301 there).
The file name is the URL: `crm-vs-spreadsheets.md` is published at `/insights/crm-vs-spreadsheets`.
Files starting with `_` (like `_template.md`) and this README are ignored.

To add a post, copy `_template.md`, rename it, fill in the frontmatter and write the
post in Markdown. `pnpm dev` shows it at once (drafts included). `pnpm build` adds it to
the pre-rendered pages, the sitemap and the structured data, and stops with a clear error
if the frontmatter is wrong.

## Frontmatter

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Page heading, `<title>` (with " \| DevEdge Insights"), `headline` in schema |
| `description` | yes | Meta description, the excerpt on /insights, schema description. Aim for 140–160 characters. |
| `date` | yes | Published date, `YYYY-MM-DD`. Posts are listed newest first. |
| `updated` | no | Date of the last real update, `YYYY-MM-DD`. Shown as "Updated …" and used for `dateModified` and the sitemap. |
| `category` | no | One of `CRM & ERP`, `Apps`, `Websites`, `Paid Media`, `SEO`, `Tracking`. Sent as `articleSection` in schema. |
| `author` | no | Defaults to Nathan Anniss. |
| `readTime` | no | e.g. `6 min read`. Worked out from the word count (230 words a minute) if left out. |
| `draft` | no | `true` keeps the post off the live site (no page, not in the sitemap). It still shows in `pnpm dev`. |
| `slug` | no | Overrides the URL if it must differ from the file name. Lowercase words joined by hyphens. |
| `takeaway` | no | A dark panel with the post's answer in big type: `headline` (wrap words in `*stars*` to colour them), optional `answer`, optional `label` (defaults to "The short answer"). |
| `flow` | no | A simple process picture: 2 to 5 `steps`, each a short `label` and `text`, plus an optional `caption`. The last step is highlighted. |
| `tool` | no | Makes this the how-to guide for a Free Tool: the slug of `/tools/<slug>`, e.g. `utm-builder`. The post gets a "Try the free tool" card near the top, and the tool page links back with "Read the full guide". |
| `beforeAfter` | no | The messy "now" next to the tidy result: `before` and `after`, each with `items` and a `caption`. A before item starting with `note:` is drawn as a sticky note. |

## Artwork and visual blocks

Every post automatically gets its own block-stack artwork at the top (and as its thumbnail
on /insights). It's generated from the URL, so there's nothing to set.

The three optional blocks above are for when a picture says it better than a paragraph.
Keep them plain English: the readers are business owners, not developers. By default the
takeaway sits at the top of the post and the others go just before the first `##` heading.
To place one somewhere else, put `{{takeaway}}`, `{{flow}}` or `{{before-after}}` on a line
of its own in the text. See `zoho-one-vs-zoho-crm.md`, `automated-workflow-software-logistics.md`
and `signs-you-have-outgrown-spreadsheets.md` for one of each.

## Writing

- Standard Markdown: `## Heading`, `**bold**`, `- lists`, `> quotes`, `[links](/services/seo)`.
  Start sections at `##`; the title is already the page's `#`.
- Link to other pages on the site with a path (`/services/crm-erp-systems`), not the full URL.
  Links to other sites open in a new tab automatically.
- No prices or price ranges, ever (see ROADMAP.md).
- Never rename a published post's file: that changes its URL. If a URL has to change,
  add the old slug to `client/src/data/blogRedirects.ts` so it 301s to the new one.
