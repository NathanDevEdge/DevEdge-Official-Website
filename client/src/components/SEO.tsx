import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { SITE } from "@/lib/site";

const DEFAULT_TITLE = "DevEdge | Websites, Apps, CRM & Marketing for Australian Businesses";
const DEFAULT_DESCRIPTION =
    "We build things that actually work. Websites, custom apps, CRM & ERP systems and marketing that brings in customers, from one team, for Australian businesses.";
const DEFAULT_IMAGE = `${SITE.url}/og-image.jpg?v=3`;

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    /** Canonical URL. Defaults to this route on devedge.com.au. */
    url?: string;
    /** "website" for regular pages, "article" for blog posts */
    type?: "website" | "article";
    /** ISO date string — set on blog posts */
    publishedTime?: string;
    /** Structured data objects, rendered as JSON-LD */
    jsonLd?: object | object[];
    noindex?: boolean;
}

export default function SEO({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url,
    type = "website",
    publishedTime,
    jsonLd,
    noindex,
}: SEOProps) {
    const [path] = useLocation();
    const canonicalUrl = url ?? `${SITE.url}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
    const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {noindex && <meta name="robots" content="noindex" />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="DevEdge" />
            <meta property="og:locale" content="en_AU" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {publishedTime && <meta property="article:published_time" content={publishedTime} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <link rel="canonical" href={canonicalUrl} />

            {schemas.map((schema, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
}
