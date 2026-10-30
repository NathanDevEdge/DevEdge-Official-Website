// Shared site details used by the nav, footer and legal pages.

export const SITE = {
  name: "DevEdge",
  url: "https://devedge.com.au",
  email: "info@devedge.com.au",
  phone: "0490 214 750",
  phoneHref: "tel:+61490214750",
  abn: "55 755 335 958",
  // Google Business Profile (Maps CID)
  mapsUrl: "https://maps.google.com/?cid=15738316270805678872",
};

// DevEdge's official profiles elsewhere. Listed as schema.org sameAs so Google
// ties them to this site; add each new directory or social profile here.
export const PROFILES: string[] = [SITE.mapsUrl];

// Home page anchors that don't match a section id directly
export const HOME_SECTIONS: Record<string, string> = {
  "#services": "what-we-do",
};

export const NAV_LINKS = [
  { name: "Services", href: "/services" },
  { name: "Work", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Insights", href: "/blog" },
];

export const PORTAL_LOGIN_HREF = "/portal/login";
