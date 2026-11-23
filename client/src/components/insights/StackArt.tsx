// Block-stack artwork for Insights posts. The layout is worked out from the post's slug,
// so every post gets its own picture and it's identical on the server and in the browser.

const INK = "#1A1008";

/** Small seeded random number generator (FNV-1a hash + mulberry-style mixing) */
function seeded(seed: string) {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}

type Block = { faces: { points: string; fill: string }[]; order: number };

function layout(seed: string, w: number, h: number): Block[] {
    const rand = seeded(seed);
    const ux = w / 30;
    const uy = ux / 2;
    const uz = ux * 0.85;
    const cx = w / 2;
    const cy = h * 0.74;
    const iso = (x: number, y: number, z: number) => `${(cx + (x - y) * ux).toFixed(1)},${(cy + (x + y) * uy - z * uz).toFixed(1)}`;

    const cells: [number, number, number, boolean][] = [];
    for (let x = -6; x <= 6; x++) {
        for (let y = -6; y <= 6; y++) {
            if (rand() < 0.55 - Math.hypot(x, y) * 0.05) {
                cells.push([x, y, 1 + Math.floor(rand() * rand() * 6), rand() < 0.18]);
            }
        }
    }
    // Paint back to front so nearer blocks cover the ones behind
    cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

    return cells.map(([x, y, z, hot], order) => ({
        order,
        faces: [
            { points: [iso(x, y + 1, z), iso(x + 1, y + 1, z), iso(x + 1, y + 1, 0), iso(x, y + 1, 0)].join(" "), fill: hot ? "#C97B3A" : "#2E1F0F" },
            { points: [iso(x + 1, y, z), iso(x + 1, y + 1, z), iso(x + 1, y + 1, 0), iso(x + 1, y, 0)].join(" "), fill: hot ? "#8A4F22" : "#241608" },
            { points: [iso(x, y, z), iso(x + 1, y, z), iso(x + 1, y + 1, z), iso(x, y + 1, z)].join(" "), fill: hot ? "#E0A36A" : "#3A2814" },
        ],
    }));
}

interface StackArtProps {
    seed: string;
    /** "hero" is the wide banner on a post; "thumb" is the small picture in the list */
    variant?: "hero" | "thumb";
    /** Blocks rise into place when the page loads */
    animate?: boolean;
    className?: string;
}

export default function StackArt({ seed, variant = "hero", animate = false, className = "" }: StackArtProps) {
    const [w, h] = variant === "hero" ? [1216, 360] : [400, 240];
    const blocks = layout(seed, w, h);
    const gridStep = w / 30;

    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="xMidYMid slice"
            className={`w-full h-full bg-[#1A1008] ${className || "block"}`}
            aria-hidden="true"
            focusable="false"
        >
            {Array.from({ length: 31 }, (_, i) => (
                <line key={i} x1={i * gridStep} y1={0} x2={i * gridStep} y2={h} stroke="#2E1F0F" strokeWidth={1} />
            ))}
            {blocks.map((b) => (
                <g
                    key={b.order}
                    className={animate ? "stack-rise" : undefined}
                    style={animate ? { animationDelay: `${Math.min(b.order * 18, 900)}ms` } : undefined}
                >
                    {b.faces.map((f, i) => (
                        <polygon key={i} points={f.points} fill={f.fill} stroke={INK} strokeWidth={1} strokeLinejoin="round" />
                    ))}
                </g>
            ))}
        </svg>
    );
}
