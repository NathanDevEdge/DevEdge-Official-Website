import { useId, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DEFAULTS, FIXING_SPARE_PCT, bestBoardLength, calculate, validate, type DeckInputs, type DeckResult, type Fixing } from "./calc";

// The tool UI only: no page chrome, so the same component runs on /tools/decking-calculator
// and inside the /embed iframe. Theme tokens only (no hex), so the embed's light/dark and
// accent colour options restyle it.

const STOCK_LENGTHS = [3.6, 4.2, 4.8, 5.4, 6.0];

const nf = (n: number, digits = 0) =>
    n.toLocaleString("en-AU", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const m1 = (n: number) => `${nf(n, Number.isInteger(n) ? 0 : 1)} m`;

type Fields = Record<Exclude<keyof DeckInputs, "fixing" | "runM" | "acrossM">, string> & { lengthM: string; widthM: string };

const initialFields: Fields = {
    lengthM: String(DEFAULTS.runM),
    widthM: String(DEFAULTS.acrossM),
    boardWidthMm: String(DEFAULTS.boardWidthMm),
    gapMm: String(DEFAULTS.gapMm),
    boardLengthM: String(DEFAULTS.boardLengthM),
    joistSpacingMm: String(DEFAULTS.joistSpacingMm),
    bearerSpacingMm: String(DEFAULTS.bearerSpacingMm),
    postSpacingMm: String(DEFAULTS.postSpacingMm),
    wastePct: String(DEFAULTS.wastePct),
};

const num = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(",", ".")));

// ── Small form pieces ─────────────────────────────────────────────────────────

function Group({ title, children }: { title: string; children: ReactNode }) {
    return (
        <fieldset className="border-t border-border pt-5 first:border-t-0 first:pt-0">
            <legend className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-4 float-left w-full">{title}</legend>
            <div className="clear-both grid sm:grid-cols-2 gap-x-5 gap-y-5">{children}</div>
        </fieldset>
    );
}

function NumberField({
    label,
    hint,
    unit,
    value,
    onChange,
    chips,
    chipLabel = (c) => c,
    step = "any",
    wide,
}: {
    label: string;
    hint?: string;
    unit: string;
    value: string;
    onChange: (v: string) => void;
    chips?: string[];
    chipLabel?: (c: string) => string;
    step?: string;
    wide?: boolean;
}) {
    const id = useId();
    return (
        <div className={cn(wide && "sm:col-span-2")}>
            <label htmlFor={id} className="block text-[14px] font-semibold text-foreground">
                {label}
            </label>
            {hint && <p className="text-[12.5px] leading-snug text-muted-foreground mt-0.5">{hint}</p>}
            <div className="mt-2 flex items-stretch border border-border bg-card focus-within:border-primary transition-colors">
                <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step={step}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full min-w-0 bg-transparent px-3 h-11 text-[16px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="px-3 flex items-center font-mono text-[12px] text-muted-foreground border-l border-border">{unit}</span>
            </div>
            {chips && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onChange(c)}
                            aria-pressed={value === c}
                            className={cn(
                                "px-2.5 h-7 font-mono text-[11.5px] border transition-colors",
                                value === c
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground",
                            )}
                        >
                            {chipLabel(c)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Segmented<T extends string>({
    label,
    value,
    options,
    onChange,
    wide,
}: {
    label: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
    wide?: boolean;
}) {
    return (
        <div className={cn(wide && "sm:col-span-2")} role="radiogroup" aria-label={label}>
            <span className="block text-[14px] font-semibold text-foreground">{label}</span>
            <div className="mt-2 grid grid-flow-col auto-cols-fr border border-border">
                {options.map((o) => (
                    <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={value === o.value}
                        onClick={() => onChange(o.value)}
                        className={cn(
                            "h-11 px-3 text-[14px] transition-colors border-l border-border first:border-l-0",
                            value === o.value ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Plan view ─────────────────────────────────────────────────────────────────

/** Top-down sketch of the deck: boards, joists (dashed) and bearers, to scale */
function PlanView({ inputs, result }: { inputs: DeckInputs; result: DeckResult }) {
    const W = 320;
    const H = 200;
    const pad = 10;
    // Boards run left to right in the sketch
    const scale = Math.min((W - pad * 2) / inputs.runM, (H - pad * 2) / inputs.acrossM);
    const w = inputs.runM * scale;
    const h = inputs.acrossM * scale;
    const x0 = (W - w) / 2;
    const y0 = (H - h) / 2;

    // Draw every board when they're visible, otherwise a representative stripe pattern
    const rowPx = h / result.rows;
    const drawRows = rowPx >= 2.2 ? result.rows : Math.floor(h / 3);
    const rowH = h / drawRows;

    const joistGap = w / (result.joists.count - 1);
    const bearerGap = h / (result.bearers.count - 1);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Plan view: ${result.rows} rows of boards over ${result.joists.count} joists and ${result.bearers.count} bearers`}>
            {/* Bearers, under everything */}
            {Array.from({ length: result.bearers.count }, (_, i) => (
                <rect key={`b${i}`} x={x0 - 4} y={y0 + i * bearerGap - 3} width={w + 8} height={6} className="fill-foreground/25" />
            ))}
            {/* Boards */}
            {Array.from({ length: drawRows }, (_, i) => (
                <rect
                    key={`r${i}`}
                    x={x0}
                    y={y0 + i * rowH + 0.4}
                    width={w}
                    height={Math.max(0.8, rowH - 0.8)}
                    className={i % 2 ? "fill-primary/55" : "fill-primary/70"}
                />
            ))}
            {/* Joists, shown through the boards */}
            {Array.from({ length: result.joists.count }, (_, i) => (
                <line
                    key={`j${i}`}
                    x1={x0 + i * joistGap}
                    x2={x0 + i * joistGap}
                    y1={y0}
                    y2={y0 + h}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    className="stroke-foreground/60"
                />
            ))}
            <rect x={x0} y={y0} width={w} height={h} fill="none" strokeWidth={1.5} className="stroke-foreground" />
        </svg>
    );
}

// ── Results ───────────────────────────────────────────────────────────────────

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
    return (
        <div className="bg-card p-4">
            <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">{label}</div>
            <div className="mt-1.5 font-display font-black text-[30px] leading-none tracking-tight text-foreground tabular-nums">{value}</div>
            {detail && <div className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{detail}</div>}
        </div>
    );
}

function shoppingList(inputs: DeckInputs, r: DeckResult): string {
    const lines = [
        `Deck: ${m1(inputs.runM)} x ${m1(inputs.acrossM)} (${nf(r.areaM2, 1)} m²)`,
        r.boards !== undefined
            ? `Decking boards: ${r.boards} x ${m1(inputs.boardLengthM)} (${inputs.boardWidthMm} mm wide), ${nf(r.boardLm, 1)} lineal m incl. ${inputs.wastePct}% waste`
            : `Decking boards: ${nf(r.boardLm, 1)} lineal m of ${inputs.boardWidthMm} mm boards, incl. ${inputs.wastePct}% waste`,
        `Joists: ${r.joists.count} x ${m1(r.joists.lengthM)} at ${inputs.joistSpacingMm} mm centres (${nf(r.joists.totalLm, 1)} lineal m)`,
        `Bearers: ${r.bearers.count} x ${m1(r.bearers.lengthM)} at ${inputs.bearerSpacingMm} mm centres (${nf(r.bearers.totalLm, 1)} lineal m)`,
        `Posts or stumps: ${r.posts}`,
        `${r.fixings.type === "screws" ? "Decking screws" : "Hidden clips"}: ${nf(r.fixings.count)}`,
        "",
        "Worked out with the free Decking Calculator by DevEdge: https://devedge.com.au/tools/decking-calculator",
    ];
    return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function DeckingCalculator({ embedded = false }: { embedded?: boolean }) {
    const [f, setF] = useState<Fields>(initialFields);
    const [boardsAlong, setBoardsAlong] = useState<"length" | "width">("length");
    const [fixing, setFixing] = useState<Fixing>(DEFAULTS.fixing);
    const [randomLengths, setRandomLengths] = useState(false);
    const [copied, setCopied] = useState(false);

    const set = (k: keyof Fields) => (v: string) => setF((prev) => ({ ...prev, [k]: v }));

    const lengthM = num(f.lengthM);
    const widthM = num(f.widthM);
    const inputs: DeckInputs = {
        runM: boardsAlong === "length" ? lengthM : widthM,
        acrossM: boardsAlong === "length" ? widthM : lengthM,
        boardWidthMm: num(f.boardWidthMm),
        gapMm: num(f.gapMm),
        boardLengthM: randomLengths ? 0 : num(f.boardLengthM),
        joistSpacingMm: num(f.joistSpacingMm),
        bearerSpacingMm: num(f.bearerSpacingMm),
        postSpacingMm: num(f.postSpacingMm),
        fixing,
        wastePct: num(f.wastePct),
    };
    const error = validate(inputs);
    const result = useMemo(() => (error ? null : calculate(inputs)), [error, JSON.stringify(inputs)]); // eslint-disable-line react-hooks/exhaustive-deps

    // Only suggest lengths that don't add joins: a join in every row costs more than the offcut it saves
    const noExtraJoins = STOCK_LENGTHS.filter((l) => result && Math.max(0, Math.ceil(inputs.runM / l - 1e-9) - 1) <= result.joinsPerRow);
    const best = result && !randomLengths && noExtraJoins.length ? bestBoardLength(inputs.runM, result.rows, noExtraJoins) : null;
    const showBest = best && result?.boardsNet !== undefined && best.lengthM !== inputs.boardLengthM && best.boards * best.lengthM < result.boardsNet * inputs.boardLengthM - 0.05;

    const copy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(shoppingList(inputs, result));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard blocked (some iframes): nothing to do */
        }
    };

    return (
        <div className={cn("grid gap-6 lg:gap-8 text-foreground", embedded ? "p-4 sm:p-5 md:grid-cols-[1fr_1fr]" : "p-5 md:p-8 lg:grid-cols-[1.05fr_1fr]")}>
            {/* Inputs */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-label="Deck details">
                <Group title="1 · Deck size">
                    <NumberField label="Length" unit="m" value={f.lengthM} onChange={set("lengthM")} />
                    <NumberField label="Width" unit="m" value={f.widthM} onChange={set("widthM")} />
                    <Segmented
                        wide
                        label="Which way do the boards run?"
                        value={boardsAlong}
                        onChange={setBoardsAlong}
                        options={[
                            { value: "length", label: "Along the length" },
                            { value: "width", label: "Along the width" },
                        ]}
                    />
                </Group>

                <Group title="2 · Boards">
                    <NumberField label="Board width" hint="The face width, not counting the gap" unit="mm" value={f.boardWidthMm} onChange={set("boardWidthMm")} chips={["70", "86", "90", "135", "140"]} />
                    <NumberField label="Gap between boards" hint="Usually 3 to 6 mm; check the board maker's guide" unit="mm" value={f.gapMm} onChange={set("gapMm")} chips={["3", "4", "5", "6"]} />
                    <div className="sm:col-span-2">
                        <Segmented
                            label="How are you buying the boards?"
                            value={randomLengths ? "random" : "set"}
                            onChange={(v) => setRandomLengths(v === "random")}
                            options={[
                                { value: "set", label: "Set lengths" },
                                { value: "random", label: "By the metre" },
                            ]}
                        />
                        {!randomLengths && (
                            <div className="mt-4">
                                <NumberField label="Board length" unit="m" value={f.boardLengthM} onChange={set("boardLengthM")} chips={STOCK_LENGTHS.map((l) => l.toFixed(1))} />
                            </div>
                        )}
                    </div>
                </Group>

                <Group title="3 · Frame">
                    <NumberField
                        label="Joist spacing"
                        hint="450 mm suits most 19 mm hardwood; composites often need 350 to 400 mm"
                        unit="mm"
                        value={f.joistSpacingMm}
                        onChange={set("joistSpacingMm")}
                        chips={["300", "350", "400", "450"]}
                        step="1"
                        wide
                    />
                    <NumberField label="Bearer spacing" hint="Depends on your joist size" unit="mm" value={f.bearerSpacingMm} onChange={set("bearerSpacingMm")} chips={["1200", "1500", "1800"]} step="1" />
                    <NumberField label="Post or stump spacing" hint="Along each bearer" unit="mm" value={f.postSpacingMm} onChange={set("postSpacingMm")} chips={["1200", "1500", "1800"]} step="1" />
                </Group>

                <Group title="4 · Fixing and waste">
                    <Segmented
                        label="Fixing"
                        value={fixing}
                        onChange={setFixing}
                        options={[
                            { value: "screws", label: "Screws" },
                            { value: "clips", label: "Hidden clips" },
                        ]}
                    />
                    <NumberField label="Waste allowance" hint="10% for straight decks, 15% for angles" unit="%" value={f.wastePct} onChange={set("wastePct")} chips={["5", "10", "15"]} step="1" />
                </Group>

                {/* Phones: results sit below the form, so keep the headline number in view while typing */}
                {result && !embedded && (
                    <a
                        href="#deck-results"
                        className="lg:hidden sticky bottom-3 z-10 flex items-center justify-between gap-3 bg-foreground text-background px-4 h-12 shadow-lg"
                    >
                        <span className="text-[14px] font-semibold tabular-nums">
                            {result.boards !== undefined ? `${nf(result.boards)} boards × ${m1(inputs.boardLengthM)}` : `${nf(result.boardLm, 1)} lineal m of boards`}
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.14em] uppercase">Full list ↓</span>
                    </a>
                )}
            </form>

            {/* Results */}
            <div id="deck-results" className={cn("scroll-mt-24", !embedded && "lg:sticky lg:top-24 self-start")} aria-live="polite">
                <div className="border border-border bg-secondary">
                    <div className="px-5 pt-5 pb-3 flex items-baseline justify-between gap-4">
                        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary">What you'll need</span>
                        {result && <span className="font-mono text-[11px] text-muted-foreground">{nf(result.areaM2, 1)} m² deck</span>}
                    </div>

                    {!result ? (
                        <p className="px-5 pb-6 text-[15px] text-muted-foreground">{error}</p>
                    ) : (
                        <>
                            {/* Headline: the boards */}
                            <div className="mx-5 bg-card p-5">
                                <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">Decking boards</div>
                                {result.boards !== undefined ? (
                                    <>
                                        <div className="mt-2 font-display font-black leading-none tracking-tight tabular-nums" style={{ fontSize: "clamp(44px, 6vw, 60px)" }}>
                                            {nf(result.boards)} <span className="text-primary">× {m1(inputs.boardLengthM)}</span>
                                        </div>
                                        <div className="mt-2 text-[14px] text-muted-foreground">
                                            {nf(result.boardLm, 1)} lineal metres, including {nf(inputs.wastePct)}% waste ({nf(result.boardsNet!)} boards without it)
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-2 font-display font-black leading-none tracking-tight tabular-nums" style={{ fontSize: "clamp(44px, 6vw, 60px)" }}>
                                            {nf(result.boardLm, 1)} <span className="text-primary">lineal m</span>
                                        </div>
                                        <div className="mt-2 text-[14px] text-muted-foreground">
                                            Including {nf(inputs.wastePct)}% waste ({nf(result.boardLmNet, 1)} m without it)
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="m-5 mt-px grid grid-cols-2 gap-px bg-border border-x border-b border-border">
                                <Stat label="Joists" value={`${result.joists.count} × ${m1(result.joists.lengthM)}`} detail={`${nf(result.joists.totalLm, 1)} lineal m at ${nf(inputs.joistSpacingMm)} mm centres`} />
                                <Stat label="Bearers" value={`${result.bearers.count} × ${m1(result.bearers.lengthM)}`} detail={`${nf(result.bearers.totalLm, 1)} lineal m at ${nf(inputs.bearerSpacingMm)} mm centres`} />
                                <Stat label="Posts or stumps" value={nf(result.posts)} detail={`${result.bearers.count} bearers, posts ${nf(inputs.postSpacingMm)} mm apart`} />
                                <Stat
                                    label={result.fixings.type === "screws" ? "Decking screws" : "Hidden clips"}
                                    value={nf(result.fixings.count)}
                                    detail={result.fixings.type === "screws" ? `2 per board at every joist, plus ${FIXING_SPARE_PCT}% spare` : `One per gap at every joist, plus ${FIXING_SPARE_PCT}% spare`}
                                />
                            </div>

                            <div className="px-5">
                                <PlanView inputs={inputs} result={result} />
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] text-muted-foreground">
                                    <span className="inline-flex items-center gap-1.5"><span className="w-3 h-2 bg-primary/70" /> {result.rows} rows of boards</span>
                                    <span className="inline-flex items-center gap-1.5"><span className="w-3 border-t border-dashed border-foreground/60" /> joists</span>
                                    <span className="inline-flex items-center gap-1.5"><span className="w-3 h-1.5 bg-foreground/25" /> bearers</span>
                                </div>
                            </div>

                            {/* Notes worth knowing before ordering */}
                            <ul className="px-5 pt-4 pb-1 space-y-2 text-[13.5px] leading-snug text-muted-foreground">
                                {result.lastBoardMm < inputs.boardWidthMm && (
                                    <li className="flex gap-2">
                                        <span className="text-primary">•</span>
                                        <span>
                                            The last row only needs {result.lastBoardMm} mm of board.
                                            {result.lastBoardMm < inputs.boardWidthMm / 2
                                                ? " Rip the first and last boards to the same width, or tweak the gap slightly, so you don't end on a thin strip."
                                                : " Rip it down to fit."}
                                        </span>
                                    </li>
                                )}
                                {result.joinsPerRow > 0 && (
                                    <li className="flex gap-2">
                                        <span className="text-primary">•</span>
                                        <span>Your boards are shorter than the deck, so each row has a join. Every join must land on a joist (doubling joists there helps), and stagger them row to row.</span>
                                    </li>
                                )}
                                {showBest && best && (
                                    <li className="flex gap-2">
                                        <span className="text-primary">•</span>
                                        <span>
                                            {m1(best.lengthM)} boards would waste less on this deck: {best.boards} boards with {nf(best.offcutLm, 1)} m of offcut.
                                        </span>
                                    </li>
                                )}
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>A guide for ordering only. Check joist and bearer sizes against the span tables for your timber, and your board maker's spacing rules.</span>
                                </li>
                            </ul>

                            <div className="p-5 pt-4">
                                <button
                                    type="button"
                                    onClick={copy}
                                    className="w-full h-11 border border-foreground/80 text-foreground text-[14px] font-semibold hover:bg-foreground hover:text-background transition-colors"
                                >
                                    {copied ? "Copied ✓" : "Copy shopping list"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
