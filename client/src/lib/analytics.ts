// Google Analytics 4. The measurement ID is public (it's in every page's source);
// VITE_GA_MEASUREMENT_ID can override it, e.g. set to "off" to disable locally.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const configuredId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? "G-PY5NKZ040Q";
export const GA_ID = configuredId === "off" || import.meta.env.DEV ? "" : configuredId;

// Portal and admin activity is private and not tracked. Embeds (/embed/<tool>) run on other
// people's sites: they send one cookieless tool_embed_view (trackEmbedView) and nothing else.
export const isTrackedPath = (path: string) => !/^\/(portal|admin|login|embed)(\/|$)/.test(path);

let initialised = false;

export function initAnalytics({ cookieless = false }: { cookieless?: boolean } = {}) {
  if (!GA_ID || initialised || typeof window === "undefined") return;
  initialised = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag expects the arguments object itself
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // Page views are sent manually on route change (single-page app)
  // Cookieless mode (embeds) stores nothing in the visitor's browser
  window.gtag("config", GA_ID, cookieless ? { send_page_view: false, client_storage: "none", allow_google_signals: false, allow_ad_personalization_signals: false } : { send_page_view: false });
}

export function trackPageView(path: string) {
  if (!GA_ID || !window.gtag || !isTrackedPath(path)) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!GA_ID || !window.gtag || !isTrackedPath(window.location.pathname)) return;
  window.gtag("event", name, params);
}

/**
 * One event per embed load, so we can count how many sites use each tool. Runs only when
 * the page really is inside someone else's iframe, and never sets cookies.
 */
export function trackEmbedView(tool: string) {
  if (!GA_ID || typeof window === "undefined" || window.self === window.top) return;
  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    /* unreadable referrer */
  }
  if (host === "devedge.com.au" || host === "localhost") return; // our own previews
  initAnalytics({ cookieless: true });
  window.gtag?.("event", "tool_embed_view", { tool, embed_host: host || "(unknown)" });
}
