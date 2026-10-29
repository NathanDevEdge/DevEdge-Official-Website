import { useRoute, Link } from "wouter";
import SEO from "@/components/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { m } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// ── Code block visuals (replaces stock photography) ───────────────────────────
type CodeToken = { t: string; c: string };
type CodeLine = { tokens: CodeToken[] };

interface CodeBlockProps {
    filename: string;
    lines: CodeLine[];
    className?: string;
}

function CodeBlock({ filename, lines, className = "" }: CodeBlockProps) {
    return (
        <div className={`w-full border border-[#2E1F0F] bg-[#1A1008] overflow-hidden ${className}`}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2E1F0F]">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-auto font-mono text-[11px] text-[#664422] tracking-widest">{filename}</span>
            </div>
            {/* Code */}
            <div className="px-6 py-5 font-mono text-[13px] leading-[1.8]">
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-5">
                        <span className="w-4 shrink-0 text-right text-[#332010] select-none text-xs pt-px">
                            {line.tokens.length > 0 ? i + 1 : ""}
                        </span>
                        <span>
                            {line.tokens.map((token, j) => (
                                <span key={j} style={{ color: token.c }}>{token.t}</span>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Code snippet per article — on-brand, topic-relevant
const K = "#C97B3A", T = "#F5E6D5", P = "#A89070", C = "#664422";
const articleCode: Record<string, { filename: string; lines: CodeLine[] }> = {
    "custom-app-cost-australia": {
        filename: "scope.ts",
        lines: [
            { tokens: [{ t: "// What actually moves the price", c: C }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: K }, { t: "drivers", c: T }, { t: " = [", c: P }] },
            { tokens: [{ t: '  "screens & user flows"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "user roles & permissions"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "integrations"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "platforms"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "reporting & admin"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "];", c: P }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: K }, { t: "quote", c: T }, { t: " = ", c: P }, { t: "scope", c: T }, { t: "(mvp, drivers);", c: P }] },
            { tokens: [{ t: "// written, fixed, no surprises", c: C }] },
        ],
    },
    "meta-ads-tracking-small-business": {
        filename: "tracking.ts",
        lines: [
            { tokens: [{ t: "// Tell the algorithm what a win looks like", c: C }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: K }, { t: "tracking", c: T }, { t: " = {", c: P }] },
            { tokens: [{ t: "  pixel:          ", c: P }, { t: "true", c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  conversionsApi: ", c: P }, { t: "true", c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  dedupeBy:       ", c: P }, { t: '"event_id"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  optimiseFor:    ", c: P }, { t: '"Lead"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  crmFeedback:    ", c: P }, { t: '"closed deals"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "};", c: P }] },
            { tokens: [] },
            { tokens: [{ t: "// not page views. not clicks. customers.", c: C }] },
        ],
    },
    "signs-you-have-outgrown-spreadsheets": {
        filename: "outgrown.ts",
        lines: [
            { tokens: [{ t: "// Time to move off spreadsheets?", c: C }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: K }, { t: "signs", c: T }, { t: " = [", c: P }] },
            { tokens: [{ t: '  "Quotes_FINAL_v3.xlsx"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "only Sam knows the formulas"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "leads lost in the inbox"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: '  "typing it all into Xero twice"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "];", c: P }] },
            { tokens: [] },
            { tokens: [{ t: "if ", c: K }, { t: "(signs.length > ", c: P }, { t: "1", c: K }, { t: ") ", c: P }, { t: "plan", c: T }, { t: "(", c: P }, { t: '"crm"', c: K }, { t: ");", c: P }] },
        ],
    },
    "custom-vs-off-the-shelf-software": {
        filename: "evaluate.ts",
        lines: [
            { tokens: [{ t: "// Should you build custom?", c: C }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: K }, { t: "offTheShelf", c: T }, { t: " = {", c: P }] },
            { tokens: [{ t: "  workflow:  ", c: P }, { t: '"theirs"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  ownership: ", c: P }, { t: "false", c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  cost:      ", c: P }, { t: '"per user, forever"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "};", c: P }] },
            { tokens: [] },
            { tokens: [{ t: "const ", c: K }, { t: "custom", c: T }, { t: " = {", c: P }] },
            { tokens: [{ t: "  workflow:  ", c: P }, { t: '"yours"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  ownership: ", c: P }, { t: "true", c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "  cost:      ", c: P }, { t: '"scoped up front"', c: K }, { t: ",", c: P }] },
            { tokens: [{ t: "};", c: P }] },
        ],
    },
    "automated-workflow-software-logistics": {
        filename: "quote-to-cash.ts",
        lines: [
            { tokens: [{ t: "// Quote accepted → paid, with no retyping", c: C }] },
            { tokens: [] },
            { tokens: [{ t: "on", c: T }, { t: "(", c: P }, { t: '"quote.accepted"', c: K }, { t: ", ", c: P }, { t: "async ", c: K }, { t: "(quote) => {", c: P }] },
            { tokens: [{ t: "  await ", c: K }, { t: "createOrder", c: T }, { t: "(quote);", c: P }] },
            { tokens: [{ t: "  await ", c: K }, { t: "raisePurchaseOrders", c: T }, { t: "(quote);", c: P }] },
            { tokens: [{ t: "  await ", c: K }, { t: "notifyCustomer", c: T }, { t: "(quote);", c: P }] },
            { tokens: [{ t: "});", c: P }] },
            { tokens: [] },
            { tokens: [{ t: "on", c: T }, { t: "(", c: P }, { t: '"order.delivered"', c: K }, { t: ", ", c: P }, { t: "async ", c: K }, { t: "(order) => {", c: P }] },
            { tokens: [{ t: "  await ", c: K }, { t: "invoiceInXero", c: T }, { t: "(order);", c: P }] },
            { tokens: [{ t: "});", c: P }] },
            { tokens: [{ t: "// manual steps: 0", c: C }] },
        ],
    },
};

// ── Blog data ─────────────────────────────────────────────────────────────────
// Newest first. Prices never appear here: every project is quoted privately.
const AUTHOR = "Nathan Anniss";

const blogData: Record<string, {
    title: string;
    excerpt: string;
    date: string;
    isoDate: string;
    updatedIso?: string;
    readTime: string;
    author: string;
    content: React.ReactNode;
}> = {
    "custom-app-cost-australia": {
        title: "How Much Does a Custom App Cost in Australia? (And Why We Don't Publish Prices)",
        excerpt: "The honest answer is \"it depends\", so here's exactly what it depends on: the five things that move the price of a custom web or mobile app, and how to get a quote you can trust.",
        date: "Oct 29, 2026",
        isoDate: "2026-10-29",
        readTime: "7 min read",
        author: AUTHOR,
        content: (
            <>
                <p>Search "how much does an app cost" and you'll find price ranges so wide they're useless. That's not because agencies are being cagey. It's because "app" covers everything from a quoting calculator to a two-sided marketplace. A number without a scope is a guess.</p>
                <p>So instead of another made-up range, here's what actually drives the cost of a custom app, and how to get a quote you can hold someone to.</p>

                <h2>The five things that move the price</h2>
                <p><strong>1. Screens and user flows.</strong> Every screen needs designing, building and testing. More important than the number of screens is the number of journeys: sign up, place an order, approve a quote, request a refund. Each journey has edge cases, and edge cases are where the time goes.</p>
                <p><strong>2. User roles and permissions.</strong> An app where everyone sees the same thing is simple. An app where customers, staff, managers and suppliers each see different data and can do different things is not. Roles touch every screen.</p>
                <p><strong>3. Integrations.</strong> Connecting to Xero, a CRM like Zoho or HubSpot, a payment provider or a carrier's API is often what makes an app genuinely useful. Each integration adds work, and some third-party APIs are a lot friendlier than others.</p>
                <p><strong>4. Platforms.</strong> A web app runs everywhere with one codebase. Native iOS and Android apps can do more on a phone (offline use, the camera, push notifications), but you're shipping to two app stores. Cross-platform frameworks narrow the gap, but they don't close it.</p>
                <p><strong>5. Reporting and admin.</strong> The part customers never see is often the part your team uses most: dashboards, exports, settings, the ability to fix a customer's order without calling a developer. It's easy to forget and expensive to bolt on later.</p>

                <h2>The costs after launch</h2>
                <p>Software isn't finished when it launches. Budget for hosting, app store fees, security updates, keeping up with new iOS and Android versions, and the improvements you'll want once real users get their hands on it. That's what our <Link href="/services/care-and-hosting">Care &amp; Hosting</Link> plans cover, so it's planned rather than a surprise.</p>

                <h2>How to keep the cost down</h2>
                <ul>
                    <li><strong>Start with the smallest useful version.</strong> Build the one journey that matters most, put it in front of real users, then grow it.</li>
                    <li><strong>Don't rebuild what exists.</strong> If a platform like Zoho already does 80% of what you need, configuring and extending it is often smarter than building from scratch.</li>
                    <li><strong>Question the native app.</strong> Plenty of "apps" work better as a fast web app that staff and customers open in a browser.</li>
                    <li><strong>Write the scope down.</strong> Vague scopes are the number one cause of blown budgets, on both sides.</li>
                </ul>

                <h2>Why we don't publish prices</h2>
                <p>Every project we take on is different, so any price on our website would either be padded to cover the worst case or be a hook that grows once you've signed. Neither is fair to you.</p>
                <p>Instead, we scope your project properly and send a written quote that spells out exactly what's included. If something comes up that's outside that scope, you hear about it before any work happens, not on the invoice.</p>

                <h2>How to get an accurate quote</h2>
                <p>Bring three things to the first conversation: the problem you're solving, who will use the app, and the systems it needs to talk to. Rough sketches and screenshots of tools you like help too. That's enough for us to tell you honestly whether a custom build makes sense, and what it would look like. Start with our <Link href="/services/web-and-mobile-apps">Web &amp; Mobile Apps</Link> page or just get in touch.</p>
            </>
        ),
    },
    "meta-ads-tracking-small-business": {
        title: "Why Your Meta Ads Aren't Working (It's Usually the Tracking)",
        excerpt: "Before you blame the creative or the budget, check what you're telling Meta a win looks like. Broken tracking quietly wastes more ad spend than bad ads do.",
        date: "Oct 29, 2026",
        isoDate: "2026-10-29",
        readTime: "6 min read",
        author: AUTHOR,
        content: (
            <>
                <p>When Meta ads stop performing, the usual reaction is to change the creative, change the audience or turn up the budget. Sometimes that's right. But more often than not, the real problem is underneath: the ad account doesn't know what a good result looks like, because the tracking is broken.</p>

                <h2>The algorithm optimises for what you tell it</h2>
                <p>Meta's delivery system is very good at finding people who will do the thing you're tracking. If you're tracking page views, it finds people who view pages. If your lead event fires twice, or not at all, it learns from bad data. Garbage in, wasted spend out.</p>

                <h2>The most common problems we find</h2>
                <ul>
                    <li><strong>Pixel only, no Conversions API.</strong> Browser privacy settings and ad blockers mean the pixel on its own misses a meaningful share of conversions. The Conversions API sends events from your server too, so Meta sees what actually happened.</li>
                    <li><strong>Duplicate events.</strong> Pixel and server events without a shared event ID get counted twice. Your results look great in Ads Manager and don't match your inbox.</li>
                    <li><strong>Optimising for the wrong event.</strong> Campaigns set to clicks or landing page views when what you actually want is a form submission or a phone call.</li>
                    <li><strong>Leads tracked, sales not.</strong> If leads go into a CRM and nobody tells Meta which ones became customers, the algorithm can't tell a tyre-kicker from a buyer.</li>
                    <li><strong>A landing page that leaks.</strong> Slow load times, a form that's hard to use on a phone, or a page that doesn't match the ad. Tracking can't fix that, but it will show you where people drop off.</li>
                </ul>

                <h2>What a solid setup looks like</h2>
                <p>For most small businesses, good tracking means: GA4 set up with real key events, the Meta pixel plus Conversions API with deduplication, Google Ads conversions if you run Google too, and every lead landing in your CRM with its source attached. The best setups go one step further and send closed deals back to the ad platforms, so you optimise for customers instead of form fills.</p>

                <h2>Three checks you can do today</h2>
                <ul>
                    <li><strong>Test Events in Events Manager.</strong> Submit your own form and watch whether the lead event fires once, and from both browser and server.</li>
                    <li><strong>Check Event Match Quality.</strong> A low score means Meta struggles to connect conversions to real people.</li>
                    <li><strong>Count the leads.</strong> Compare last month's leads in Ads Manager with the enquiries you actually received. If they're far apart, the tracking needs work.</li>
                </ul>

                <h2>Then fix the ads</h2>
                <p>Once the data is right, creative and offer testing actually means something, because you can trust the numbers you're judging them by. That's why we set up tracking before we touch a campaign. See how we handle <Link href="/services/tracking-and-reporting">Tracking &amp; Reporting</Link> and <Link href="/services/paid-media">Paid Media</Link>, or get in touch for an honest look at your setup.</p>
            </>
        ),
    },
    "signs-you-have-outgrown-spreadsheets": {
        title: "7 Signs Your Business Has Outgrown Spreadsheets (And What Comes Next)",
        excerpt: "Spreadsheets are brilliant until they aren't. Here are the warning signs that it's time for a proper CRM or ERP system, and how to make the move without chaos.",
        date: "Oct 29, 2026",
        isoDate: "2026-10-29",
        readTime: "7 min read",
        author: AUTHOR,
        content: (
            <>
                <p>Almost every business we work with started on spreadsheets, and that's the right call. They're flexible, free and everyone knows how to use them. The trouble is that they don't tell you when you've outgrown them. You just slowly start losing time, money and customers.</p>

                <h2>The seven signs</h2>
                <p><strong>1. There are multiple versions of the truth.</strong> Pricing_FINAL.xlsx, Pricing_FINAL_v2.xlsx and the copy on someone's laptop. Nobody's sure which is current.</p>
                <p><strong>2. One person knows how it works.</strong> If the person who built the formulas goes on holiday and everything slows down, that's a business risk, not a spreadsheet.</p>
                <p><strong>3. Quoting takes too long.</strong> Looking up supplier prices, calculating margins and copying it all into a template eats hours that should be spent selling.</p>
                <p><strong>4. Leads fall through the cracks.</strong> Enquiries live in inboxes, phones and sticky notes. Follow-ups depend on someone remembering.</p>
                <p><strong>5. You type the same thing twice.</strong> Orders get entered in one place, then again in Xero, then again in an email to the supplier. Every retype is a chance for a mistake.</p>
                <p><strong>6. Simple questions take hours.</strong> "What's our margin on that product line?" or "Which customers haven't ordered in six months?" should take seconds.</p>
                <p><strong>7. Mistakes are reaching customers.</strong> Wrong prices, missed orders, double bookings. By the time customers notice, it's costing you more than money.</p>

                <h2>CRM or ERP: what's the difference?</h2>
                <p>A <strong>CRM</strong> (customer relationship management) system looks after the front of the business: leads, customers, quotes, follow-ups and your sales pipeline. An <strong>ERP</strong> (enterprise resource planning) system runs the back: stock, purchasing, orders, fulfilment and finance. Plenty of small businesses need a bit of both, and platforms like Zoho, HubSpot, Xero and NetSuite cover different parts of that picture.</p>
                <p>When none of them fit how you work, a custom system can. That's exactly why we built <Link href="/products/tradeflow">Tradeflow</Link>: small suppliers kept telling us they were stuck between spreadsheets and enterprise software.</p>

                <h2>How to make the move without chaos</h2>
                <ul>
                    <li><strong>Map how work actually happens</strong> before choosing any software. The tool should fit the process, not the other way round.</li>
                    <li><strong>Clean your data first.</strong> Moving messy spreadsheets into a new system just gives you a more expensive mess.</li>
                    <li><strong>Move in stages.</strong> Start with the part that hurts most, usually quoting or lead tracking, and get it working before adding more.</li>
                    <li><strong>Train the team properly.</strong> A system nobody uses is just another spreadsheet with a login.</li>
                    <li><strong>Make sure you own it.</strong> Your data, your accounts, documented properly, so you're never locked in to whoever set it up.</li>
                </ul>
                <p>Not sure where to start? Our <Link href="/services/crm-erp-systems">CRM &amp; ERP Systems</Link> service begins with exactly that conversation, and we'll tell you honestly if you're not there yet.</p>
            </>
        ),
    },
    "custom-vs-off-the-shelf-software": {
        title: "Custom vs Off-the-Shelf Software: When to Build Your Own",
        excerpt: "Are you bending your business to fit a generic tool? Here's how to tell when off-the-shelf is enough, when to configure what you already have, and when custom software is worth it.",
        date: "May 5, 2026",
        isoDate: "2026-05-05",
        updatedIso: "2026-10-29",
        readTime: "6 min read",
        author: AUTHOR,
        content: (
            <>
                <h2>The SaaS trap</h2>
                <p>Off-the-shelf software is fantastic for the things every business does the same way: email, payroll, basic accounting. But when it comes to the part of your operation that makes you different, generic tools push you into generic workflows. The tell is the spreadsheet sitting next to the software, quietly doing the job the software can't.</p>

                <h2>When off-the-shelf is the right call</h2>
                <p>If your processes are standard for your industry, your team is small and the tool covers most of what you need, buy it. It's quick to set up, someone else maintains it, and you can get on with running the business. We'll tell you this ourselves when it's true.</p>

                <h2>The middle option most businesses miss</h2>
                <p>It's rarely a straight choice between "buy" and "build". Platforms like Zoho, HubSpot, Xero and NetSuite can be configured, extended and connected far beyond what most businesses use them for. Custom fields, automations and integrations often close the gap for a fraction of the effort of a full build. That's a big part of our <Link href="/services/crm-erp-systems">CRM &amp; ERP Systems</Link> work.</p>

                <h2>When to build custom</h2>
                <p><strong>1. It's your competitive advantage.</strong> If the way you quote, schedule or serve customers is why you win work, you can't run it on the same tool as everyone else.</p>
                <p><strong>2. You're living in workarounds.</strong> Exports, re-imports, copy and paste between systems. Every workaround is a cost you pay every day.</p>
                <p><strong>3. Per-user pricing is scaling against you.</strong> Subscriptions that made sense for five people can look very different at fifty, and you're paying for features you don't use.</p>
                <p><strong>4. Your tools don't talk to each other.</strong> A custom system, or custom integrations, can make your existing tools work as one.</p>
                <p><strong>5. You want to own it.</strong> Custom software is an asset. You control the roadmap, the data and the pace of change.</p>

                <h2>Questions to ask before you decide</h2>
                <ul>
                    <li>What are we doing outside our current software, and how often?</li>
                    <li>Could our existing platform do this with the right setup?</li>
                    <li>What would it cost us to keep doing it the current way for another two years?</li>
                    <li>Who will look after a custom system once it's built?</li>
                </ul>

                <h2>How we approach it</h2>
                <p>We always start with an honest conversation about whether you need a custom build at all. If off-the-shelf covers it, we'll say so. If it doesn't, you'll get a clear written scope before you commit to anything, and the finished system will be documented and yours. See our <Link href="/services/web-and-mobile-apps">Web &amp; Mobile Apps</Link> service for what that looks like.</p>
            </>
        ),
    },
    "automated-workflow-software-logistics": {
        title: "Workflow Automation for Trade, Building and Supply Businesses",
        excerpt: "Copy and paste is a hidden tax on every order. Here are the automations that save trade, building and supply businesses the most time, and where to start.",
        date: "Apr 10, 2026",
        isoDate: "2026-04-10",
        updatedIso: "2026-10-29",
        readTime: "6 min read",
        author: AUTHOR,
        content: (
            <>
                <h2>The copy-and-paste tax</h2>
                <p>Most trade, building and supply businesses run on the same loop: quote, order, purchase from suppliers, deliver, invoice. And in most of them, a person retypes information at every step. Each handoff costs time, and each retype is a chance to get a price, a quantity or an address wrong.</p>

                <h2>The automations that pay off first</h2>
                <ul>
                    <li><strong>Quote to order to purchase order.</strong> When a customer accepts a quote, the order and the supplier purchase orders are created automatically, with the right buy prices.</li>
                    <li><strong>Supplier price lists.</strong> Upload a supplier's new price list and every quote uses current costs, so margins don't quietly erode.</li>
                    <li><strong>Invoicing on completion.</strong> When a job is marked complete or a delivery is confirmed, the invoice is created in Xero and sent. No end-of-week catch-up.</li>
                    <li><strong>Website leads straight into the CRM.</strong> Every enquiry lands in your CRM with its source, gets assigned, and triggers a follow-up so nothing sits in an inbox.</li>
                    <li><strong>Customer updates.</strong> Order confirmed, dispatched, delivered. Automatic messages cut "where's my order?" calls.</li>
                    <li><strong>Stock and reorder alerts.</strong> Know before you run out, not when a customer asks.</li>
                </ul>

                <h2>Where to start</h2>
                <p>Pick the task your team does most often, then count the steps and the systems involved. The biggest wins are almost always in the handoffs between systems: the moment someone copies something out of one tool and into another. Automate those first.</p>

                <h2>Off-the-shelf or custom?</h2>
                <p>Platforms like Zoho and HubSpot have strong built-in automation, and Xero connects to almost everything. For many businesses, the right setup of tools you already pay for gets you most of the way. When your process is genuinely different, custom integrations or a purpose-built system fill the gap. That's how <Link href="/products/tradeflow">Tradeflow</Link> came about: quoting and purchase orders built specifically for suppliers.</p>

                <h2>Built to be handed over</h2>
                <p>Whatever we automate is documented and owned by you, so you're never dependent on one person to keep it running. If you want to see what could be automated in your business, our <Link href="/services/crm-erp-systems">CRM &amp; ERP Systems</Link> page is the place to start.</p>
            </>
        ),
    },
};

// ── Shared components ─────────────────────────────────────────────────────────
function BgDecorations() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#C97B3A]/5 blur-[160px] rounded-full" />
            <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-[#C97B3A]/3 blur-[180px] rounded-full" />
            <div className="absolute left-0 right-0 bottom-0" style={{ height: "60%", perspective: "700px" }}>
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(to right, rgba(46,31,15,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.25) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    transform: "rotateX(62deg)",
                    transformOrigin: "50% 100%",
                    maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, transparent 65%)",
                }} />
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(to right, rgba(201,123,58,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,123,58,0.2) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    transform: "rotateX(62deg)",
                    transformOrigin: "50% 100%",
                    maskImage: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 80%)",
                }} />
            </div>
            <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-background via-background/95 to-transparent" />
        </div>
    );
}

export const BLOG_SLUGS = Object.keys(blogData);

// ── Blog Index ────────────────────────────────────────────────────────────────
function BlogIndex() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Insights: Websites, CRM & ERP, Apps and Marketing | DevEdge"
                description="Practical, honest articles for Australian businesses on websites, custom software, CRM and ERP systems, automation and marketing that works."
                url="https://devedge.com.au/blog"
                type="website"
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-16 min-h-[50vh] flex items-end">
                <BgDecorations />
                <div className="container relative z-10">
                    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            DevEdge Blog
                        </span>
                    </m.div>
                    <m.h1
                        className="mt-6 font-display font-black text-foreground leading-[0.88] tracking-tight"
                        style={{ fontSize: "clamp(52px, 7vw, 90px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        Straight answers.
                    </m.h1>
                    <m.p
                        className="mt-6 text-muted-foreground text-[17px] leading-relaxed max-w-[560px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.16, ease }}
                    >
                        Practical, honest articles for Australian businesses on websites, custom software, business systems and marketing that works.
                    </m.p>
                </div>
            </section>

            {/* Article list */}
            <section className="bg-background">
                <div className="container py-16">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, ease }}
                        className="border-t border-[#D4B896]"
                    >
                        {Object.entries(blogData).map(([slug, post]) => {
                            const code = articleCode[slug];
                            return (
                                <Link key={slug} href={`/blog/${slug}`}>
                                    <div className="border-b border-[#D4B896] py-8 grid md:grid-cols-[1fr_220px] gap-8 items-center group hover:bg-[#F5DFC8] transition-colors duration-150 cursor-pointer">
                                        {/* Text */}
                                        <div>
                                            <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground tracking-widest mb-3">
                                                <span>{post.date}</span>
                                                <span>·</span>
                                                <span>{post.readTime}</span>
                                            </div>
                                            <h2 className="font-display font-bold text-foreground text-2xl leading-tight mb-2 group-hover:text-primary transition-colors duration-150">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-4">
                                                {post.excerpt}
                                            </p>
                                            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-2">
                                                Read article →
                                            </span>
                                        </div>
                                        {/* Code block thumbnail */}
                                        {code && (
                                            <div className="hidden md:block overflow-hidden border border-[#2E1F0F] bg-[#1A1008] group-hover:border-[#C97B3A]/40 transition-colors duration-300">
                                                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#2E1F0F]">
                                                    <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                                                    <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                                                    <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                                                    <span className="ml-auto font-mono text-[9px] text-[#664422] tracking-widest">{code.filename}</span>
                                                </div>
                                                <div className="px-4 py-3 font-mono text-[10px] leading-[1.7] overflow-hidden max-h-[120px]">
                                                    {code.lines.slice(0, 8).map((line, i) => (
                                                        <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {line.tokens.length === 0 ? <>&nbsp;</> : line.tokens.map((tok, j) => (
                                                                <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </m.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ── Individual Article ────────────────────────────────────────────────────────
export default function BlogPost() {
    const [match, params] = useRoute("/blog/:slug");

    if (!match || !params || !blogData[params.slug]) {
        return <BlogIndex />;
    }

    const post = blogData[params.slug];
    const code = articleCode[params.slug];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={`${post.title} | DevEdge Blog`}
                description={post.excerpt}
                url={`https://devedge.com.au/blog/${params.slug}`}
                type="article"
                publishedTime={post.isoDate}
                jsonLd={[
                    {
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: post.title,
                        description: post.excerpt,
                        datePublished: post.isoDate,
                        dateModified: post.updatedIso ?? post.isoDate,
                        url: `https://devedge.com.au/blog/${params.slug}`,
                        mainEntityOfPage: `https://devedge.com.au/blog/${params.slug}`,
                        image: "https://devedge.com.au/og-image.jpg",
                        author: { "@type": "Person", name: post.author, url: "https://devedge.com.au/about" },
                        publisher: { "@id": "https://devedge.com.au/#organization" },
                    },
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Insights", path: "/blog" },
                        { name: post.title, path: `/blog/${params.slug}` },
                    ]),
                ]}
            />
            <Navigation />

            {/* Hero */}
            <section className="relative bg-background overflow-hidden pt-32 pb-0">
                <BgDecorations />
                <div className="container relative z-10 pb-16">
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="flex items-center gap-6 mb-10"
                    >
                        <Link href="/blog" className="font-mono text-[11px] text-muted-foreground tracking-[0.18em] uppercase inline-flex items-center gap-3 hover:text-primary transition-colors">
                            ← All Articles
                        </Link>
                        <span className="w-px h-4 bg-[#D4B896]" />
                        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                            <span className="w-8 h-px bg-primary inline-block" />
                            DevEdge Blog
                        </span>
                    </m.div>
                    <m.h1
                        className="font-display font-black text-foreground leading-[0.88] tracking-tight max-w-4xl"
                        style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                    >
                        {post.title}
                    </m.h1>
                    <m.div
                        className="mt-8 flex flex-wrap items-center gap-6 font-mono text-[11px] text-muted-foreground tracking-widest"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.16, ease }}
                    >
                        <span>{post.date}</span>
                        {post.updatedIso && (
                            <>
                                <span className="w-px h-3 bg-[#D4B896]" />
                                <span>Updated {new Date(post.updatedIso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            </>
                        )}
                        <span className="w-px h-3 bg-[#D4B896]" />
                        <span>{post.readTime}</span>
                        <span className="w-px h-3 bg-[#D4B896]" />
                        <Link href="/about" className="hover:text-primary transition-colors">{post.author}</Link>
                    </m.div>
                </div>
            </section>

            {/* Code block hero (replaces stock image) */}
            {code && (
                <div className="container">
                    <m.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2, ease }}
                        className="my-12"
                    >
                        <CodeBlock filename={code.filename} lines={code.lines} />
                    </m.div>
                </div>
            )}

            {/* Article body */}
            <div className="container max-w-3xl">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.24, ease }}
                    className="prose prose-stone max-w-none
                        prose-headings:font-display prose-headings:font-black prose-headings:text-foreground
                        prose-p:text-muted-foreground prose-p:text-[16px] prose-p:leading-relaxed
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-ul:text-muted-foreground prose-li:leading-relaxed
                        prose-blockquote:border-l-primary prose-blockquote:bg-[#EDD9C0] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:text-foreground prose-blockquote:not-italic prose-blockquote:font-medium
                        prose-a:text-primary hover:prose-a:text-primary/80"
                >
                    {post.content}
                </m.div>

                {/* CTA */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.3, ease }}
                    className="border-t border-[#D4B896] mt-20 pt-16 text-center pb-20"
                >
                    <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 justify-center mb-6">
                        <span className="w-8 h-px bg-primary inline-block" />
                        Ready to build?
                    </span>
                    <h3
                        className="font-display font-black text-foreground leading-[0.88] tracking-tight mb-6"
                        style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
                    >
                        Let's put this into practice.
                    </h3>
                    <p className="text-muted-foreground text-[17px] leading-relaxed mb-10 max-w-md mx-auto">
                        Tell us what you're working on. The first conversation is free, and you'll get a straight answer on whether we can help.
                    </p>
                    <ContactModal
                        buttonText="Start a Conversation"
                        triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                    />
                </m.div>
            </div>

            <Footer />
        </div>
    );
}
