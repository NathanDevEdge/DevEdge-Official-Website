// schema.org structured data builders (rendered as JSON-LD via <SEO jsonLd>)
import { PROFILES, SITE } from "@/lib/site";
import type { Service } from "@/data/services";

const ORG_ID = `${SITE.url}/#organization`;

export const organizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "DevEdge",
    url: SITE.url,
    logo: `${SITE.url}/images/logo-512.png`,
    image: `${SITE.url}/og-image.jpg`,
    description:
        "Websites, custom apps, CRM & ERP systems and marketing for Australian businesses. One team that builds the systems and brings the customers.",
    email: SITE.email,
    telephone: "+61490214750",
    taxID: SITE.abn ? `ABN ${SITE.abn}` : undefined,
    areaServed: { "@type": "Country", name: "Australia" },
    address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressRegion: "VIC", addressCountry: "AU" },
    hasMap: SITE.mapsUrl,
    sameAs: PROFILES,
    founder: { "@type": "Person", name: "Nathan Anniss" },
    knowsAbout: ["Web development", "Custom software", "CRM implementation", "ERP systems", "Zoho", "HubSpot", "Xero", "NetSuite", "Meta Ads", "Google Ads", "SEO", "Conversion tracking"],
});

export const serviceSchema = (s: Service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.seoDescription,
    url: `${SITE.url}/services/${s.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Australia" },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${SITE.url}${item.path}`,
    })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
});
