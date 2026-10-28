# DevEdge Website — Roadmap

_Audit date: 28 Oct 2026 · Owner: Nathan_

Four focuses: **SEO & Keywords**, **Re-Design**, **Marketing**, **Portal Access**.
Priorities: **P0** = blocking / do first · **P1** = high impact · **P2** = worthwhile later.
Every visual task follows `devedge-brand-guidelines-v2.pdf`. Only use the new brand (DE mark, DEVEDGE wordmark).

---

## What the audit found

1. **Most pages can't be reached from the home page.** It has no header nav and no footer. The 9-slide snap-scroll links only to the contact modal. Projects, the 6 service pages, the blog and the portal are effectively orphaned. Visitors can't find them, and neither can Google, because no links point to them.
2. **Google sees the homepage on every URL.** The site is a client-rendered single-page app. Before JavaScript runs, every route serves the same HTML: the homepage title and `<link rel="canonical" href="https://devedge.com.au/">`. That tells Google every page is a duplicate of the homepage.
3. **Unknown URLs return HTTP 200 (soft 404s).** The 404 page looks right, but the status code is wrong.
4. **There are no analytics.** No GA4 or Plausible, and no form-conversion tracking. SEO and marketing results can't be measured.
5. **The blog content is thin and off-target.** There are 5 posts of roughly 150–300 words each, labelled as "6–7 min reads" and credited to an "Engineering Team" instead of a named author. Two target healthcare and logistics, which aren't backed by any DevEdge work. The real proof is in trade/building businesses, Zoho and SaaS.
6. **The sitemap is missing `/projects`**, and `robots.txt` doesn't block `/admin` or `/portal`.
7. **The portal can only be reached by typing `/portal/login`.** Its one link is in a footer that no page renders.
8. **There's no About page**, even though the guidelines' content architecture requires one ("The Person — Nathan"). `/#about` jumps to a slide.
9. **The work page has only 2 projects**, while testimonials name 4 clients (DeckMate, Tennantly, Woodhouse, TPD Timber). Several other client sites run on the same server (Kim Hilton Studio, Lockd75, NLB Built).
10. **Performance:** the JavaScript bundle is 788KB, and every visitor downloads all the portal and admin code.
11. **The LinkedIn link uses the old name** (`/company/devedge-solutions`) in the structured data.

---

## 1. SEO & Keywords

### Keyword strategy (Australia-wide)

Lead with the niches where DevEdge has real proof. They have less competition and better-qualified leads than generic "software development" terms.

| Cluster | Primary keywords | Landing page |
|---|---|---|
| **Custom software (core)** | custom software development australia · bespoke software developer · custom web application development · web app developer australia | Home + `/services/custom-development` |
| **Zoho** (proven: DeckMate) | zoho developer australia · zoho crm integration · zoho consultant australia · zoho creator developer · zoho automation | New `/services/zoho-integration` |
| **Trade & building businesses** (proven: Tradeflow, DeckMate, TPD, Woodhouse) | software for trade businesses · quoting software for tradies · building supplies quoting system · custom CRM for builders · deck / product calculator for website | New industry page `/industries/trade-and-construction` |
| **Automation** | business process automation australia · workflow automation for small business · automate quotes and invoices | `/services/process-automation` |
| **Integrations** | xero integration developer · api integration services australia · connect crm to website | `/services/system-integration` |
| **Commercial intent / cost** | how much does custom software cost australia · custom web app cost · MVP development cost · custom software vs off the shelf | Blog pillar posts + cost estimator |
| **SaaS builds** (proven: Tennantly, Tradeflow) | saas development australia · build a saas mvp · saas developer for startups | `/services/web-platform` |

Map one primary keyword to each page. Use it in the title, H1, URL, first paragraph and meta description. Two pages should never compete for the same keyword.

### P0 — Technical foundations
- [ ] **Pre-render every marketing route to static HTML at build time** (Home, Services ×N, Projects, case studies, About, Blog, posts). Use `vite-react-ssg` or a headless-Chrome prerender step, and have Express serve the pre-rendered file before the SPA fallback. This is the biggest single SEO fix.
- [ ] **Give each URL its own `<title>`, meta description, canonical and OG tags in the served HTML**, and remove the hard-coded homepage canonical from `index.html`.
- [ ] **Return a real 404 status for unknown routes.** Express should check paths against the known route list.
- [ ] **Add analytics:** GA4 (or Plausible for privacy and simplicity) with conversion events for contact-form submit, phone and email clicks, and "Start a project" clicks. Link GA4 to Search Console.
- [ ] **Sitemap:** generate it from the route list at build time with accurate `lastmod`. Add `/projects` and every new page. Resubmit in Search Console.
- [ ] **robots.txt:** `Disallow: /admin`, `/portal`, `/api`. Add `noindex` to the portal and admin pages.
- [ ] **Search Console:** after the above ships, review the Page indexing report, request indexing for key pages and fix any "Duplicate without user-selected canonical" errors.

### P1 — On-page & structured data
- [ ] Rewrite titles and meta descriptions per page from the keyword map, with titles around 60 characters and descriptions around 155.
- [ ] Use exactly one H1 per page and a logical H2/H3 structure.
- [ ] **Structured data:**
  - `Organization` + `ProfessionalService` with `areaServed: AU`, the logo and the corrected LinkedIn URL
  - `Service` on each service page
  - `BlogPosting` with Nathan as a `Person` author on posts
  - `BreadcrumbList` sitewide
  - `FAQPage` for the FAQ section
- [ ] **Internal linking:** home → services, home → case studies, services ↔ related case studies ↔ related posts. Every post links to a service page and a CTA.
- [ ] Remove the `meta keywords` tag (search engines ignore it) and `maximum-scale=1` from the viewport tag (accessibility).
- [ ] **Performance:** lazy-load the portal and admin routes, aim for under 250KB of JavaScript on marketing pages, self-host or `preload` fonts, and check Core Web Vitals in PageSpeed Insights (target LCP < 2.5s, CLS < 0.1).
- [ ] Add `llms.txt` and a plain-language "About DevEdge" summary so AI answer engines (ChatGPT, Perplexity, Google AI Overviews) describe DevEdge correctly.

### P1 — Blog plan
**Rules:** posts are credited to **Nathan Anniss** with a short bio and photo (this builds E-E-A-T: experience, expertise, authority and trust). Each post is 1,200–2,000 words, uses real numbers from real projects, targets one keyword, and ends with one CTA. Publish **2 posts a month**.

- [ ] **Fix the existing posts:**
  - Expand "Custom vs Off-the-Shelf" and "Mobile App Cost" into proper pillar posts.
  - Rework the healthcare and logistics posts toward trade and building, or delete them and 301-redirect their URLs.
  - Make read times accurate.
  - Replace the team bylines with Nathan.
- [ ] **Pillar posts** (long, linked from service pages):
  1. How Much Does Custom Software Cost in Australia? (2026 Pricing Guide)
  2. Custom Software vs Off-the-Shelf: An Honest Guide for Australian Businesses
  3. Zoho CRM Integration: What's Possible and What It Costs
- [ ] **Cluster posts** (each links back to a pillar):
  - Quoting Software for Trade Businesses: Spreadsheets vs Custom vs SaaS
  - How DeckMate Automated Its Sales Pipeline with Zoho (case-study post)
  - 7 Signs Your Business Has Outgrown Spreadsheets
  - Building a Product Calculator for Your Website: Costs, Options, Examples
  - Xero + Your Website: Automating Quotes, Invoices and Orders
  - What an MVP Actually Is (and What Yours Should Cost)
  - How to Brief a Developer So You Get What You Actually Need
  - Zoho Creator vs Custom Build: When to Switch
  - Supplier Price List Management for Building Supply Businesses (ties to Tradeflow)
  - Fixed-Price vs Hourly Software Projects: What Australian SMBs Should Know
- [ ] Move blog content out of `BlogPost.tsx` into Markdown/MDX files so new posts don't require code changes.
- [ ] Add a blog index with categories (Software · Zoho · Automation · Industry) and an email signup.

### P1 — Off-site & local
- [ ] **Google Business Profile** (set up as a service-area business, Australia):
  - Fill every field and list all services with descriptions.
  - Add photos in the new branding.
  - Post weekly (repurpose blog and LinkedIn posts).
  - **Ask every past client for a Google review.**
- [ ] **Backlinks from client sites:** add "Built by DevEdge" footer links on DeckMate, Tradeflow, Kim Hilton Studio, Lockd75 and NLB Built (all on your own server). This is the quickest backlink win available.
- [ ] Listings on Clutch, GoodFirms, DesignRush, TrueLocal, Hotfrog and Yellow Pages, plus the Zoho Partner directory if eligible. Keep the name, phone and URL identical everywhere.
- [ ] Ask testimonial clients for permission to publish named case studies and link back.

---

## 2. Re-Design

**Goal:** replace the full-screen "slideshow" with a modern long-scroll marketing site that has a real navigation structure, while staying within the guidelines' motion rules: *purposeful, never decorative*. The animated code-block hero is the one signature animation. "More advanced" should come from interactivity and real proof, not more motion.

### P0 — Structure
- [ ] **Shared site layout** (header + footer) on every marketing page, including Home.
  - Header: logo · Services (dropdown) · Work · About · Insights (blog) · **Client Login** · **Start a Project** (primary Ember button).
  - Footer: services, case studies, latest posts, contact details, socials, Client Portal, ABN and legal links.
- [ ] **Rebuild Home as a long-scroll page** following the guidelines' content architecture:
  1. **Hero:** headline, subhead, primary CTA and the animated code block (keep).
  2. **Position:** one paragraph on what makes DevEdge different.
  3. **What we build:** 3–4 service tiles linking to the service pages.
  4. **Selected work:** 2–3 outcome-first case study cards linking to case studies. **This fixes "can't find the projects".**
  5. **Testimonials**, 6. **How we work** (3 steps), 7. **FAQ**, 8. **Close CTA**.
  - Drop desktop snap-scroll and the dot navigation, and use standard scrolling with fade-up on enter (300ms, ease-out).
- [ ] **New pages:**
  - `/about`: the real story, how DevEdge works, Nathan, the 4 values (from the guidelines' content architecture)
  - `/services` index
  - `/contact`, a real page in addition to the modal (better for SEO and sharing)
  - `/industries/trade-and-construction`
  - `/services/zoho-integration`
- [ ] **Case study pages** `/work/<slug>`, using the guidelines' outcome-first format (Problem → What we built → **Outcome with a number**):
  - DeckMate and Tradeflow (have screenshots)
  - Tennantly, Woodhouse, TPD Timber (need client sign-off)
  - Kim Hilton Studio, Lockd75, NLB Built (check whether they belong in the portfolio)

### P1 — "More advanced" (interactive, not decorative)
- [ ] **Project cost estimator:** a few questions (type, integrations, users, timeline) that return a price range and capture the email. It doubles as a lead magnet and supports the "cost" keyword cluster.
- [ ] **Live work showcase:** real UI screenshots or short screen recordings of Tradeflow and the DeckMate calculator, shown in a device frame.
- [ ] **"How your system fits together" diagram:** an interactive diagram showing website → CRM → accounting → automation, with hover states naming the tools (Zoho, Xero, etc.).
- [ ] Result metrics strip with real numbers once case studies supply them (hours saved, quote turnaround).
- [ ] Check the mobile layout at 375px, keyboard navigation and colour contrast (Dust on Obsidian at small sizes).

### P1 — Clean-up during the rebuild
- [ ] Delete the unused components (`Hero`, `About`, `Pricing`, `Features`, `Services`, `Testimonials`, `Workflow`, `FAQ`, `Map`, `Projects`, the old `testimonials.json`) and around 40 unused `ui/*` components and their Radix packages.
- [ ] Replace one-off hex values with the palette tokens from `index.css`.
- [ ] Recolour the portal kanban's "Confirmed" status from blue to a palette tone.

---

## 3. Marketing

### P0 — Foundations
- [ ] Analytics and conversion tracking (shared with SEO P0), plus **UTM links** on every social, email and bio link so each channel's leads are measurable.
- [ ] **Email signature in the new brand** for Nathan and team: DE mark, name, title, phone and site link. The old signature images were removed.
- [ ] **Canva brand kit** with the palette, fonts, logos and templates for LinkedIn posts, carousels, Instagram posts and stories, all matching the guidelines.
- [ ] **Unified profiles:** update the LinkedIn company page, Instagram, Facebook and GBP with the new logo, cover image, "We build things that actually work." and the same description and link. Fix the LinkedIn slug if it's still `devedge-solutions`.

### P1 — LinkedIn (primary channel: B2B buyers are there)
- [ ] **Founder-led posting** from Nathan's personal profile, 3 times a week, with the company page resharing. Content pillars:
  - **Build in public:** Tradeflow features and decisions, behind the scenes on client builds.
  - **Proof:** before/after, "this took X hours a week, now it takes 0".
  - **Honest takes** (brand voice): "When you *shouldn't* build custom software".
  - **Zoho and automation tips:** short, practical posts that rank in LinkedIn search.
- [ ] Turn each blog post into a LinkedIn carousel, an Instagram carousel and a GBP post (one piece of writing becomes 4 assets).
- [ ] Short screen-recorded demos (30–60s) of real builds, such as the DeckMate calculator and Tradeflow quoting.

### P1 — Instagram / Facebook (secondary: visual proof and trust)
- [ ] Post weekly: project reveals, workspace and process, client wins, carousels from blog posts.
- [ ] Pin 3 posts to the profile: Who we are · Selected work · How to start a project.

### P1 — Referrals & partnerships
- [ ] **Client referral offer**, e.g. a credit or discount for each referred project. Email current and past clients.
- [ ] **Review drive:** Google reviews from every client, then reused on the site.
- [ ] **Partners:**
  - Zoho Partner program, if eligible
  - Accountants and bookkeepers (Xero advisors see the automation pain first)
  - Web designers who need a dev and back-end partner
  - Trade and building industry groups (HIA, Master Builders, supplier networks)
- [ ] **Tradeflow cross-promotion:** "Built by DevEdge" in the Tradeflow app and on its site. Tradeflow users are exactly DevEdge's ideal custom-build clients.

### P2 — Growth experiments
- [ ] Monthly email newsletter: one useful post, one project, one offer. Signups come from the blog and the cost estimator.
- [ ] **Google Ads test** (small budget) on high-intent, low-competition terms like "zoho developer australia" and "quoting software for builders", once dedicated landing pages exist.
- [ ] Lead magnet PDF: "Custom vs Off-the-Shelf: a 10-question checklist" (gated download).
- [ ] Speaking or webinars for trade associations: "Automating quotes and orders".

---

## 4. Portal Access

### P0
- [ ] **"Client Login" in the header** on every page (subtle text link, top-right) and **"Client Portal" in the footer**.
- [ ] **Short URLs:** `/login` and `/portal` redirect to `/portal/login` when logged out. Optionally set up `portal.devedge.com.au` (Lets Encrypt cert, nginx server block) for a cleaner URL to hand clients.
- [ ] **Hide the portal from search:** `noindex` on portal and admin pages, plus robots `Disallow`.

### P1
- [ ] **Client onboarding:** put the portal link and a short "How to raise a ticket" guide in the kickoff email and handover doc. Invite emails already link to it.
- [ ] Add a "Client Portal" section to the About page or footer so clients know it exists ("Existing client? Log in to raise and track requests").
- [ ] **Branded login page:** check that the login, reset and accept-invite pages fully match the new brand (logo already updated).

### P2 — Portal hardening (follow-ups from the security audit)
- [ ] Shorter login tokens (e.g. 1 day) with refresh, so removed users and password resets take effect immediately.
- [ ] Move the token from `localStorage` to an httpOnly cookie.
- [ ] Reboot the server for its pending security updates (all 4 sites go down briefly).

---

## Suggested order

| Phase | Weeks | Focus |
|---|---|---|
| **1 — Fix the foundations** | 1–2 | Analytics · Client Login link · shared header and footer on Home · robots/noindex · sitemap fix · email signature · profile refresh |
| **2 — Rebuild for search** | 3–5 | Pre-rendering + per-page meta + real 404s · Home long-scroll rebuild · About, Services index, Contact pages · case study pages · structured data |
| **3 — Content engine** | 6+ (ongoing) | 2 posts a month (pillars first) · LinkedIn 3×/week · GBP weekly · reviews and backlinks · Zoho and trade landing pages |
| **4 — Advanced & growth** | 8+ | Cost estimator · interactive system diagram · newsletter · Ads test · partnerships |

## Open questions for Nathan
- [ ] Which clients approve **named** case studies and logos? (Tennantly, Woodhouse, TPD Timber, Kim Hilton Studio, Lockd75, NLB Built)
- [ ] Is DevEdge a Zoho Partner, or eligible to become one?
- [ ] What's the exact LinkedIn company page URL?
- [ ] Will you write the posts yourself, or should Claude draft them in your voice for you to edit?
- [ ] Is there a monthly budget for ads or paid tools?
- [ ] Do you want an ABN, privacy policy and terms pages? (They build trust and are needed for Ads.)
