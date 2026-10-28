// Shared site details used by the nav, footer and legal pages.

export const SITE = {
  name: "DevEdge",
  url: "https://devedge.com.au",
  email: "info@devedge.com.au",
  phone: "0490 214 750",
  phoneHref: "tel:+61490214750",
  // Shown in the footer and legal pages once set
  abn: (import.meta.env.VITE_BUSINESS_ABN as string | undefined) ?? "",
};

// Home page anchors → slide section ids
export const HOME_SECTIONS: Record<string, string> = {
  "#services": "slide-04",
  "#about": "slide-05",
  "#faq": "slide-08",
};

export const NAV_LINKS = [
  { name: "Services", href: "/#services" },
  { name: "Work", href: "/projects" },
  { name: "About", href: "/#about" },
  { name: "Insights", href: "/blog" },
];

export const PORTAL_LOGIN_HREF = "/portal/login";
