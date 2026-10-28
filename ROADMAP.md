# DevEdge Website — Roadmap

_Audit date: 28 Oct 2026 · Owner: Nathan_

Four focuses: **SEO & Keywords**, **Re-Design**, **Marketing**, **Portal Access**.
Priorities: **P0** = blocking / do first · **P1** = high impact · **P2** = worthwhile later.
Every visual task follows `devedge-brand-guidelines-v2.pdf`. Only use the new brand (DE mark, DEVEDGE wordmark).

---

## Services (decided 28 Oct 2026)

DevEdge is **one brand and one team**. The services are designed to complement each other: build the website and systems, then bring the customers in and track every one. "Build" and "Grow" are only **light grouping labels** for the service list. They are **not separate divisions, brands, hubs or sub-sites.** Same brand guidelines, logo and voice everywhere, on one site and one domain.

**Positioning:** *We build the systems and bring the customers.* Ads → website → CRM → tracked sale, all with one team. Ad agencies can't fix the website, tracking or CRM, and dev shops can't fill it with customers. DevEdge does both and can prove which ad produced which customer.
**Taglines:** Build: *"We build things that actually work."* · Grow: *"Marketing that actually works."*
**Audience:** any Australian SMB. Most proof comes from trade, building and supply businesses, so case studies naturally lean that way.

### Build it
| # | Service | What it covers | Proof |
|---|---|---|---|
| 1 | **Websites** | Fast, premium business websites built to turn visitors into enquiries (Next.js / WordPress), with SEO from day one. | Kim Hilton Studio, Lockd75, NLB Built, WoodEvo, Lumeboard, Woodhouse |
| 2 | **Web & Mobile Apps** | Custom software for how a business actually works: calculators, ordering and quoting systems, client portals, SaaS products, MVPs. | DeckMate, Tennantly, Tradeflow |
| 3 | **CRM & ERP Systems** | Setting up, cleaning up, customising, integrating and automating the systems a business runs on: CRM, inventory, quoting, purchasing, accounting (Zoho, Xero, HubSpot and others), or a custom-built system when off-the-shelf doesn't fit. Includes internal tools such as approval and file portals. | DeckMate (Zoho CRM), TPD Timber (Zoho Inventory), WoodEvo (file portal), Tradeflow (an ERP DevEdge built) |
| 4 | **Care & Hosting** | Ongoing hosting, security updates, backups, fixes and small changes after launch. | ~5 client sites already hosted |

### Grow it
| # | Service | What it covers | Proof |
|---|---|---|---|
| 5 | **Paid Media Management** | Full management of Meta (Facebook / Instagram) and Google Ads: strategy, audiences, budgets, **ad creative production**, testing and ongoing optimisation. | WoodEvo Meta ads (strong results; can be named publicly **after December 2026**) |
| 6 | **SEO** | Ongoing SEO for clients: technical fixes, keyword strategy, content, local / Google Business Profile, reporting. | DevEdge's own site once it ranks (use it as the live case study) |
| 7 | **Tracking & Reporting** | Meta Pixel + Conversions API, GA4, Google Ads conversion tracking, CRM attribution, dashboards and monthly performance reports. It connects Build and Grow. | WoodEvo; any Build client with CRM integration |

**Product:** **Tradeflow** is shown as a DevEdge product ("Built by DevEdge"): quoting, purchase orders and supplier management for small businesses.

**Retired:** Cloud Migration and standalone UI/UX Design (design is part of every build).

**Pricing rule:** **no fixed prices or price ranges anywhere on the site or blog.** Projects vary too much. Everything is quoted per project after a scoping conversation. Content about cost explains *what drives cost*, not dollar figures.

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

Built around the four services. **CRM & ERP Systems** is the main niche to own: there's high buying intent, fewer specialist competitors than "web design", and real proof behind it (Zoho work plus Tradeflow, an ERP DevEdge built).

| Cluster | Primary keywords | Landing page |
|---|---|---|
| **CRM & ERP (lead niche)** | crm implementation australia · crm consultant australia · erp for small business australia · custom crm development · custom erp software · crm integration services | `/services/crm-erp-systems` |
| **CRM & ERP: platform-specific** (pages or posts) | zoho crm consultant · zoho inventory setup · zoho integration · hubspot crm setup · xero integration developer · odoo implementation australia | Sub-sections / posts linked from the CRM & ERP page |
| **CRM & ERP: automation** | business process automation australia · workflow automation small business · automate quotes and purchase orders · connect crm to website | `/services/crm-erp-systems` + posts |
| **Web & Mobile Apps** | custom software development australia · custom web app developer · saas development australia · mvp development · custom mobile app development | `/services/web-and-mobile-apps` |
| **Websites** | website design australia small business · next.js web developer · business website that converts · wordpress developer australia | `/services/websites` |
| **Care & Hosting** | website maintenance australia · website care plan · managed website hosting australia | `/services/care-and-hosting` |
| **Tradeflow (product)** | quoting software small business · purchase order software australia · supplier price list software · erp for tradies | Tradeflow's own site + `/products/tradeflow` on DevEdge |
| **Grow: Paid media** | meta ads agency australia · facebook ads management · instagram ads agency · google ads management australia · paid social agency · ad creative agency | `/services/paid-media` |
| **Grow: SEO** | seo services australia · seo for small business · local seo australia · technical seo audit | `/services/seo` |
| **Grow: Tracking** | meta conversions api setup · facebook pixel setup · ga4 setup · conversion tracking for small business · marketing reporting dashboard | `/services/tracking-and-reporting` |
| **Decision / cost-intent** (no prices) | custom software vs off the shelf · crm vs spreadsheets · what affects software development cost · when to replace your crm · erp vs separate apps | Blog pillars |

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
  - **Remove every dollar figure.** The mobile-app post currently lists "$20k–$50k / $50k–$120k / $150k+" brackets, and the custom-vs-off-the-shelf post says "under $20k". Rewrite them around what drives cost.
  - Expand "Custom vs Off-the-Shelf" into a proper pillar post.
  - Rework the healthcare and logistics posts toward CRM/ERP and real client work, or delete them and 301-redirect their URLs.
  - Make read times accurate.
  - Replace the team bylines with Nathan.
- [ ] **Pillar posts** (long, linked from service pages, no prices):
  1. CRM vs ERP vs Spreadsheets: What Your Business Actually Needs
  2. Custom Software vs Off-the-Shelf: An Honest Guide for Australian Businesses
  3. What Actually Drives the Cost of a Software Project (and How to Keep It Under Control)
- [ ] **Cluster posts** (each links back to a pillar):
  - 7 Signs Your Business Has Outgrown Spreadsheets
  - How to Choose a CRM for a Small Business in Australia
  - Zoho vs HubSpot vs a Custom CRM: An Honest Comparison
  - Cleaning Up a Messy CRM or Inventory System: What's Involved (TPD Timber case study)
  - How DeckMate Connected Its Website, Calculator and Zoho CRM (case-study post)
  - Connecting Your CRM to Xero, Your Website and Your Inbox
  - Quoting and Purchase Orders: When to Move Off Spreadsheets (ties to Tradeflow)
  - When to Build a Custom ERP Instead of Bending an Off-the-Shelf One
  - What an MVP Actually Is (and How to Scope One)
  - How to Brief a Developer So You Get What You Actually Need
  - Website Care Plans: What Happens After Launch
  - **Grow cluster:**
    - Why Your Meta Ads Stopped Working (and the Tracking Fix Most Agencies Miss)
    - Meta Conversions API: What It Is and Why Every Advertiser Needs It
    - Meta Ads vs Google Ads for Australian Small Businesses
    - Ad Creative That Converts: What We Test First
    - From Ad Click to Paid Invoice: Connecting Ads, Website and CRM
    - How We Grew WoodEvo with Meta Ads (publish **after December 2026**, with permission)
- [ ] Move blog content out of `BlogPost.tsx` into Markdown/MDX files so new posts don't require code changes.
- [ ] Add a blog index with categories (CRM & ERP · Apps · Websites · Paid Media · SEO · Tracking) and an email signup.

### P1 — Off-site & local
- [ ] **Google Business Profile** (set up as a service-area business, Australia):
  - Fill every field and list all services with descriptions.
  - Add photos in the new branding.
  - Post weekly (repurpose blog and LinkedIn posts).
  - **Ask every past client for a Google review.**
- [ ] **Backlinks from client sites:** add "Built by DevEdge" footer links on DeckMate, Tradeflow, Kim Hilton Studio, Lockd75 and NLB Built (all on your own server). This is the quickest backlink win available.
- [ ] Listings on Clutch, GoodFirms, DesignRush, TrueLocal, Hotfrog and Yellow Pages, plus the Zoho Partner directory if eligible. Keep the name, phone and URL identical everywhere.
- [ ] Ask testimonial clients for permission to publish named case studies and link back.
- [ ] Partner and certification listings for the CRM/ERP platforms you implement (Zoho Partner, HubSpot Solutions Directory, Xero App Partner / advisor directories) where eligible. They bring high-intent backlinks and referrals.

---

## 2. Re-Design

**Goal:** replace the full-screen "slideshow" with a modern long-scroll marketing site that has a real navigation structure, while staying within the guidelines' motion rules: *purposeful, never decorative*. The animated code-block hero is the one signature animation. "More advanced" should come from interactivity and real proof, not more motion.

### P0 — Structure
- [ ] **Shared site layout** (header + footer) on every marketing page, including Home.
  - Header: logo · **Services** (one mega-menu: two columns, "Build it" and "Grow it") · Work · About · Insights (blog) · **Client Login** · **Start a Project** (primary Ember button).
  - Footer: services, case studies, latest posts, contact details, socials, Client Portal, ABN and legal links.
- [ ] **Rebuild Home as a long-scroll page** following the guidelines' content architecture:
  1. **Hero:** headline, subhead, primary CTA and the animated code block (keep).
  2. **Position:** one paragraph on what makes DevEdge different.
  3. **What we do:** one services section showing the services as a **connected journey**, not two departments: Website → Systems (CRM & ERP, apps) → Customers (paid media, SEO) → Proof (tracking & reporting) → Care. Each step links to its service page. Add a Tradeflow product strip.
  4. **Selected work:** 2–3 outcome-first case study cards linking to case studies. **This fixes "can't find the projects".**
  5. **Testimonials**, 6. **How we work** (3 steps), 7. **FAQ**, 8. **Close CTA**.
  - Drop desktop snap-scroll and the dot navigation, and use standard scrolling with fade-up on enter (300ms, ease-out).
- [ ] **`/services` overview page:** all 7 services on one page in the same journey order, with a short "how they work together" section. No separate Build / Grow hub pages.
- [ ] **Grow service pages:** `/services/paid-media`, `/services/seo`, `/services/tracking-and-reporting`.
- [ ] **Replace the 6 old service pages with the 4 new Build ones**, and 301-redirect the old URLs:
  - `/services/websites` ← web-platform
  - `/services/web-and-mobile-apps` ← custom-development, mobile-apps
  - `/services/crm-erp-systems` ← system-integration, process-automation
  - `/services/care-and-hosting` (new)
  - cloud-migration → `/services`
- [ ] **Contact form:** replace the dropdown with "What do you need help with?", a multi-select of the 7 services plus "Not sure yet". Leads are tagged by service without forcing a Build / Grow choice.
- [ ] **Remove "Software & Systems"** from the home hero eyebrow (`Slide01Hero.tsx`), the footer, and the eyebrow on `og-image.jpg`, since it no longer describes DevEdge. Re-render the OG image.
- [ ] **Make the service list consistent everywhere:** home tiles, nav dropdown, footer, contact-form dropdown (currently 5 different options), FAQ and structured data.
- [ ] **New pages:**
  - `/about`: the real story, how DevEdge works, Nathan, the 4 values (from the guidelines' content architecture)
  - `/services` index
  - `/contact`, a real page in addition to the modal (better for SEO and sharing)
  - `/products/tradeflow`: what it is, who it's for, a link to Tradeflow, "Built by DevEdge"
- [ ] **Pricing wording:** remove any figures, and rewrite the FAQ "How does pricing work?" around per-project quotes after a free scoping call.
- [ ] **Case study pages** `/work/<slug>`, using the guidelines' outcome-first format (Problem → What we built → **Outcome with a number**):
  - DeckMate and Tradeflow (have screenshots)
  - Tennantly, Woodhouse, TPD Timber (need client sign-off)
  - Kim Hilton Studio, Lockd75, NLB Built (check whether they belong in the portfolio)

### P0 — Site structure: homepage & landing pages

One homepage tells the whole DevEdge story. Every other page is either an **SEO page** (indexed, built to rank) or a **campaign landing page** (not indexed, built to convert ad traffic).

```
devedge.com.au/                         Homepage: the one DevEdge story
├── /services                           All 7 services as one connected journey
│   ├── /services/websites
│   ├── /services/web-and-mobile-apps
│   ├── /services/crm-erp-systems
│   ├── /services/care-and-hosting
│   ├── /services/paid-media
│   ├── /services/seo
│   └── /services/tracking-and-reporting
├── /solutions/<use-case>               SEO landing pages for specific needs (template-driven)
├── /work  →  /work/<case-study>        Outcome-first case studies (Build and Grow work together)
├── /products/tradeflow
├── /about · /contact · /insights (blog)
├── /lp/<campaign>                      Paid-ad landing pages (noindex)
└── /portal/login                       Client portal
```

- [ ] **Homepage (one story):**
  1. Hero: one headline, one subhead, CTA, signature code animation
  2. The problem: disconnected tools and agencies that don't talk to each other
  3. What we do: the connected journey (above)
  4. Selected work: case studies that show build + grow together
  5. How we work
  6. Testimonials
  7. FAQ
  8. Close CTA
- [ ] **Service page template:** every service page ends with **"Works best with"**, cross-linking the complementary services (e.g. Paid Media ↔ Tracking & Reporting ↔ Websites; CRM & ERP ↔ Tracking). This reinforces "one team" and helps internal linking for SEO.
- [ ] **SEO landing pages** `/solutions/<use-case>`: one reusable template targeting specific searches that combine services. Each page is unique content, not a copy with a word swapped. For example:
  - `/solutions/crm-for-trade-businesses`
  - `/solutions/quoting-and-purchase-order-system`
  - `/solutions/meta-ads-for-building-product-brands`
  - `/solutions/website-and-ads-for-small-business`
  - `/solutions/connect-website-to-crm`
- [ ] **Campaign landing pages** `/lp/<campaign>`, for DevEdge's own ads:
  - The message matches the ad.
  - One offer, one CTA, minimal nav.
  - Social proof, a short form, full tracking (Pixel + Conversions API + GA4).
  - `noindex`, and left out of the sitemap.
  - Built from one template so a new campaign page takes minutes.
- [ ] **Signature lead offer** that shows the joined-up service: a **free "Website, Ads & CRM Check"**. DevEdge reviews the site, tracking and lead handling, and sends back a short report. It works for both Build and Grow prospects and is the main CTA on campaign pages.

### P1 — "More advanced" (interactive, not decorative)
- [ ] **Project scoping tool** (replaces the cost-estimator idea, with no prices): a few questions (what you need, current tools, users, timeline) that produce a short "project brief" summary the visitor can send straight to DevEdge. It qualifies leads and makes the first call faster.
- [ ] **Live work showcase:** real UI screenshots or short screen recordings of Tradeflow and the DeckMate calculator, shown in a device frame.
- [ ] **"How your system fits together" diagram:** an interactive diagram showing website → CRM → accounting → automation, with hover states naming the tools (Zoho, Xero, etc.).
- [ ] Result metrics strip with real numbers once case studies supply them (hours saved, quote turnaround).
- [ ] Check the mobile layout at 375px, keyboard navigation and colour contrast (Dust on Obsidian at small sizes).

### P1 — Visual design deep-dive (after content is settled)
Nathan wants the site to feel high-end and technical ("fancy, 3D"), as befits a software development studio. Do this once the services, pages and copy are locked, so the design wraps real content.
- [ ] **Design direction session:** collect reference sites, pick 1–2 signature 3D or interactive moments, and decide where they live (hero, services, work).
- [ ] **Reconcile with the brand guidelines.** The motion section currently says "restraint" everywhere except the code-block hero. Either update the guidelines to allow a defined 3D/WebGL layer, or keep 3D to the hero and one other section.
- [ ] **Prototype the 3D options** (React Three Fiber / Three.js or Spline): e.g. a 3D system diagram for CRM & ERP, or a 3D take on the DE mark in the hero.
- [ ] **Performance budget for 3D:** lazy-load WebGL, provide a static fallback on mobile and low-power devices, respect `prefers-reduced-motion`, and keep LCP < 2.5s so SEO doesn't suffer.

### P1 — Clean-up during the rebuild
- [ ] Delete the unused components (`Hero`, `About`, `Pricing`, `Features`, `Services`, `Testimonials`, `Workflow`, `FAQ`, `Map`, `Projects`, the old `testimonials.json`) and around 40 unused `ui/*` components and their Radix packages.
- [ ] Replace one-off hex values with the palette tokens from `index.css`.
- [ ] Recolour the portal kanban's "Confirmed" status from blue to a palette tone.

---

## 3. Marketing

### P0 — Foundations
- [ ] **Run DevEdge's own Meta and Google Ads** (small budget) with full tracking. This is lead generation, a live Grow case study, and proof you use what you sell.
- [ ] Analytics and conversion tracking (shared with SEO P0), plus **UTM links** on every social, email and bio link so each channel's leads are measurable.
- [ ] **Email signature in the new brand** for Nathan and team: DE mark, name, title, phone and site link. The old signature images were removed.
- [ ] **Canva brand kit** with the palette, fonts, logos and templates for LinkedIn posts, carousels, Instagram posts and stories, all matching the guidelines.
- [ ] **Unified profiles:** update the LinkedIn company page, Instagram, Facebook and GBP with the new logo, cover image, "We build things that actually work." and the same description and link. Fix the LinkedIn slug if it's still `devedge-solutions`.

### P1 — LinkedIn (primary channel: B2B buyers are there)
- [ ] **Founder-led posting** from Nathan's personal profile, 3 times a week, with the company page resharing. Content pillars:
  - **Build in public:** Tradeflow features and decisions, behind the scenes on client builds.
  - **Proof:** before/after, "this took X hours a week, now it takes 0".
  - **Honest takes** (brand voice): "When you *shouldn't* build custom software".
  - **CRM, ERP and automation tips:** short, practical posts on fixing messy systems (Zoho, HubSpot, Xero and spreadsheets) that rank in LinkedIn search.
- [ ] Turn each blog post into a LinkedIn carousel, an Instagram carousel and a GBP post (one piece of writing becomes 4 assets).
- [ ] Short screen-recorded demos (30–60s) of real builds, such as the DeckMate calculator and Tradeflow quoting.

### P1 — Instagram / Facebook (secondary: visual proof and trust)
- [ ] Post weekly: project reveals, workspace and process, client wins, carousels from blog posts.
- [ ] Pin 3 posts to the profile: Who we are · Selected work · How to start a project.

### P1 — Referrals & partnerships
- [ ] **Client referral offer**, e.g. a credit or discount for each referred project. Email current and past clients.
- [ ] **Review drive:** Google reviews from every client, then reused on the site.
- [ ] **Partners:**
  - CRM/ERP platform partner programs (Zoho, HubSpot, Xero) where eligible
  - Accountants and bookkeepers (Xero advisors see the automation pain first)
  - Web designers who need a dev and back-end partner
  - Trade and building industry groups (HIA, Master Builders, supplier networks)
- [ ] **Tradeflow cross-promotion:** "Built by DevEdge" in the Tradeflow app and on its site. Tradeflow users are exactly DevEdge's ideal custom-build clients.

### P2 — Growth experiments
- [ ] Monthly email newsletter: one useful post, one project, one offer. Signups come from the blog and the scoping tool.
- [ ] **Google Ads test** (small budget) on high-intent, low-competition terms like "crm implementation australia" and "custom erp software", once dedicated landing pages exist.
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

### P2 — Grow clients in the portal
- [ ] Monthly ad / SEO performance reports available in the client portal (start with a PDF upload per month, later live dashboards).

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
| **3 — Content engine** | 6+ (ongoing) | 2 posts a month (pillars first) · LinkedIn 3×/week · GBP weekly · reviews and backlinks · CRM & ERP content cluster |
| **4 — Advanced & growth** | 8+ | Scoping tool · interactive system diagram · newsletter · Ads test · partnerships |

## Open questions for Nathan
- [ ] Which clients approve **named** case studies and logos? (Tennantly, Woodhouse, TPD Timber, Kim Hilton Studio, Lockd75, NLB Built)
- [ ] Homepage hero headline: keep "We build things that actually work." or broaden it to cover marketing (e.g. "Websites, systems and marketing that actually work.")?
- [ ] WoodEvo: confirm in December 2026 that results can be published, and collect the numbers (cost per lead / purchase, ROAS, spend, period).
- [ ] Grow scope: does Paid Media include landing pages, and which platforms beyond Meta and Google (TikTok, LinkedIn)?
- [ ] Which CRM/ERP platforms do you want to be known for (Zoho, HubSpot, Odoo, Xero, NetSuite…)? Are you a partner with any, or eligible?
- [ ] Care & Hosting: what does the plan include (hosting, updates, backups, hours of changes, SEO reporting)? Shown on the site without prices.
- [ ] Mobile apps: what tech do you build with, and is any past project mobile (Tennantly?)
- [ ] What's the exact LinkedIn company page URL?
- [ ] Will you write the posts yourself, or should Claude draft them in your voice for you to edit?
- [ ] Is there a monthly budget for ads or paid tools?
- [ ] Do you want an ABN, privacy policy and terms pages? (They build trust and are needed for Ads.)
