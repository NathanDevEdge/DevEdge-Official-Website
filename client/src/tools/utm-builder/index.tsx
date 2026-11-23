import { defineTool } from "../types";
import UtmBuilder from "./UtmBuilder";

function About() {
    return (
        <>
            <h2>How to use the UTM builder</h2>
            <p>
                A UTM link is your normal web address with a few labels added to the end. When someone clicks it, Google Analytics reads
                those labels and records exactly where the visit came from. This builder adds the labels for you, in a consistent format, so
                your reports stay tidy.
            </p>
            <ol>
                <li>
                    <strong>Paste the page you want people to land on.</strong> Use the exact page, not just your home page, for example{" "}
                    <code>yourbusiness.com.au/spring-offer</code>. If you leave off <code>https://</code>, we add it.
                </li>
                <li>
                    <strong>Pick where you're sharing it.</strong> The buttons fill in the source and medium the same way every time (for example a
                    Facebook ad is <code>facebook</code> / <code>paid_social</code>). You can type your own instead.
                </li>
                <li>
                    <strong>Name the campaign.</strong> Something you'll recognise in six months: <code>spring_sale</code>,{" "}
                    <code>open_day_2027</code>, <code>new_range_launch</code>.
                </li>
                <li>
                    <strong>Add content or term if they help.</strong> Content tells two ads or buttons apart (<code>video_ad</code> vs{" "}
                    <code>photo_ad</code>). Term is for a keyword or audience. Both are optional.
                </li>
                <li>
                    <strong>Copy the link and use it</strong> in your ad, post, email or QR code. Click "Test it" first to check the page opens.
                </li>
            </ol>

            <h2>What each UTM field means</h2>
            <table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>It answers</th>
                        <th>Examples</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <code>utm_source</code>
                        </td>
                        <td>Which website, platform or list sent the visit?</td>
                        <td>facebook, instagram, google, newsletter, flyer</td>
                    </tr>
                    <tr>
                        <td>
                            <code>utm_medium</code>
                        </td>
                        <td>What kind of link was it?</td>
                        <td>paid_social, social, email, cpc, qr</td>
                    </tr>
                    <tr>
                        <td>
                            <code>utm_campaign</code>
                        </td>
                        <td>Which promotion was it part of?</td>
                        <td>spring_sale, black_friday, hiring_2027</td>
                    </tr>
                    <tr>
                        <td>
                            <code>utm_content</code>
                        </td>
                        <td>Which ad, image or button?</td>
                        <td>video_ad, carousel, header_button</td>
                    </tr>
                    <tr>
                        <td>
                            <code>utm_term</code>
                        </td>
                        <td>Which keyword or audience?</td>
                        <td>deck_builders, lookalike_1pc</td>
                    </tr>
                </tbody>
            </table>

            <h2>Naming rules that keep your reports clean</h2>
            <p>
                Google Analytics treats every different spelling as a different thing. <code>Facebook</code>, <code>facebook</code> and{" "}
                <code>fb</code> become three separate rows, and your numbers get split three ways. A few rules fix that:
            </p>
            <ul>
                <li>
                    <strong>Lowercase everything.</strong> The builder does this by default.
                </li>
                <li>
                    <strong>No spaces.</strong> Use underscores or dashes. The builder swaps spaces for you.
                </li>
                <li>
                    <strong>One name per platform, forever.</strong> Decide on <code>facebook</code> and never use <code>fb</code>.
                </li>
                <li>
                    <strong>Use mediums Google Analytics understands.</strong> <code>paid_social</code> puts Facebook and Instagram ads in the Paid
                    Social channel, <code>social</code> puts normal posts in Organic Social, and <code>email</code> lands in Email. Made-up
                    mediums like <code>ads</code> end up under "Unassigned".
                </li>
                <li>
                    <strong>Write your names down.</strong> A shared list (even a spreadsheet) stops the team inventing new spellings.
                </li>
            </ul>

            <h2>A worked example</h2>
            <p>
                Say a builder is running a Facebook ad for a spring decking offer, with two versions of the ad: a video and a photo. They'd build
                two links that only differ by content:
            </p>
            <ul>
                <li>
                    <code>https://yourbusiness.com.au/decking-offer?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=spring_decking&amp;utm_content=video</code>
                </li>
                <li>
                    <code>https://yourbusiness.com.au/decking-offer?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=spring_decking&amp;utm_content=photo</code>
                </li>
            </ul>
            <p>
                A week later, Google Analytics shows <code>facebook / paid_social</code> as the source, <code>spring_decking</code> as the
                campaign, and how many visits and enquiries each version brought in. Now the decision about which ad to keep is based on enquiries,
                not likes.
            </p>

            <h2>Where to see the results</h2>
            <p>
                In Google Analytics 4, open <strong>Reports → Acquisition → Traffic acquisition</strong> and change the first column to{" "}
                <strong>Session source / medium</strong> or <strong>Session campaign</strong>. Visits usually show within a day. If you track
                enquiries as key events, you'll see which links brought in leads, not just clicks.
            </p>

            <h2>When not to use UTM links</h2>
            <ul>
                <li>
                    <strong>Links between pages on your own website.</strong> They restart the visit and wipe out where the person really came from.
                </li>
                <li>
                    <strong>Google Ads with auto-tagging on.</strong> Google already tags those clicks, and adding UTMs can override its data.
                </li>
                <li>
                    <strong>Anything private.</strong> UTM values are visible to anyone who sees the link, so never put names, emails or phone
                    numbers in them.
                </li>
            </ul>
            <p>
                UTM links tell you where visits come from. Seeing which of those visits became paying customers takes your website, your
                analytics and your CRM working together. That's what our <a href="/services/tracking-and-reporting">tracking and reporting</a>{" "}
                work sets up.
            </p>
        </>
    );
}

export default defineTool({
    slug: "utm-builder",
    name: "UTM Link Builder",
    linkText: "UTM link builder by DevEdge",
    categories: ["marketing"],
    summary: "Turn any link into a tracked link, so Google Analytics shows which ad, post or email sent each visitor.",
    tagline:
        "Add UTM tags to any link in seconds, so Google Analytics shows exactly which ad, post or email each visitor came from. Free, no sign-up.",
    seoTitle: "Free UTM Builder: Create Tracked Links for GA4 | DevEdge",
    seoDescription:
        "Free UTM link builder. Add utm_source, medium and campaign tags to any URL in seconds, with presets for Facebook, Instagram and email. No sign-up needed.",
    launched: "2026-11-23",
    featured: true,
    Component: UtmBuilder,
    About,
    faqs: [
        {
            q: "What is a UTM builder?",
            a: "A UTM builder adds tracking tags (utm_source, utm_medium, utm_campaign and optionally utm_content and utm_term) to the end of a web address. When someone clicks the link, Google Analytics reads the tags and records where the visit came from.",
        },
        {
            q: "Is this UTM generator free?",
            a: "Yes. It's free with no sign-up and no limits. It runs in your browser, so nothing you type is sent to us or anyone else.",
        },
        {
            q: "Which UTM fields do I need?",
            a: "Source, medium and campaign. Google Analytics needs all three to report a campaign properly. Content and term are optional extras for telling ads or audiences apart.",
        },
        {
            q: "Do UTM tags affect SEO?",
            a: "No. UTM links are for links you share elsewhere: ads, social posts, emails and QR codes. Don't use them on links between pages of your own website, because that restarts the visit and hides where the person really came from.",
        },
        {
            q: "Should I add UTMs to Google Ads?",
            a: "Usually not. Google Ads auto-tagging already tells Google Analytics about each click, with more detail than UTMs. Only add them if auto-tagging is switched off or you also send the traffic to another analytics tool.",
        },
        {
            q: "Are UTM values case-sensitive?",
            a: "Yes. \"Facebook\" and \"facebook\" show as two different sources in Google Analytics. That's why the builder makes everything lowercase by default.",
        },
        {
            q: "Can I put this UTM builder on my own website?",
            a: "Yes. Scroll to \"Embed this tool\", pick light or dark and your brand colour, and paste the code into your site. It's free, sets no cookies and resizes itself.",
        },
    ],
    related: {
        service: "tracking-and-reporting",
        post: "meta-ads-tracking-small-business",
        tools: ["google-review-qr"],
    },
    embedHeight: 860,
});
