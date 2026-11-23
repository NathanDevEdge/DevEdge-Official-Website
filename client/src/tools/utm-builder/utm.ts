// UTM link building: pure functions, no React, so they're easy to test and reuse.

export type UtmField = "source" | "medium" | "campaign" | "content" | "term";

export type UtmValues = Record<UtmField, string>;

export interface UtmOptions {
    /** Lowercase every value, so "Facebook" and "facebook" don't split your reports */
    lowercase: boolean;
    /** What spaces become */
    spaces: "_" | "-" | "%20";
}

export interface UtmResult {
    /** The finished link, or "" while something required is missing */
    url: string;
    /** Why there's no link yet */
    errors: string[];
    /** Things that work but are worth a second look */
    warnings: string[];
    /** The cleaned value of each field as it went into the link */
    cleaned: UtmValues;
}

export const UTM_FIELDS: { key: UtmField; param: string; required: boolean }[] = [
    { key: "source", param: "utm_source", required: true },
    { key: "medium", param: "utm_medium", required: true },
    { key: "campaign", param: "utm_campaign", required: true },
    { key: "content", param: "utm_content", required: false },
    { key: "term", param: "utm_term", required: false },
];

/** Common channels: one tap fills in source and medium the same way every time */
export const PRESETS: { label: string; source: string; medium: string }[] = [
    { label: "Facebook ad", source: "facebook", medium: "paid_social" },
    { label: "Instagram ad", source: "instagram", medium: "paid_social" },
    { label: "Facebook post", source: "facebook", medium: "social" },
    { label: "Instagram bio", source: "instagram", medium: "social" },
    { label: "LinkedIn post", source: "linkedin", medium: "social" },
    { label: "Email newsletter", source: "newsletter", medium: "email" },
    { label: "Google Business Profile", source: "google", medium: "organic" },
    { label: "QR code / print", source: "flyer", medium: "qr" },
];

export function cleanValue(raw: string, opts: UtmOptions) {
    let v = raw.trim().replace(/\s+/g, " ");
    if (opts.lowercase) v = v.toLowerCase();
    if (opts.spaces !== "%20") v = v.replace(/ /g, opts.spaces);
    return v;
}

/** Adds https:// if it's missing and checks it's a real web address */
export function parseBaseUrl(raw: string): URL | null {
    const s = raw.trim();
    if (!s) return null;
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s}`;
    try {
        const u = new URL(withScheme);
        if (u.protocol !== "http:" && u.protocol !== "https:") return null;
        if (!u.hostname.includes(".") && u.hostname !== "localhost") return null;
        return u;
    } catch {
        return null;
    }
}

/** Encodes a value for a query string, keeping it readable (spaces as %20, never "+") */
const enc = (v: string) => encodeURIComponent(v).replace(/%2F/gi, "/");

export function buildUtmUrl(baseRaw: string, values: UtmValues, opts: UtmOptions): UtmResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const cleaned = Object.fromEntries(UTM_FIELDS.map((f) => [f.key, cleanValue(values[f.key] ?? "", opts)])) as UtmValues;

    const base = parseBaseUrl(baseRaw);
    if (!baseRaw.trim()) errors.push("Add the page you want people to land on.");
    else if (!base) errors.push("That website address doesn't look right. Try something like yourbusiness.com.au/offer.");

    for (const f of UTM_FIELDS) {
        if (f.required && !cleaned[f.key]) errors.push(`Add a campaign ${f.key}.`);
    }
    if (errors.length || !base) return { url: "", errors, warnings, cleaned };

    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(baseRaw.trim())) {
        warnings.push("We added https:// to the front of your address. Check the page still opens.");
    } else if (base.protocol === "http:") {
        warnings.push("Your link starts with http://. Most sites now use https://, and the redirect between them can drop the tags.");
    }

    // Keep any query string the page already has, but replace old utm_ values
    const existing = base.search
        .replace(/^\?/, "")
        .split("&")
        .filter((p) => p && !/^utm_(source|medium|campaign|content|term|id)=/i.test(p));
    if (base.search && existing.length !== base.search.replace(/^\?/, "").split("&").filter(Boolean).length) {
        warnings.push("The address already had UTM tags. We replaced them with the ones below.");
    }
    if (/[?&](gclid|fbclid)=/i.test(base.search)) {
        warnings.push("The address has a gclid or fbclid in it. Those belong to one person's click, so take them out before sharing the link.");
    }

    const utm = UTM_FIELDS.filter((f) => cleaned[f.key]).map((f) => `${f.param}=${enc(cleaned[f.key])}`);
    const query = [...existing, ...utm].join("&");
    const url = `${base.origin}${base.pathname}?${query}${base.hash}`;

    // Friendly checks
    const src = cleaned.source.toLowerCase();
    const med = cleaned.medium.toLowerCase();
    if (/^(fb|face\s?book\.com|ig|insta)$/.test(src)) {
        warnings.push(`Pick one name per platform and stick to it ("facebook", not "${cleaned.source}") or your reports split in two.`);
    }
    if (src === "google" && /^(cpc|ppc|paid|paid_search)$/.test(med)) {
        warnings.push("Google Ads tags your links by itself (auto-tagging). Only add UTMs to Google Ads if auto-tagging is switched off.");
    }
    if (/^(ads?|advert|advertising|boost|boosted)$/.test(med)) {
        warnings.push(`Google Analytics files "${cleaned.medium}" under Unassigned. Use "paid_social" for social ads or "cpc" for search ads so they land in the right channel.`);
    }
    if (opts.spaces === "%20" && UTM_FIELDS.some((f) => cleaned[f.key].includes(" "))) {
        warnings.push("Spaces show up as %20 in the link. Underscores or dashes look tidier and copy more reliably.");
    }
    if (!opts.lowercase && UTM_FIELDS.some((f) => /[A-Z]/.test(cleaned[f.key]))) {
        warnings.push("UTM values are case-sensitive: \"Facebook\" and \"facebook\" show as two different sources.");
    }
    if (url.length > 300) warnings.push("This is a long link. Consider a shorter campaign name, or use a link shortener for print and SMS.");

    return { url, errors, warnings, cleaned };
}
