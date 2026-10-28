// Single source of truth for DevEdge's services.
// Drives the service pages, /services overview, home page, nav, footer and contact form.

export type ServiceGroup = "build" | "grow";

export interface Service {
  slug: string;
  name: string;
  group: ServiceGroup;
  /** One line for tiles, menus and cards */
  short: string;
  /** Big statement under the H1 */
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  /** Opening paragraphs */
  intro: string[];
  /** "Sound familiar?" — the problems this solves */
  signs: string[];
  /** What we actually do */
  deliverables: { title: string; body: string }[];
  /** Approved, real proof only */
  proof?: { client: string; line: string; href?: string }[];
  worksWith: string[];
  faqs: { q: string; a: string }[];
}

export const GROUP_LABELS: Record<ServiceGroup, string> = {
  build: "Build it",
  grow: "Grow it",
};

export const SERVICES: Service[] = [
  {
    slug: "websites",
    name: "Websites",
    group: "build",
    short: "Fast, premium websites built to turn visitors into enquiries.",
    tagline: "A website that brings in work, not just one that looks nice.",
    seoTitle: "Website Design & Development Australia | DevEdge",
    seoDescription:
      "Fast, premium business websites for Australian businesses: designed to convert, built to rank, and connected to your CRM and tracking from day one.",
    intro: [
      "Most small business websites look fine and do nothing. They load slowly, they don't show up on Google, and when someone does fill in the form, the lead disappears into an inbox.",
      "We build websites that do a job. Fast, clear and premium, with SEO set up from the start, tracking that tells you where every enquiry came from, and forms that drop straight into your CRM. Then we stick around to keep it running.",
    ],
    signs: [
      "Your website hasn't brought in a real enquiry in months.",
      "It's slow on mobile, or looks dated next to your competitors.",
      "You can't tell which enquiries came from the website, Google or ads.",
      "Making a simple change means waiting on someone else or paying for every edit.",
    ],
    deliverables: [
      { title: "Strategy & structure", body: "We work out who the site is for, what they need to see, and the one action you want them to take. Then we plan every page around that." },
      { title: "Design in your brand", body: "A premium look that matches your brand and feels like you. No templates that look like everyone else's." },
      { title: "Fast, modern build", body: "Built on whatever tech fits the job, tuned for speed on phones and easy for you to update." },
      { title: "SEO from day one", body: "Clean structure, page titles, metadata, structured data, sitemaps and Google Search Console set up properly before launch." },
      { title: "Tracking & lead handling", body: "Analytics and conversion tracking installed, with enquiries flowing into your inbox or CRM so nothing slips." },
      { title: "Launch & after", body: "We handle domains, hosting and launch, then keep it secure and up to date with an optional Care & Hosting plan." },
    ],
    proof: [
      { client: "WoodEvo", line: "Website for a composite decking, cladding and battens brand." },
      { client: "DeckMate", line: "Website with a built-in deck calculator, connected to Zoho CRM." },
    ],
    worksWith: ["seo", "tracking-and-reporting", "care-and-hosting"],
    faqs: [
      { q: "How long does a website take?", a: "A focused business site usually takes a few weeks from kickoff to launch. Bigger sites with lots of pages, e-commerce or integrations take longer. We'll give you a real timeline after the first conversation." },
      { q: "Can I update the website myself?", a: "Yes. We set it up so you can change text, images and posts yourself, and we show you how. For bigger changes, a Care & Hosting plan includes time each month." },
      { q: "How much does a website cost?", a: "Every site is quoted individually because scope varies so much. After a short scoping call we'll send a clear, fixed quote, with no surprises." },
    ],
  },
  {
    slug: "web-and-mobile-apps",
    name: "Web & Mobile Apps",
    group: "build",
    short: "Custom software built around how your business actually works.",
    tagline: "Software that fits your business, not the other way around.",
    seoTitle: "Custom Software & App Development Australia | DevEdge",
    seoDescription:
      "Custom web and mobile apps for Australian businesses: quoting tools, calculators, client portals, SaaS products and MVPs, built in whatever tech the job needs.",
    intro: [
      "Off-the-shelf software is built for the average business. If you're not average, you end up bending your processes around someone else's product, or stitching together five tools that don't talk to each other.",
      "We build the tool you actually need: calculators and quoting systems for your website, ordering and booking flows, client portals, internal dashboards, or a full SaaS product. Web or mobile, in whatever tech the job needs, and you own all of it.",
    ],
    signs: [
      "Your team works around your software instead of with it.",
      "You've got an idea for a product or platform and need someone to build it properly.",
      "Customers want to self-serve: get a quote, place an order, check a status.",
      "You're paying for several subscriptions that each do half of what you need.",
    ],
    deliverables: [
      { title: "Scoping that saves money", body: "We map the problem first and tell you honestly if off-the-shelf would do the job. If custom is the answer, you get a clear scope before anything is built." },
      { title: "Web apps & portals", body: "Calculators, quoting and ordering systems, client and supplier portals, internal dashboards." },
      { title: "SaaS products & MVPs", body: "From first version to a product with paying customers: accounts, subscriptions, payments and admin." },
      { title: "Mobile apps", body: "Apps for iOS and Android when your users need something in their pocket." },
      { title: "Integrations", body: "Connected to your CRM, accounting, payments, email and anything else with an API." },
      { title: "Support & growth", body: "We keep it running, fix what comes up and keep building as your business changes." },
    ],
    proof: [
      { client: "Tradeflow", line: "Our own SaaS product: quoting, purchase orders and supplier management for small businesses.", href: "/products/tradeflow" },
      { client: "DeckMate", line: "Deck calculator and order-to-payment web app for a decking supplier." },
      { client: "Tennantly", line: "Mobile app for landlord management, taken from an idea to a working product." },
    ],
    worksWith: ["crm-erp-systems", "care-and-hosting", "tracking-and-reporting"],
    faqs: [
      { q: "Do I own the code?", a: "Yes. You own what we build for you: code, data and accounts. No lock-in." },
      { q: "What tech do you build with?", a: "Whatever suits the job. We'll recommend the right stack for your needs, budget and team, not just whatever we used last time." },
      { q: "Can you take over an app someone else built?", a: "Often, yes. We'll review the code first and give you an honest view on whether to keep building on it or start fresh." },
    ],
  },
  {
    slug: "crm-erp-systems",
    name: "CRM & ERP Systems",
    group: "build",
    short: "Set up, fix and connect the systems your business runs on.",
    tagline: "One system that runs your business, instead of ten that half-do.",
    seoTitle: "CRM & ERP Implementation, Integration & Automation | DevEdge",
    seoDescription:
      "CRM and ERP setup, cleanup, integration and automation for Australian businesses on Zoho, HubSpot, Xero and NetSuite, or a custom-built system when off-the-shelf doesn't fit.",
    intro: [
      "Your CRM, inventory, quoting, purchasing and accounting should work as one system. For most businesses they don't. Data gets typed in twice, stock counts are wrong, quotes live in spreadsheets, and nobody trusts the numbers.",
      "We set up, clean up, customise, connect and automate the systems your business runs on, across Zoho, HubSpot, Xero and NetSuite. When off-the-shelf can't do what you need, we build it. We work closely with Zoho's development team, and we've built our own ERP, so we know these systems from both sides.",
    ],
    signs: [
      "The same information gets entered into three different places.",
      "Your CRM or inventory system is a mess and nobody trusts what's in it.",
      "Quotes, orders and purchasing still run on spreadsheets and email.",
      "You bought a system that does 70% of what you need and the rest is manual.",
    ],
    deliverables: [
      { title: "Choosing the right system", body: "An honest recommendation on what fits your business (Zoho, HubSpot, Xero, NetSuite or custom) before you commit." },
      { title: "Setup & implementation", body: "Configured around how you actually work: pipelines, products, price lists, users, permissions and reports." },
      { title: "Cleanup & data migration", body: "Fixing messy data, removing duplicates, restructuring items and moving everything over from old systems and spreadsheets." },
      { title: "Integration", body: "Connecting your CRM, inventory, accounting, website, email and ads so data flows automatically." },
      { title: "Automation", body: "Quotes, follow-ups, purchase orders, approvals, invoices and reminders that run without someone pushing buttons." },
      { title: "Custom-built systems", body: "When nothing off-the-shelf fits, a system built for you. Tradeflow is an ERP we built and run ourselves." },
    ],
    proof: [
      { client: "TPD Timber", line: "Zoho Inventory cleanup and setup: data restructure, product groups and opening stock migration." },
      { client: "DeckMate", line: "Zoho CRM integration and automation, from website lead to sales pipeline." },
      { client: "WoodEvo", line: "Custom file request and approval portal built on Google Drive." },
      { client: "Tradeflow", line: "Our own ERP for small businesses: quoting, purchase orders and suppliers.", href: "/products/tradeflow" },
    ],
    worksWith: ["web-and-mobile-apps", "tracking-and-reporting", "websites"],
    faqs: [
      { q: "Which platforms do you work with?", a: "Mainly Zoho, HubSpot, Xero and NetSuite, and we can build custom systems or integrate with almost anything that has an API." },
      { q: "Should we use off-the-shelf or build our own?", a: "Usually off-the-shelf, set up properly. Custom makes sense when the system is core to how you compete or nothing fits. We'll tell you honestly which camp you're in." },
      { q: "Can you fix a system someone else set up?", a: "Yes. A lot of our work is cleaning up and restructuring existing CRMs and inventory systems so they're usable again." },
    ],
  },
  {
    slug: "care-and-hosting",
    name: "Care & Hosting",
    group: "build",
    short: "Hosting, updates, backups and changes, handled every month.",
    tagline: "Launch is the start. We keep it running after.",
    seoTitle: "Website Care, Maintenance & Managed Hosting | DevEdge",
    seoDescription:
      "Monthly website care and managed hosting for Australian businesses: hosting, security updates, backups, changes each month and SEO reporting.",
    intro: [
      "Websites and apps don't stay healthy on their own. Software goes out of date, security holes appear, backups get forgotten, and small changes pile up until something breaks.",
      "Our Care & Hosting plans handle all of it every month: fast, secure hosting, updates, backups, a set amount of time for changes, and SEO reporting so you can see how the site is performing.",
    ],
    signs: [
      "You don't know who'd fix your website if it went down tonight.",
      "Plugins, software or certificates haven't been updated in a long time.",
      "Small changes take weeks because there's no one on call.",
      "You have no idea how your site is performing on Google.",
    ],
    deliverables: [
      { title: "Managed hosting", body: "Fast, secure hosting with SSL, monitoring and the technical setup handled for you." },
      { title: "Updates & security", body: "Software, dependencies and security patches kept current so problems don't build up." },
      { title: "Backups", body: "Regular backups, so if anything goes wrong it can be restored." },
      { title: "Monthly changes", body: "Hours each month for content updates, small features and fixes, with no quote needed for every little thing." },
      { title: "SEO reporting", body: "A clear monthly view of traffic, rankings and enquiries, in plain English." },
      { title: "A real person", body: "Talk directly to the people who built it, not a ticket queue." },
    ],
    worksWith: ["websites", "seo", "web-and-mobile-apps"],
    faqs: [
      { q: "Can you host a site you didn't build?", a: "Often, yes. We'll review it first and let you know if anything needs fixing before we take it on." },
      { q: "What if I need more changes than the plan includes?", a: "We'll quote the extra work upfront, or move you to a plan with more hours. No surprise invoices." },
      { q: "How much does a plan cost?", a: "Plans are quoted to suit your site and how much support you need. Get in touch and we'll recommend the right fit." },
    ],
  },
  {
    slug: "paid-media",
    name: "Paid Media",
    group: "grow",
    short: "Meta and Google Ads, fully managed from creative to results.",
    tagline: "Ads that pay for themselves, and the proof that they do.",
    seoTitle: "Meta Ads & Google Ads Management Australia | DevEdge",
    seoDescription:
      "Fully managed Meta (Facebook and Instagram) and Google Ads for Australian businesses: strategy, ad creative, landing pages, tracking and ongoing optimisation.",
    intro: [
      "Most businesses running ads can't answer a simple question: which ads made money? Campaigns get set up, budgets get spent, and the reporting shows clicks and impressions, not customers.",
      "We fully manage your Meta (Facebook and Instagram) and Google Ads: strategy, audiences, budgets, the ad creative itself, the landing pages people land on, and ongoing testing. Because we also build websites, tracking and CRMs, we can follow a lead from the first click to the paid invoice.",
    ],
    signs: [
      "You're spending on ads but can't tell what they're actually returning.",
      "Your ads look the same as everyone else's and performance has stalled.",
      "Clicks go to your homepage instead of a page built to convert.",
      "Your agency reports on reach and clicks, not enquiries and sales.",
    ],
    deliverables: [
      { title: "Strategy & audiences", body: "Who to target, what to offer and how much to spend, based on your margins and goals, not guesswork." },
      { title: "Ad creative", body: "Images, video and copy made for each platform and tested properly, not one ad left running forever." },
      { title: "Landing pages", body: "Pages built to match each campaign and turn clicks into enquiries." },
      { title: "Meta Ads", body: "Facebook and Instagram campaigns built for leads or sales, with full account management." },
      { title: "Google Ads", body: "Search and Performance Max campaigns that show up when people are actively looking." },
      { title: "Tracking & optimisation", body: "Pixel, Conversions API and GA4 set up properly, with weekly optimisation and clear monthly reporting." },
    ],
    worksWith: ["tracking-and-reporting", "websites", "seo"],
    faqs: [
      { q: "Do you make the ads too?", a: "Yes. Creative is part of the service: images, video and copy, made and tested for each platform." },
      { q: "How much should I spend on ads?", a: "It depends on your market, margins and goals. We'll recommend a starting budget after looking at your business, and scale it based on results." },
      { q: "How quickly will I see results?", a: "Campaigns start getting data within days. Expect a few weeks of testing before performance settles. We'll be upfront about what's realistic for your market." },
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    group: "grow",
    short: "Get found on Google by the people already searching for you.",
    tagline: "Show up when your customers are searching.",
    seoTitle: "SEO Services for Australian Businesses | DevEdge",
    seoDescription:
      "SEO for Australian businesses: technical fixes, keyword strategy, content, Google Business Profile and local SEO, with clear monthly reporting.",
    intro: [
      "Every day, people search Google for exactly what you sell. If you're not on the first page, those customers go to someone who is.",
      "We handle SEO from both sides: the technical foundations most marketing agencies can't fix (speed, structure, indexing, structured data) and the strategy and content that earn rankings over time. Every month you get a report that shows real progress, in plain English.",
    ],
    signs: [
      "Competitors show up on Google for your services and you don't.",
      "Your site gets traffic, but not from the searches that turn into customers.",
      "You've paid for SEO before and couldn't tell what actually changed.",
      "Your Google Business Profile is incomplete or rarely updated.",
    ],
    deliverables: [
      { title: "Technical SEO", body: "Speed, mobile, indexing, structured data and site structure fixed properly. This is where being developers matters." },
      { title: "Keyword strategy", body: "Finding the searches your customers actually make, and mapping each one to the right page." },
      { title: "On-page optimisation", body: "Titles, headings, content and internal links improved page by page." },
      { title: "Content", body: "Helpful articles and landing pages that answer real questions and target real searches." },
      { title: "Local SEO", body: "Google Business Profile optimisation, reviews and consistent listings across directories." },
      { title: "Monthly reporting", body: "Rankings, traffic and enquiries from search, with what we did and what's next." },
    ],
    worksWith: ["websites", "tracking-and-reporting", "paid-media"],
    faqs: [
      { q: "How long does SEO take?", a: "Technical fixes can lift things within weeks. Ranking for competitive searches usually takes several months of steady work. Anyone promising page one overnight isn't being straight with you." },
      { q: "Do you guarantee rankings?", a: "No. Nobody honest can, because Google decides. What we commit to is doing the work properly and showing you exactly what's changing every month." },
      { q: "Can you do SEO on a site you didn't build?", a: "Yes. We start with an audit, then fix what's holding it back, whatever it's built on." },
    ],
  },
  {
    slug: "tracking-and-reporting",
    name: "Tracking & Reporting",
    group: "grow",
    short: "Know exactly which marketing brings in customers.",
    tagline: "Know which marketing makes money.",
    seoTitle: "Conversion Tracking, GA4 & Meta Conversions API Setup | DevEdge",
    seoDescription:
      "Conversion tracking and reporting for Australian businesses: GA4, Meta Pixel and Conversions API, Google Ads conversions, CRM attribution and dashboards.",
    intro: [
      "Most businesses can't say which website visits, ads or posts turned into paying customers. Tracking is half set up, the numbers in Google and Meta don't agree, and the CRM doesn't know where leads came from.",
      "We set up tracking properly, end to end: GA4, Meta Pixel and Conversions API, Google Ads conversions, and lead source passed into your CRM. Then we turn it into a simple report or dashboard that shows what's working, so you can spend money where it pays.",
    ],
    signs: [
      "You can't say which channel your last ten customers came from.",
      "Google Analytics, Meta and your CRM all show different numbers.",
      "Your ads are optimising for clicks because there's no conversion tracking.",
      "Reports exist, but nobody uses them to make decisions.",
    ],
    deliverables: [
      { title: "Tracking audit", body: "What's set up, what's broken and what's missing, across your site, ad accounts and CRM." },
      { title: "GA4 setup", body: "Events and key events that match what matters to your business: enquiries, calls, quotes and sales." },
      { title: "Meta Pixel & Conversions API", body: "Server-side tracking so Meta gets accurate data, even with ad blockers and privacy changes." },
      { title: "Google Ads conversions", body: "Conversion tracking that lets Google optimise for real leads, not clicks." },
      { title: "CRM attribution", body: "Lead source and campaign data passed into your CRM, so every customer can be traced back to where they came from." },
      { title: "Dashboards & reports", body: "One clear view of leads, cost per lead and return, monthly or live." },
    ],
    worksWith: ["paid-media", "crm-erp-systems", "websites"],
    faqs: [
      { q: "Why do Google, Meta and my CRM show different numbers?", a: "Each platform counts differently and most setups have gaps. We fix the setup and give you one source of truth to make decisions from." },
      { q: "Is this only for businesses running ads?", a: "No. Tracking matters for SEO, email and word of mouth too. If you want to know where customers come from, you need it." },
      { q: "Is server-side tracking worth it?", a: "For most businesses spending on Meta, yes. The Conversions API recovers data that browser tracking misses, which helps the algorithm and your reporting." },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const servicesByGroup = (group: ServiceGroup) => SERVICES.filter((s) => s.group === group);

/** Old service URLs → new ones (301s on the server, redirects in the app) */
export const LEGACY_SERVICE_REDIRECTS: Record<string, string> = {
  "custom-development": "/services/web-and-mobile-apps",
  "mobile-apps": "/services/web-and-mobile-apps",
  "web-platform": "/services/websites",
  "system-integration": "/services/crm-erp-systems",
  "process-automation": "/services/crm-erp-systems",
  "cloud-migration": "/services",
};

/** The connected journey shown on the home page and /services */
export const JOURNEY = [
  { step: "01", label: "Website", body: "A fast, premium site that turns visitors into enquiries.", slugs: ["websites"] },
  { step: "02", label: "Systems", body: "CRM, ERP and custom apps that run the business behind it.", slugs: ["crm-erp-systems", "web-and-mobile-apps"] },
  { step: "03", label: "Customers", body: "Paid media and SEO that bring the right people in.", slugs: ["paid-media", "seo"] },
  { step: "04", label: "Proof", body: "Tracking that shows which marketing makes money.", slugs: ["tracking-and-reporting"] },
  { step: "05", label: "Care", body: "Hosting, updates and changes, handled every month.", slugs: ["care-and-hosting"] },
];
