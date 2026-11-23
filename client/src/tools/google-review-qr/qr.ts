// QR code and printable review card builders. Everything is drawn in the browser:
// the QR as SVG paths, PNGs on a canvas, the card as one SVG that prints sharp.
import qrcode from "qrcode-generator";

export type QrMatrix = { size: number; dark: (row: number, col: number) => boolean };

const QUIET_ZONE = 4; // modules of white border scanners need around the code

/** Error correction Q (25%) so a scuffed or slightly smudged printed code still scans */
export function makeQr(text: string): QrMatrix {
    const qr = qrcode(0, "Q");
    qr.addData(text, "Byte");
    qr.make();
    return { size: qr.getModuleCount(), dark: (r, c) => qr.isDark(r, c) };
}

/** One SVG path for every dark module, in module units (no quiet zone) */
function modulesPath(m: QrMatrix) {
    let d = "";
    for (let r = 0; r < m.size; r++) {
        for (let c = 0; c < m.size; c++) {
            if (m.dark(r, c)) d += `M${c} ${r}h1v1h-1z`;
        }
    }
    return d;
}

const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A standalone QR code SVG, with its quiet zone, ready to download or scale */
export function qrSvg(m: QrMatrix, colour: string) {
    const total = m.size + QUIET_ZONE * 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="1024" height="1024" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/><path transform="translate(${QUIET_ZONE} ${QUIET_ZONE})" fill="${esc(colour)}" d="${modulesPath(m)}"/></svg>`;
}

/** The QR code as a PNG data URL, drawn module by module so every edge is crisp */
export function qrPng(m: QrMatrix, colour: string, px = 1200) {
    const total = m.size + QUIET_ZONE * 2;
    const cell = Math.floor(px / total);
    const size = cell * total;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = colour;
    for (let r = 0; r < m.size; r++) {
        for (let c = 0; c < m.size; c++) {
            if (m.dark(r, c)) ctx.fillRect((c + QUIET_ZONE) * cell, (r + QUIET_ZONE) * cell, cell, cell);
        }
    }
    return canvas.toDataURL("image/png");
}

/** Splits text into lines of at most `max` characters, breaking on spaces */
export function wrap(text: string, max: number) {
    const lines: string[] = [];
    let line = "";
    for (const word of text.trim().split(/\s+/)) {
        if (!word) continue;
        if (line && (line + " " + word).length > max) {
            lines.push(line);
            line = word;
        } else {
            line = line ? `${line} ${word}` : word;
        }
    }
    if (line) lines.push(line);
    return lines;
}

const star = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? r : r * 0.45;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}"/>`;
};

export type CardOptions = {
    business: string;
    headline: string;
    footer: string;
    colour: string;
};

// A6 portrait (105 × 148 mm) in tenths of a millimetre
export const CARD_W = 1050;
export const CARD_H = 1480;
const FONT = `'Helvetica Neue', Helvetica, Arial, sans-serif`;

/** The printable review card: business name, stars, headline, QR code, scan prompt */
export function cardSvg(m: QrMatrix, o: CardOptions, { width = "105mm", height = "148mm" } = {}) {
    const total = m.size + QUIET_ZONE * 2;
    const headline = wrap(o.headline || "Leave us a Google review", 20).slice(0, 3);
    const business = o.business.trim();
    const footer = wrap(o.footer, 40).slice(0, 2);

    let y = 150;
    const parts: string[] = [];
    parts.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="#ffffff"/>`);
    parts.push(`<rect width="${CARD_W}" height="22" fill="${esc(o.colour)}"/>`);

    if (business) {
        parts.push(
            `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="700" letter-spacing="5" fill="${esc(o.colour)}">${esc(business.toUpperCase().slice(0, 34))}</text>`,
        );
        y += 90;
    } else {
        y += 20;
    }

    const starGap = 92;
    const starsX = CARD_W / 2 - starGap * 2;
    parts.push(`<g fill="#F4B400">${[0, 1, 2, 3, 4].map((i) => star(starsX + i * starGap, y, 36)).join("")}</g>`);
    y += 130;

    for (const line of headline) {
        parts.push(
            `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="76" font-weight="800" fill="#1a1a1a">${esc(line)}</text>`,
        );
        y += 88;
    }
    y += 10;

    // QR fills the space left, between 520 and 640 wide
    const footerSpace = 70 + footer.length * 44 + 70;
    const qrSize = Math.max(520, Math.min(640, CARD_H - y - footerSpace - 40));
    const qrX = (CARD_W - qrSize) / 2;
    const scale = qrSize / total;
    parts.push(
        `<g transform="translate(${qrX.toFixed(1)} ${y}) scale(${scale.toFixed(4)})" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="#ffffff"/><path transform="translate(${QUIET_ZONE} ${QUIET_ZONE})" fill="${esc(o.colour)}" d="${modulesPath(m)}"/></g>`,
    );
    y += qrSize + 60;

    parts.push(
        `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="#1a1a1a">Scan with your phone camera</text>`,
    );
    y += 56;
    for (const line of footer) {
        parts.push(
            `<text x="${CARD_W / 2}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="32" fill="#666666">${esc(line)}</text>`,
        );
        y += 44;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_W} ${CARD_H}" width="${width}" height="${height}">${parts.join("")}</svg>`;
}

/** Renders an SVG string to a PNG data URL at the given width */
export function svgToPng(svg: string, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("Couldn't draw the card"));
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
}

/** An A4 page of four A6 cards with light cut lines, for printing at home or the office */
export function printSheetHtml(card: string, title: string) {
    return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
@page { size: A4 portrait; margin: 0; }
html, body { margin: 0; padding: 0; background: #fff; }
.sheet { width: 210mm; height: 297mm; display: grid; grid-template-columns: 105mm 105mm; grid-template-rows: 148.5mm 148.5mm; }
.cell { display: flex; align-items: center; justify-content: center; outline: 0.2mm dashed #c8c8c8; outline-offset: -0.1mm; overflow: hidden; }
.cell svg { display: block; }
</style></head><body><div class="sheet">${[0, 1, 2, 3].map(() => `<div class="cell">${card}</div>`).join("")}</div></body></html>`;
}

/** Starts a file download for a data URL or text */
export function download(filename: string, data: string, type?: string) {
    const href = type ? URL.createObjectURL(new Blob([data], { type })) : data;
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (type) setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** Prints HTML through a hidden iframe, so it works inside an embed too */
export function printHtml(html: string) {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(frame);
    const doc = frame.contentDocument!;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
        setTimeout(() => frame.remove(), 60_000);
    }, 250);
}

/** Relative luminance, 0 (black) to 1 (white). Light QR colours don't scan reliably. */
export function luminance(hex: string) {
    const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return 0;
    const [r, g, b] = m.slice(1).map((h) => {
        const v = parseInt(h, 16) / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "google-review";
