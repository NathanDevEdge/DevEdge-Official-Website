import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    /** Canonical URL for this page. Defaults to the current window URL. */
    url?: string;
    /** "website" for regular pages, "article" for blog posts */
    type?: "website" | "article";
    /** ISO date string — set on blog posts */
    publishedTime?: string;
}

export default function SEO({
    title = "DevEdge — Custom Software & Web Development Australia",
    description = "We build things that actually work. DevEdge is a small, sharp software team building custom web platforms, backend systems, and automation for Australian businesses that need results.",
    keywords = "custom software development, web development, backend systems, process automation, australia",
    image = "https://devedge.com.au/og-image.jpg",
    url,
    type = "website",
    publishedTime,
}: SEOProps) {
    // Resolve canonical — use the explicitly passed URL, or fall back to the
    // current browser URL (always defined in a CSR context).
    const canonicalUrl =
        url ?? (typeof window !== "undefined" ? window.location.href : "https://devedge.com.au/");

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="DevEdge" />
            <meta property="og:locale" content="en_AU" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Article-specific Open Graph tags */}
            {publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
    );
}
