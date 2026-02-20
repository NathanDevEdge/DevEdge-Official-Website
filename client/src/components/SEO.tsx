import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SEO({
    title = "DevEdge Solutions | Custom Software & Web Development Australia",
    description = "Unlock your company's potential with custom digital tools. From automation to enterprise software, we deliver cutting-edge solutions.",
    keywords = "software development, web development, mobile apps, custom software, australia",
    image = "https://devedge.com.au/og-image.jpg",
    url = "https://devedge.com.au/"
}: SEOProps) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            <link rel="canonical" href={url} />
        </Helmet>
    );
}
