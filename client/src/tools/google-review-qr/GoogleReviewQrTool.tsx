import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Download, ExternalLink, Printer } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { parseReviewInput } from "./reviewLink";
import { CARD_H, CARD_W, cardSvg, download, luminance, makeQr, printHtml, printSheetHtml, qrPng, qrSvg, slugify, svgToPng } from "./qr";

const PLACE_ID_FINDER = "https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder";
const BUSINESS_PROFILE = "https://business.google.com/";
const EXAMPLE_LINK = "https://g.page/r/example/review";

// Colours for the printed card and QR code (the user's brand, not the site theme)
const COLOURS = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "Navy", hex: "#1f3a68" },
    { name: "Blue", hex: "#1a73e8" },
    { name: "Green", hex: "#188038" },
    { name: "Red", hex: "#c5221f" },
    { name: "Copper", hex: "#a85d22" },
    { name: "Purple", hex: "#5b2c83" },
];

const ERRORS: Record<string, string> = {
    "maps-link":
        "That's a Google Maps link. It shows your business but doesn't open the review box. Use one of the two ways below to get the right link or ID.",
    "short-link":
        "That's a shortened Maps link, which can't be read from here. Use one of the two ways below to get your review link or Place ID.",
    unrecognised: "That doesn't look like a Google review link or Place ID. Check it against the two ways below.",
};

const track = (action: string) => trackEvent("tool_use", { tool: "google-review-qr", action });

const label = "block font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-2";
const field =
    "w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors";
const button =
    "inline-flex items-center justify-center gap-2 h-11 px-4 text-[14px] font-semibold border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
const primaryButton = `${button} bg-primary text-primary-foreground border-primary hover:opacity-90`;
const secondaryButton = `${button} bg-background text-foreground border-border hover:border-primary hover:text-primary`;

function useCopy() {
    const [copied, setCopied] = useState<string | null>(null);
    const copy = async (key: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
        }
        setCopied(key);
        track(`copy_${key}`);
        setTimeout(() => setCopied(c => (c === key ? null : c)), 1800);
    };
    return { copied, copy };
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
    return (
        <div className="border-t border-border pt-6">
            <h3 className="flex items-baseline gap-3 font-semibold text-[17px] text-foreground mb-4">
                <span className="font-mono text-[12px] text-primary">0{n}</span>
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function GoogleReviewQrTool({ embedded = false }: { embedded?: boolean }) {
    const [input, setInput] = useState("");
    const [business, setBusiness] = useState("");
    const [headline, setHeadline] = useState("Happy with our work? Leave us a review");
    const [footer, setFooter] = useState("It takes less than a minute. Thank you!");
    const [colour, setColour] = useState(COLOURS[0].hex);
    const [busy, setBusy] = useState(false);
    const { copied, copy } = useCopy();

    const parsed = useMemo(() => parseReviewInput(input), [input]);
    const reviewUrl = parsed.ok ? parsed.reviewUrl : null;
    const tooLight = luminance(colour) > 0.4;

    const qr = useMemo(() => makeQr(reviewUrl ?? EXAMPLE_LINK), [reviewUrl]);
    const card = useMemo(
        () => cardSvg(qr, { business, headline, footer, colour }, { width: "100%", height: "100%" }),
        [qr, business, headline, footer, colour]
    );

    const fileBase = `${slugify(business)}-review`;
    const name = business.trim() || "us";

    const smsText = reviewUrl
        ? `Hi [name], thanks for choosing ${name}! If you have a minute, we'd really appreciate a quick Google review. It helps other locals find us: ${reviewUrl}`
        : "";
    const emailText = reviewUrl
        ? `Hi [name],\n\nThanks again for choosing ${name}. If you were happy with the job, would you mind leaving us a quick Google review? It only takes a minute and makes a big difference to a small business like ours.\n\n${reviewUrl}\n\nThank you!`
        : "";

    const downloadCardPng = async () => {
        setBusy(true);
        try {
            const svg = cardSvg(qr, { business, headline, footer, colour }, { width: `${CARD_W}`, height: `${CARD_H}` });
            download(`${fileBase}-card.png`, await svgToPng(svg, 1240, Math.round((1240 * CARD_H) / CARD_W)));
            track("download_card_png");
        } finally {
            setBusy(false);
        }
    };

    const printCards = () => {
        const svg = cardSvg(qr, { business, headline, footer, colour });
        printHtml(printSheetHtml(svg, `${business || "Google"} review cards`));
        track("print_cards");
    };

    return (
        <div className={cn("grid gap-10 text-foreground", !embedded && "lg:grid-cols-[1fr_400px] lg:gap-14")}>
            {/* ── Inputs ─────────────────────────────────────────── */}
            <div className="space-y-8 min-w-0">
                <Step n={1} title="Find your Google review link">
                    <label htmlFor="grq-input" className={label}>
                        Review link or Place ID
                    </label>
                    <input
                        id="grq-input"
                        className={field}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onBlur={() => parsed.ok && track("link_ready")}
                        placeholder="g.page/r/… or ChIJ…"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {!parsed.ok && parsed.reason !== "empty" && (
                        <p role="alert" className="mt-3 text-[14px] leading-relaxed text-destructive">
                            {ERRORS[parsed.reason]}
                        </p>
                    )}
                    {reviewUrl && (
                        <div className="mt-4 bg-secondary p-4">
                            <span className={label}>Your review link</span>
                            <p className="font-mono text-[13px] break-all text-foreground">{reviewUrl}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button type="button" className={primaryButton} onClick={() => copy("link", reviewUrl)}>
                                    {copied === "link" ? <Check size={16} /> : <Copy size={16} />}
                                    {copied === "link" ? "Copied" : "Copy link"}
                                </button>
                                <a
                                    className={secondaryButton}
                                    href={reviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => track("test_link")}
                                >
                                    <ExternalLink size={16} /> Test it
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 text-[14px] leading-relaxed">
                        <div className="border border-border p-4">
                            <p className="font-semibold text-foreground mb-1">Easiest: copy it from Google</p>
                            <p className="text-muted-foreground">
                                Sign in to your{" "}
                                <a
                                    href={BUSINESS_PROFILE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2"
                                >
                                    Business Profile
                                </a>{" "}
                                (or search your business name on Google while signed in), choose{" "}
                                <strong className="text-foreground">Ask for reviews</strong>, then copy the link. It starts with g.page/r/.
                            </p>
                        </div>
                        <div className="border border-border p-4">
                            <p className="font-semibold text-foreground mb-1">Or: look up your Place ID</p>
                            <p className="text-muted-foreground">
                                Search your business on Google's free{" "}
                                <a
                                    href={PLACE_ID_FINDER}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2"
                                >
                                    Place ID Finder
                                </a>{" "}
                                map, then copy the code shown under your business name. It usually starts with ChIJ.
                            </p>
                        </div>
                    </div>
                </Step>

                <Step n={2} title="Make it yours">
                    <div className="grid gap-5">
                        <div>
                            <label htmlFor="grq-business" className={label}>
                                Business name <span className="normal-case tracking-normal font-sans">(for the card and messages)</span>
                            </label>
                            <input
                                id="grq-business"
                                className={field}
                                value={business}
                                maxLength={34}
                                onChange={e => setBusiness(e.target.value)}
                                placeholder="e.g. Smith & Sons Plumbing"
                            />
                        </div>
                        <div>
                            <label htmlFor="grq-headline" className={label}>
                                Card headline
                            </label>
                            <input
                                id="grq-headline"
                                className={field}
                                value={headline}
                                maxLength={60}
                                onChange={e => setHeadline(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="grq-footer" className={label}>
                                Small print
                            </label>
                            <input
                                id="grq-footer"
                                className={field}
                                value={footer}
                                maxLength={80}
                                onChange={e => setFooter(e.target.value)}
                            />
                        </div>
                        <fieldset>
                            <legend className={label}>Colour</legend>
                            <div className="flex flex-wrap items-center gap-2">
                                {COLOURS.map(c => (
                                    <button
                                        key={c.hex}
                                        type="button"
                                        aria-label={c.name}
                                        aria-pressed={colour === c.hex}
                                        onClick={() => setColour(c.hex)}
                                        className={cn(
                                            "w-9 h-9 border-2 transition-transform",
                                            colour === c.hex ? "border-foreground scale-110" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: c.hex }}
                                    />
                                ))}
                                <label className="ml-1 inline-flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer">
                                    <input
                                        type="color"
                                        value={colour}
                                        onChange={e => setColour(e.target.value)}
                                        className="w-9 h-9 p-0 border border-border bg-transparent cursor-pointer"
                                        aria-label="Custom colour"
                                    />
                                    Custom
                                </label>
                            </div>
                            {tooLight && (
                                <p className="mt-3 text-[13px] text-destructive">
                                    That colour is quite light. QR codes scan best in a dark colour on white.
                                </p>
                            )}
                        </fieldset>
                    </div>
                </Step>
            </div>

            {/* Messages sit under the inputs on desktop, and after the card on phones */}
            {reviewUrl && (
                <div className={cn("min-w-0 order-last", !embedded && "lg:order-none lg:col-start-1 lg:row-start-2")}>
                    <Step n={3} title="Send it to customers">
                        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                            Ask within a day of finishing the job, while it's fresh. Swap [name] for the customer's first name.
                        </p>
                        <div className="grid gap-4">
                            {[
                                { key: "sms", title: "Text message", text: smsText },
                                { key: "email", title: "Email", text: emailText },
                            ].map(msg => (
                                <div key={msg.key} className="border border-border">
                                    <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-border">
                                        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                                            {msg.title}
                                        </span>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:opacity-80"
                                            onClick={() => copy(msg.key, msg.text)}
                                        >
                                            {copied === msg.key ? <Check size={14} /> : <Copy size={14} />}
                                            {copied === msg.key ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                    </Step>
                </div>
            )}

            {/* ── Preview and downloads ──────────────────────────── */}
            <div className={cn("min-w-0", !embedded && "lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28 lg:self-start")}>
                <div className="bg-secondary p-5 sm:p-6">
                    <span className={label}>{reviewUrl ? "Your review card" : "Preview (example code)"}</span>
                    <div className="relative mx-auto max-w-[320px] shadow-[0_12px_32px_-16px_rgba(0,0,0,0.35)]">
                        <div
                            className={cn("aspect-[105/148] bg-white [&>svg]:block", !reviewUrl && "opacity-45")}
                            role="img"
                            aria-label={reviewUrl ? "Review card with QR code" : "Example review card"}
                            dangerouslySetInnerHTML={{ __html: card }}
                        />
                        {!reviewUrl && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-background text-foreground font-mono text-[11px] tracking-[0.16em] uppercase px-3 py-2 border border-border">
                                    Add your link first
                                </span>
                            </span>
                        )}
                    </div>

                    <div className="mt-6 grid gap-2">
                        <button type="button" className={primaryButton} disabled={!reviewUrl} onClick={printCards}>
                            <Printer size={16} /> Print 4 cards on A4
                        </button>
                        <button type="button" className={secondaryButton} disabled={!reviewUrl || busy} onClick={downloadCardPng}>
                            <Download size={16} /> Download card (PNG)
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                className={secondaryButton}
                                disabled={!reviewUrl}
                                onClick={() => {
                                    download(`${fileBase}-qr.png`, qrPng(qr, colour));
                                    track("download_qr_png");
                                }}
                            >
                                <Download size={16} /> QR PNG
                            </button>
                            <button
                                type="button"
                                className={secondaryButton}
                                disabled={!reviewUrl}
                                onClick={() => {
                                    download(`${fileBase}-qr.svg`, qrSvg(qr, colour), "image/svg+xml");
                                    track("download_qr_svg");
                                }}
                            >
                                <Download size={16} /> QR SVG
                            </button>
                        </div>
                    </div>
                    <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                        PNG for screens, emails and socials. SVG stays sharp at any size, so send it to your printer for signs and stickers.
                        Everything is made in your browser; nothing you type is sent anywhere.
                    </p>
                </div>
            </div>
        </div>
    );
}
