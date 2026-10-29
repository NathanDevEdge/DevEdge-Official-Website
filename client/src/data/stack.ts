// The layers of "The Stack" (components/three/StackScene.tsx). Kept separate so pages can
// list them without pulling three.js into their bundle.
export type Detail = "target" | "bars" | "graph" | "browser" | "devices" | "database" | "rack" | "invoice";
export type StackLayer = { slug: string; name: string; short: string; h: number; detail: Detail };

// Top to bottom: traffic comes in at the top and flows down into the systems underneath
export const STACK_LAYERS: StackLayer[] = [
    { slug: "paid-media", name: "Paid Media", short: "Ads", h: 0.34, detail: "target" },
    { slug: "seo", name: "SEO", short: "SEO", h: 0.34, detail: "bars" },
    { slug: "tracking-and-reporting", name: "Tracking & Reporting", short: "Tracking", h: 0.34, detail: "graph" },
    { slug: "websites", name: "Websites", short: "Websites", h: 0.42, detail: "browser" },
    { slug: "web-and-mobile-apps", name: "Web & Mobile Apps", short: "Apps", h: 0.42, detail: "devices" },
    { slug: "crm-erp-systems", name: "CRM & ERP Systems", short: "CRM & ERP", h: 0.48, detail: "database" },
    { slug: "care-and-hosting", name: "Care & Hosting", short: "Hosting", h: 0.56, detail: "rack" },
];
