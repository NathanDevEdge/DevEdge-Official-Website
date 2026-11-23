import { defineTool } from "@/tools/types";
import GoogleReviewQrTool from "./GoogleReviewQrTool";

function About() {
    return (
        <>
            <h2>What this tool does</h2>
            <p>
                Most customers are happy to leave a review. What stops them is the hunt: open Google, search your business, find the
                reviews tab, find the button. This tool gives you one link that skips all of that and opens the review box straight
                away, plus a QR code and a printable card that do the same thing when someone points their phone camera at them.
            </p>
            <p>
                It's free, there's no sign-up, and it all runs in your browser. Nothing you type is saved or sent to us.
            </p>

            <h2>How to use it</h2>
            <ol>
                <li>
                    <strong>Get your link or Place ID.</strong> The quickest way is from Google itself: sign in to your Google Business
                    Profile (or search your business name on Google while signed in) and choose "Ask for reviews". Copy the link it
                    gives you, which starts with g.page/r/. If you can't find that, search your business on Google's free Place ID
                    Finder and copy the ID under your business name.
                </li>
                <li>
                    <strong>Paste it in.</strong> The tool checks it and shows your review link. Press "Test it" to make sure it opens
                    your business, not someone else's.
                </li>
                <li>
                    <strong>Add your business name and pick a colour</strong> so the card matches your shopfront, van or invoices.
                </li>
                <li>
                    <strong>Download or print.</strong> Print four A6 cards on one A4 sheet, or download the card and QR code to send to
                    your printer or designer.
                </li>
            </ol>

            <h2>Where to put your review link and QR code</h2>
            <ul>
                <li>
                    <strong>Text or email it the day you finish the job.</strong> This gets more reviews than anything else. The tool
                    writes the message for you.
                </li>
                <li>
                    <strong>On the counter, the table or the waiting room wall.</strong> A printed card or stand where people wait with
                    their phone already in hand.
                </li>
                <li>
                    <strong>On invoices, receipts and quotes.</strong> Add the QR code next to your payment details.
                </li>
                <li>
                    <strong>In your email signature and on your website</strong> as a "Review us on Google" link.
                </li>
                <li>
                    <strong>On your van, business cards and job-completion forms.</strong> Use the SVG file so it prints sharp at any
                    size.
                </li>
            </ul>

            <h2>Which link should I use?</h2>
            <p>
                Both kinds of link open the same review box. The g.page link from your Business Profile is shorter, and Google
                gives it to you directly, so use it if you have it. The Place ID link (search.google.com/local/writereview) is
                built from your Place ID and works just as well. It's handy if someone else manages your profile and you only need
                the ID.
            </p>
            <p>
                An ordinary Google Maps link isn't the same thing. It shows your business, but customers still have to find the
                review button themselves, which is exactly where most of them give up.
            </p>

            <h2>Printing tips</h2>
            <ul>
                <li>Keep the code dark on a white background. Light or low-contrast colours are harder for phones to read.</li>
                <li>Print the code at least 2 cm wide for a card, and bigger for anything read from a distance, such as a sign.</li>
                <li>Scan a test print with two different phones before you print a big batch.</li>
                <li>Codes are made with extra error correction, so a small scuff or crease won't stop them working.</li>
            </ul>

            <h2>Stay within Google's rules</h2>
            <p>
                Asking every customer for an honest review is fine and encouraged. Google doesn't allow offering discounts, gifts or
                entries into a prize draw in exchange for reviews, asking only happy customers (known as review gating), or writing
                reviews for your own business. Breaking these rules can get reviews removed or your profile restricted, and in
                Australia, the ACCC treats fake or incentivised reviews as misleading conduct.
            </p>
        </>
    );
}

export default defineTool({
    slug: "google-review-qr",
    name: "Google Review Link & QR Code Generator",
    linkText: "Google review QR code generator by DevEdge",
    categories: ["marketing", "business-finance"],
    summary: "Make a one-tap Google review link, a QR code and a printable review card for your business.",
    tagline:
        "Get a link that opens your Google review box in one tap, plus a QR code and a printable card for your counter. Free, no sign-up.",
    seoTitle: "Free Google Review Link & QR Code Generator | DevEdge",
    seoDescription:
        "Create a direct Google review link and QR code for your business in seconds. Download a PNG or SVG, or print review cards. Free, no sign-up.",
    launched: "2026-11-23",
    Component: GoogleReviewQrTool,
    About,
    faqs: [
        {
            q: "Is this Google review QR code generator really free?",
            a: "Yes. There's no sign-up, no watermark and no limit. The link and QR code come straight from Google's own review address, so they keep working whether or not you ever come back to this page.",
        },
        {
            q: "How do I find my Google review link?",
            a: "Sign in to your Google Business Profile, or search your business name on Google while signed in, and choose \"Ask for reviews\". Copy the link it shows you, which starts with g.page/r/, and paste it into the tool.",
        },
        {
            q: "What is a Google Place ID?",
            a: "It's the unique code Google uses for your business listing, usually starting with ChIJ. You can find it by searching your business on Google's free Place ID Finder. The tool turns it into a link that opens your review box directly.",
        },
        {
            q: "Will the QR code stop working?",
            a: "No. The code holds your review link itself, not a redirect through our site, so it keeps working as long as your Google Business Profile exists. If your business moves and gets a new listing, make a new code.",
        },
        {
            q: "Can customers leave a review without a Google account?",
            a: "No. Google asks reviewers to sign in. Most people with an Android phone or Gmail address are already signed in, so for them it's one tap.",
        },
        {
            q: "Can I offer a discount for a Google review?",
            a: "No. Google's policies don't allow incentives for reviews, and in Australia the ACCC treats incentivised or fake reviews as misleading. Ask every customer, make it easy, and say thank you.",
        },
        {
            q: "Do you store my business details?",
            a: "No. Everything is generated in your browser. Nothing you type is sent to DevEdge or anyone else.",
        },
    ],
    related: {
        service: "seo",
        post: "how-to-get-more-google-reviews",
        tools: ["utm-builder"],
    },
    embedHeight: 1200,
});
