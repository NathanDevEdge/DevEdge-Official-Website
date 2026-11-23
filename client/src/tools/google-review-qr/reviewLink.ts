// Turns whatever a business owner pastes (a Place ID, a Google "ask for reviews"
// share link, a review link or a Maps link) into a link that opens Google's
// "write a review" box. Runs entirely in the browser: no API key, no server.

export type ParsedReviewInput =
    | { ok: true; kind: "place-id" | "share-link"; reviewUrl: string; placeId?: string }
    | { ok: false; reason: "empty" | "maps-link" | "short-link" | "unrecognised" };

/** Google's own review URL for a Place ID: opens the business with the review box ready */
export const reviewUrlForPlaceId = (placeId: string) =>
    `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

// Place IDs are URL-safe base64 text, usually starting "ChIJ" and 27+ characters long
const PLACE_ID = /^[A-Za-z0-9_-]{20,}$/;

export function parseReviewInput(raw: string): ParsedReviewInput {
    const input = raw.trim().replace(/^["'<\s]+|["'>\s]+$/g, "");
    if (!input) return { ok: false, reason: "empty" };

    // A bare Place ID
    if (PLACE_ID.test(input)) {
        return { ok: true, kind: "place-id", placeId: input, reviewUrl: reviewUrlForPlaceId(input) };
    }

    let url: URL;
    try {
        url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    } catch {
        return { ok: false, reason: "unrecognised" };
    }
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    // The share link from Google Business Profile's "Ask for reviews": g.page/r/<code>/review
    if (host === "g.page") {
        const match = url.pathname.match(/^\/r\/([A-Za-z0-9_-]+)/);
        if (match) return { ok: true, kind: "share-link", reviewUrl: `https://g.page/r/${match[1]}/review` };
        return { ok: false, reason: "unrecognised" };
    }

    // Any Google URL that carries the Place ID in its query string
    const fromQuery =
        url.searchParams.get("placeid") ??
        url.searchParams.get("place_id") ??
        url.searchParams.get("query_place_id") ??
        url.searchParams.get("q")?.match(/place_id:([A-Za-z0-9_-]+)/)?.[1] ??
        null;
    if (fromQuery && PLACE_ID.test(fromQuery) && /(^|\.)google\./.test(host)) {
        return { ok: true, kind: "place-id", placeId: fromQuery, reviewUrl: reviewUrlForPlaceId(fromQuery) };
    }

    // Short links can't be opened from the browser to see where they lead
    if (host === "maps.app.goo.gl" || host === "goo.gl" || host === "g.co") return { ok: false, reason: "short-link" };

    // Ordinary Maps or Search links don't contain the Place ID
    if (/(^|\.)google\./.test(host)) return { ok: false, reason: "maps-link" };

    return { ok: false, reason: "unrecognised" };
}
