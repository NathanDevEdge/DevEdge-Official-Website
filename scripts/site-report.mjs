#!/usr/bin/env node
// Emails a devedge.com.au traffic, leads and search report (GA4 + Search Console).
//
//   node --env-file=.env scripts/site-report.mjs --period week    # last Mon to Sun
//   node --env-file=.env scripts/site-report.mjs --period month   # last calendar month
//   add --dry-run to write the email to report-preview.html instead of sending it
//
// Needs in .env:
//   GOOGLE_SERVICE_ACCOUNT_FILE  path to the service account JSON key (Viewer on GA4, user on Search Console)
//   GA4_PROPERTY_ID              numeric GA4 property id
//   GSC_SITE_URL                 e.g. sc-domain:devedge.com.au
//   REPORT_TO                    comma-separated recipients
//   RESEND_API_KEY               already used by the contact form
// No extra dependencies: Google auth is a signed JWT using node:crypto.

import { createSign } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { Resend } from "resend";

const TZ = "Australia/Melbourne";
const args = process.argv.slice(2);
const period = args.includes("--period") ? args[args.indexOf("--period") + 1] : "week";
const dryRun = args.includes("--dry-run");
if (!["week", "month"].includes(period)) throw new Error("--period must be week or month");

const env = (k, fallback) => {
  const v = process.env[k] ?? fallback;
  if (v === undefined || v === "") throw new Error(`Missing ${k} in environment`);
  return v;
};

// ---------- dates (in Melbourne time) ----------
const todayMel = new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
todayMel.setHours(12, 0, 0, 0);
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const nice = (d) => d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

function ranges() {
  if (period === "week") {
    const dow = (todayMel.getDay() + 6) % 7; // Mon = 0
    const end = addDays(todayMel, -dow - 1); // last Sunday
    const start = addDays(end, -6);
    return { start, end, prevStart: addDays(start, -7), prevEnd: addDays(start, -1), label: "Weekly" };
  }
  const start = new Date(todayMel.getFullYear(), todayMel.getMonth() - 1, 1, 12);
  const end = new Date(todayMel.getFullYear(), todayMel.getMonth(), 0, 12);
  const prevStart = new Date(start.getFullYear(), start.getMonth() - 1, 1, 12);
  const prevEnd = new Date(start.getFullYear(), start.getMonth(), 0, 12);
  return { start, end, prevStart, prevEnd, label: "Monthly" };
}

// ---------- Google auth ----------
async function googleToken() {
  const key = JSON.parse(readFileSync(env("GOOGLE_SERVICE_ACCOUNT_FILE"), "utf8"));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  if (!res.ok) throw new Error(`Google auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function post(url, token, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status} ${await res.text()}`);
  return res.json();
}

// ---------- GA4 ----------
const EVENTS = ["cta_click", "form_start", "generate_lead", "form_error", "contact_click"];

async function ga4(token, r) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${env("GA4_PROPERTY_ID")}:batchRunReports`;
  const both = [
    { startDate: iso(r.start), endDate: iso(r.end), name: "cur" },
    { startDate: iso(r.prevStart), endDate: iso(r.prevEnd), name: "prev" },
  ];
  const cur = [both[0]];
  const eventFilter = (names) => ({
    filter: { fieldName: "eventName", inListFilter: { values: names } },
  });
  const [a, b] = await Promise.all([
    post(url, token, {
      requests: [
        {
          dateRanges: both,
          metrics: ["activeUsers", "newUsers", "sessions", "screenPageViews", "engagementRate", "keyEvents"].map((name) => ({ name })),
        },
        {
          dateRanges: both,
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: eventFilter(EVENTS),
        },
        {
          dateRanges: cur,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          // Leave out the internal /lab prototype and bot probes like //webapi/auth.cgi
          dimensionFilter: {
            notExpression: { filter: { fieldName: "pagePath", stringFilter: { matchType: "PARTIAL_REGEXP", value: "^/lab|^//|\\.(cgi|php)" } } },
          },
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges: cur,
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }, { name: "keyEvents" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 8,
        },
        {
          dateRanges: cur,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: eventFilter(["cta_click"]),
          orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
          limit: 8,
        },
      ],
    }),
    post(url, token, {
      requests: [
        {
          dateRanges: cur,
          dimensions: [{ name: "city" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 6,
        },
        {
          dateRanges: cur,
          dimensions: [{ name: "sessionSourceMedium" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: eventFilter(["generate_lead"]),
          orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
          limit: 8,
        },
      ],
    }),
  ]);
  const [totals, events, pages, channels, ctaPages] = a.reports;
  const [cities, leadSources] = b.reports;

  // With two date ranges GA adds a "dateRange" dimension at the end of each row
  const split = (report, nDims = 0) => {
    const out = { cur: {}, prev: {} };
    for (const row of report.rows ?? []) {
      const dims = row.dimensionValues.map((d) => d.value);
      const which = dims[dims.length - 1] === "prev" ? "prev" : "cur";
      const key = dims.slice(0, nDims).join("|") || "total";
      out[which][key] = row.metricValues.map((m) => Number(m.value));
    }
    return out;
  };
  const rows = (report) =>
    (report.rows ?? []).map((row) => [...row.dimensionValues.map((d) => d.value), ...row.metricValues.map((m) => Number(m.value))]);

  const t = split(totals);
  const tc = t.cur.total ?? [0, 0, 0, 0, 0, 0];
  const tp = t.prev.total ?? [0, 0, 0, 0, 0, 0];
  const ev = split(events, 1);
  const evCount = (w, name) => ev[w][name]?.[0] ?? 0;

  return {
    totals: ["activeUsers", "newUsers", "sessions", "screenPageViews", "engagementRate", "keyEvents"].reduce(
      (o, k, i) => ({ ...o, [k]: { cur: tc[i], prev: tp[i] } }),
      {},
    ),
    events: Object.fromEntries(EVENTS.map((n) => [n, { cur: evCount("cur", n), prev: evCount("prev", n) }])),
    pages: rows(pages),
    channels: rows(channels),
    ctaPages: rows(ctaPages),
    cities: rows(cities),
    leadSources: rows(leadSources),
  };
}

// ---------- Search Console ----------
async function gsc(token, r) {
  // Search Console data lags 2 to 3 days, so its window ends 3 days before today
  const len = Math.round((r.end - r.start) / 864e5);
  const end = period === "week" ? addDays(todayMel, -3) : r.end;
  const start = period === "week" ? addDays(end, -len) : r.start;
  const prevEnd = addDays(start, -1);
  const prevStart = period === "week" ? addDays(prevEnd, -len) : r.prevStart;
  const site = encodeURIComponent(env("GSC_SITE_URL", "sc-domain:devedge.com.au"));
  const url = `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`;
  // The Domain property also covers subdomains (e.g. tradeflow.devedge.com.au); report the main site only
  const mainSite = [{ filters: [{ dimension: "page", operator: "includingRegex", expression: "^https://devedge\\.com\\.au/" }] }];
  const q = (s, e, dims = [], rowLimit = 10) =>
    post(url, token, { startDate: iso(s), endDate: iso(e), dimensions: dims, rowLimit, dimensionFilterGroups: mainSite });
  const [tot, prev, queries, pages] = await Promise.all([
    q(start, end),
    q(prevStart, prevEnd),
    q(start, end, ["query"], 15),
    q(start, end, ["page"], 10),
  ]);
  const pick = (x) => x.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  return { start, end, cur: pick(tot), prev: pick(prev), queries: queries.rows ?? [], pages: pages.rows ?? [] };
}

// ---------- email ----------
const C = { ink: "#1A1008", brown: "#7A5C3A", line: "#D4B896", bg: "#FBEFD9", accent: "#C97B3A", up: "#2F7D32", down: "#B3261E" };
const n0 = (v) => Math.round(v).toLocaleString("en-AU");
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Google position: lower is better, so show places gained or lost rather than a percentage
function positionDelta(cur, prev) {
  if (!cur || !prev) return `<span style="color:${C.brown}">${cur ? "new" : "no data"}</span>`;
  const d = prev - cur; // positive = moved up the results
  if (Math.abs(d) < 0.1) return `<span style="color:${C.brown}">steady</span>`;
  return d > 0
    ? `<span style="color:${C.up}">▲ up ${d.toFixed(1)} places</span>`
    : `<span style="color:${C.down}">▼ down ${(-d).toFixed(1)} places</span>`;
}

function delta(cur, prev, { lowerIsBetter = false, asPoints = false } = {}) {
  if (!prev && !cur) return `<span style="color:${C.brown}">no change</span>`;
  if (!prev) return `<span style="color:${C.up}">new</span>`;
  const d = asPoints ? (cur - prev) * 100 : ((cur - prev) / prev) * 100;
  if (Math.abs(d) < 0.5) return `<span style="color:${C.brown}">steady</span>`;
  const good = lowerIsBetter ? d < 0 : d > 0;
  const txt = asPoints ? `${d > 0 ? "+" : ""}${d.toFixed(1)} pts` : `${d > 0 ? "+" : ""}${d.toFixed(0)}%`;
  return `<span style="color:${good ? C.up : C.down}">${d > 0 ? "▲" : "▼"} ${txt}</span>`;
}

const tile = (label, value, d) => `
  <td style="padding:12px 14px;border:1px solid ${C.line};background:#fff;width:33%;vertical-align:top">
    <div style="font-size:12px;color:${C.brown};text-transform:uppercase;letter-spacing:.04em">${label}</div>
    <div style="font-size:24px;font-weight:800;color:${C.ink};margin:4px 0">${value}</div>
    <div style="font-size:12px">${d}</div>
  </td>`;

const table = (head, body) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;margin:6px 0 4px">
    <tr>${head.map((h, i) => `<th style="text-align:${i ? "right" : "left"};padding:6px 8px;border-bottom:2px solid ${C.ink};color:${C.ink}">${h}</th>`).join("")}</tr>
    ${
      body.length
        ? body
            .map(
              (r) =>
                `<tr>${r.map((c, i) => `<td style="text-align:${i ? "right" : "left"};padding:6px 8px;border-bottom:1px solid ${C.line};color:${C.ink}${i ? ";white-space:nowrap" : ""}">${c}</td>`).join("")}</tr>`,
            )
            .join("")
        : `<tr><td colspan="${head.length}" style="padding:8px;color:${C.brown}">Nothing recorded in this period.</td></tr>`
    }
  </table>`;

const h2 = (t) => `<h2 style="font-size:16px;color:${C.ink};margin:28px 0 6px;border-left:4px solid ${C.accent};padding-left:10px">${t}</h2>`;
const pathOf = (u) => {
  try {
    return new URL(u).pathname;
  } catch {
    return u;
  }
};

function render(r, g, s) {
  const T = g.totals;
  const E = g.events;
  const leadRate = T.sessions.cur ? E.generate_lead.cur / T.sessions.cur : 0;
  const prevName = period === "week" ? "the week before" : "the month before";
  const headline = `${n0(T.activeUsers.cur)} visitors, ${n0(E.generate_lead.cur)} ${E.generate_lead.cur === 1 ? "enquiry" : "enquiries"}, ${n0(s.cur.clicks)} Google clicks`;

  const html = `<!doctype html><html><body style="margin:0;background:${C.bg};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:24px 12px">
  <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%">
  <tr><td style="background:${C.ink};color:${C.bg};padding:20px 24px">
    <div style="font-size:12px;letter-spacing:.12em;color:${C.accent}">DEVEDGE · ${r.label.toUpperCase()} WEBSITE REPORT</div>
    <div style="font-size:22px;font-weight:800;margin-top:6px">${esc(headline)}</div>
    <div style="font-size:13px;opacity:.8;margin-top:4px">${nice(r.start)} to ${nice(r.end)}, compared with ${prevName}</div>
  </td></tr>
  <tr><td style="padding:8px 0 24px">

  ${h2("Visitors")}
  <table width="100%" cellpadding="0" cellspacing="6" style="border-collapse:separate"><tr>
    ${tile("Visitors", n0(T.activeUsers.cur), delta(T.activeUsers.cur, T.activeUsers.prev))}
    ${tile("New visitors", n0(T.newUsers.cur), delta(T.newUsers.cur, T.newUsers.prev))}
    ${tile("Sessions", n0(T.sessions.cur), delta(T.sessions.cur, T.sessions.prev))}
  </tr><tr>
    ${tile("Page views", n0(T.screenPageViews.cur), delta(T.screenPageViews.cur, T.screenPageViews.prev))}
    ${tile("Engagement rate", pct(T.engagementRate.cur), delta(T.engagementRate.cur, T.engagementRate.prev, { asPoints: true }))}
    ${tile("Key events", n0(T.keyEvents.cur), delta(T.keyEvents.cur, T.keyEvents.prev))}
  </tr></table>

  ${h2("Start a project funnel")}
  ${table(
    ["Step", "This period", "Change"],
    [
      ["Clicked a Start a Project / Get in Touch button", n0(E.cta_click.cur), delta(E.cta_click.cur, E.cta_click.prev)],
      ["Started filling in the form", n0(E.form_start.cur), delta(E.form_start.cur, E.form_start.prev)],
      [`<strong>Sent an enquiry</strong>`, `<strong>${n0(E.generate_lead.cur)}</strong>`, delta(E.generate_lead.cur, E.generate_lead.prev)],
      ["Form failed to send", n0(E.form_error.cur), delta(E.form_error.cur, E.form_error.prev, { lowerIsBetter: true })],
      ["Clicked the phone number or email", n0(E.contact_click.cur), delta(E.contact_click.cur, E.contact_click.prev)],
    ],
  )}
  <div style="font-size:12px;color:${C.brown}">Enquiries per session: ${pct(leadRate)}.</div>
  ${g.leadSources.length ? table(["Enquiries came from", "Enquiries"], g.leadSources.map(([src, c]) => [esc(src), n0(c)])) : ""}
  ${g.ctaPages.length ? table(["Pages where the button was clicked", "Clicks"], g.ctaPages.map(([p, c]) => [esc(p), n0(c)])) : ""}

  ${h2("Most viewed pages")}
  ${table(["Page", "Views", "Visitors"], g.pages.map(([p, v, u]) => [esc(p), n0(v), n0(u)]))}

  ${h2("Where visitors came from")}
  ${table(["Channel", "Sessions", "Key events"], g.channels.map(([ch, se, k]) => [esc(ch), n0(se), n0(k)]))}
  ${table(["City", "Visitors"], g.cities.map(([c, u]) => [esc(c), n0(u)]))}

  ${h2("Google Search")}
  <div style="font-size:12px;color:${C.brown};margin-bottom:4px">${nice(s.start)} to ${nice(s.end)} (Search Console runs 2 to 3 days behind)</div>
  <table width="100%" cellpadding="0" cellspacing="6" style="border-collapse:separate"><tr>
    ${tile("Clicks", n0(s.cur.clicks), delta(s.cur.clicks, s.prev.clicks))}
    ${tile("Impressions", n0(s.cur.impressions), delta(s.cur.impressions, s.prev.impressions))}
    ${tile("Avg position", s.cur.position ? s.cur.position.toFixed(1) : "–", positionDelta(s.cur.position, s.prev.position))}
  </tr></table>
  ${table(
    ["Search query", "Clicks", "Impr.", "Position"],
    s.queries.map((q) => [esc(q.keys[0]), n0(q.clicks), n0(q.impressions), q.position.toFixed(1)]),
  )}
  ${table(
    ["Page in Google", "Clicks", "Impr.", "Position"],
    s.pages.map((p) => [esc(pathOf(p.keys[0])), n0(p.clicks), n0(p.impressions), p.position.toFixed(1)]),
  )}

  <p style="font-size:12px;color:${C.brown};margin-top:28px">
    Full detail: <a style="color:${C.accent}" href="https://analytics.google.com/analytics/web/#/p${esc(process.env.GA4_PROPERTY_ID)}/reports/intelligenthome">Google Analytics</a> ·
    <a style="color:${C.accent}" href="https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(process.env.GSC_SITE_URL ?? "sc-domain:devedge.com.au")}">Search Console</a><br>
    Sent automatically from the devedge.com.au server.
  </p>
  </td></tr></table></td></tr></table></body></html>`;

  const subject = `DevEdge ${r.label.toLowerCase()} report: ${headline}`;
  return { subject, html };
}

// ---------- main ----------
const r = ranges();
const token = await googleToken();
const [g, s] = await Promise.all([ga4(token, r), gsc(token, r)]);
const { subject, html } = render(r, g, s);

if (dryRun) {
  writeFileSync("report-preview.html", html);
  console.log(`${subject}\nWrote report-preview.html`);
} else {
  const resend = new Resend(env("RESEND_API_KEY"));
  const { error } = await resend.emails.send({
    from: process.env.REPORT_FROM ?? "DevEdge Reports <noreply@devedge.com.au>",
    to: env("REPORT_TO").split(",").map((x) => x.trim()),
    subject,
    html,
  });
  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
  console.log(`Sent: ${subject}`);
}
