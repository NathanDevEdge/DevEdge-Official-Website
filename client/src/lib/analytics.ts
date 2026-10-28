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

// Portal and admin activity is private and not tracked
export const isTrackedPath = (path: string) => !/^\/(portal|admin|login)(\/|$)/.test(path);

let initialised = false;

export function initAnalytics() {
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
  window.gtag("config", GA_ID, { send_page_view: false });
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
