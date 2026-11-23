// schema.org structured data builders (rendered as JSON-LD via <SEO jsonLd>)
import { PROFILES, SITE } from "@/lib/site";
import type { Service } from "@/data/services";
import type { BlogPost } from "@shared/blog";

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

/** The /insights index: the blog itself, with a summary of every post */
export const blogSchema = (posts: BlogPost[]) => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/insights#blog`,
    name: "DevEdge Insights",
    url: `${SITE.url}/insights`,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-AU",
    blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        url: `${SITE.url}/insights/${p.slug}`,
        datePublished: p.date,
        dateModified: p.updated ?? p.date,
        author: { "@type": "Person", name: p.author },
    })),
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

/** A Free Tool page (/tools/<slug>) */
export const webApplicationSchema = (t: {
    slug: string;
    name: string;
    seoDescription: string;
    category: string;
    launched: string;
    updated?: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE.url}/tools/${t.slug}#app`,
    name: t.name,
    url: `${SITE.url}/tools/${t.slug}`,
    description: t.seoDescription,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: t.category,
    operatingSystem: "Any (runs in the browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    datePublished: t.launched,
    dateModified: t.updated ?? t.launched,
    inLanguage: "en-AU",
    publisher: { "@id": ORG_ID },
    creator: { "@id": ORG_ID },
});

/** The /tools hub or a category page: a collection with a list of its tools */
export const toolCollectionSchema = (c: { path: string; name: string; description: string; tools: { slug: string; name: string }[] }) => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE.url}${c.path}#collection`,
    name: c.name,
    url: `${SITE.url}${c.path}`,
    description: c.description,
    inLanguage: "en-AU",
    publisher: { "@id": ORG_ID },
    mainEntity: {
        "@type": "ItemList",
        itemListElement: c.tools.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
            url: `${SITE.url}/tools/${t.slug}`,
        })),
    },
});
