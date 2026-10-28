import { useEffect } from "react";
import { useLocation } from "wouter";
import { initAnalytics, trackEvent, trackPageView } from "@/lib/analytics";

/** Loads GA4, sends SPA page views and tracks phone / email clicks site-wide. */
export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    initAnalytics();

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("contact_click", { method: "phone" });
      else if (href.startsWith("mailto:")) trackEvent("contact_click", { method: "email" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Wait a tick so the page's <title> is updated before the page view is sent
  useEffect(() => {
    const t = setTimeout(() => trackPageView(location), 50);
    return () => clearTimeout(t);
  }, [location]);

  return null;
}
