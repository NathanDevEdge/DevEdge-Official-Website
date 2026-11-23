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

## Writing

- Standard Markdown: `## Heading`, `**bold**`, `- lists`, `> quotes`, `[links](/services/seo)`.
  Start sections at `##`; the title is already the page's `#`.
- Link to other pages on the site with a path (`/services/crm-erp-systems`), not the full URL.
  Links to other sites open in a new tab automatically.
- No prices or price ranges, ever (see ROADMAP.md).
- Never rename a published post's file: that changes its URL. If a URL has to change,
  add the old slug to `client/src/data/blogRedirects.ts` so it 301s to the new one.
