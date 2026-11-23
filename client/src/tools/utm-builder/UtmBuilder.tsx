import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ToolComponentProps } from "../types";
import { PRESETS, UTM_FIELDS, buildUtmUrl, type UtmField, type UtmOptions, type UtmValues } from "./utm";

const HISTORY_KEY = "devedge-utm-history";

const FIELD_COPY: Record<UtmField, { label: string; hint: string; placeholder: string }> = {
    source: { label: "Source", hint: "Where the click comes from", placeholder: "facebook" },
    medium: { label: "Medium", hint: "What kind of link it is", placeholder: "paid_social" },
    campaign: { label: "Campaign name", hint: "The promotion or reason", placeholder: "spring_sale" },
    content: { label: "Content", hint: "Optional: which ad or button", placeholder: "video_ad_1" },
    term: { label: "Term", hint: "Optional: keyword or audience", placeholder: "deck_builders" },
};

const EMPTY: UtmValues = { source: "", medium: "", campaign: "", content: "", term: "" };

function readHistory(): string[] {
    try {
        const v = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
        return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
    } catch {
        return [];
    }
}

function writeHistory(list: string[]) {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 5)));
    } catch {
        /* storage blocked (private mode or a third-party iframe): history just isn't kept */
    }
}

async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
    }
}

const inputClass =
    "w-full h-11 px-3 bg-background border border-foreground/20 text-foreground text-[15px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/25 transition-colors duration-150";
const labelClass = "font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground";

// Works the same on devedge.com.au and in embeds, so it ignores `embedded`
export default function UtmBuilder(_props: ToolComponentProps) {
    const id = useId();
    const [base, setBase] = useState("");
    const [values, setValues] = useState<UtmValues>(EMPTY);
    const [opts, setOpts] = useState<UtmOptions>({ lowercase: true, spaces: "_" });
    const [copied, setCopied] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => setHistory(readHistory()), []);

    const result = useMemo(() => buildUtmUrl(base, values, opts), [base, values, opts]);
    const touched = base.trim() !== "" || Object.values(values).some((v) => v.trim() !== "");
    const activePreset = PRESETS.find((p) => p.source === values.source && p.medium === values.medium);

    const set = (key: UtmField, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

    const copy = async (text: string) => {
        await copyText(text);
        setCopied(text);
        setTimeout(() => setCopied((c) => (c === text ? null : c)), 2000);
        if (text === result.url) {
            const next = [text, ...history.filter((h) => h !== text)].slice(0, 5);
            setHistory(next);
            writeHistory(next);
        }
    };

    const reset = () => {
        setBase("");
        setValues(EMPTY);
    };

    return (
        <div className={"grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"}>
            {/* ── Inputs ─────────────────────────────────────────────── */}
            <div className="p-5 sm:p-8 space-y-6">
                <div>
                    <label htmlFor={`${id}-url`} className={labelClass}>
                        1. The page people should land on
                    </label>
                    <input
                        id={`${id}-url`}
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        spellCheck={false}
                        placeholder="yourbusiness.com.au/spring-offer"
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className={cn(inputClass, "mt-2 h-12 text-[16px]")}
                    />
                </div>

                <div>
                    <span className={labelClass} id={`${id}-presets`}>
                        2. Where will you share it?
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby={`${id}-presets`}>
                        {PRESETS.map((p) => {
                            const active = activePreset?.label === p.label;
                            return (
                                <button
                                    key={p.label}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => setValues((v) => ({ ...v, source: p.source, medium: p.medium }))}
                                    className={cn(
                                        "h-9 px-3 border text-[13px] font-medium transition-colors duration-150",
                                        active
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-foreground/20 bg-card text-foreground hover:border-primary hover:text-primary",
                                    )}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-2 text-[13px] text-muted-foreground">Pick one, or type your own source and medium below.</p>
                </div>

                <div>
                    <span className={labelClass}>3. Describe the campaign</span>
                    <div className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-4">
                        {UTM_FIELDS.map((f) => {
                            const c = FIELD_COPY[f.key];
                            return (
                                <div key={f.key} className={f.key === "campaign" ? "sm:col-span-2" : undefined}>
                                    <label htmlFor={`${id}-${f.key}`} className="flex items-baseline justify-between gap-2 text-[14px] font-semibold text-foreground">
                                        <span>
                                            {c.label}
                                            {f.required && <span className="text-primary"> *</span>}
                                        </span>
                                        <code className="font-mono text-[11px] font-normal text-muted-foreground">{f.param}</code>
                                    </label>
                                    <input
                                        id={`${id}-${f.key}`}
                                        type="text"
                                        spellCheck={false}
                                        autoCapitalize="none"
                                        placeholder={c.placeholder}
                                        value={values[f.key]}
                                        onChange={(e) => set(f.key, e.target.value)}
                                        className={cn(inputClass, "mt-1.5")}
                                        aria-describedby={`${id}-${f.key}-hint`}
                                    />
                                    <span id={`${id}-${f.key}-hint`} className="mt-1 block text-[12px] text-muted-foreground">
                                        {c.hint}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <fieldset className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-foreground border-t border-border pt-5">
                    <legend className="sr-only">Formatting</legend>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={opts.lowercase}
                            onChange={(e) => setOpts((o) => ({ ...o, lowercase: e.target.checked }))}
                            className="w-4 h-4 accent-[var(--primary)]"
                        />
                        Make everything lowercase
                    </label>
                    <label className="inline-flex items-center gap-2">
                        Spaces become
                        <select
                            value={opts.spaces}
                            onChange={(e) => setOpts((o) => ({ ...o, spaces: e.target.value as UtmOptions["spaces"] }))}
                            className="h-9 px-2 bg-background border border-foreground/20 text-foreground text-[14px] focus:outline-none focus:border-primary"
                        >
                            <option value="_">underscores _</option>
                            <option value="-">dashes -</option>
                            <option value="%20">%20 (keep spaces)</option>
                        </select>
                    </label>
                    {touched && (
                        <button type="button" onClick={reset} className="ml-auto text-[13px] text-muted-foreground underline underline-offset-4 hover:text-primary">
                            Start again
                        </button>
                    )}
                </fieldset>
            </div>

            {/* ── Result ─────────────────────────────────────────────── */}
            <div className="bg-card border-t lg:border-t-0 lg:border-l border-border p-5 sm:p-8 flex flex-col" aria-live="polite">
                <span className={labelClass}>Your tracked link</span>
                {result.url ? (
                    <>
                        <div className="mt-3 p-4 bg-background border border-primary/50 font-mono text-[13px] leading-[1.6] text-foreground break-all select-all">
                            {result.url}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => copy(result.url)}
                                className="h-11 px-5 bg-primary text-primary-foreground font-semibold text-[15px] hover:opacity-90 transition-opacity duration-150"
                            >
                                {copied === result.url ? "Copied ✓" : "Copy link"}
                            </button>
                            <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-11 px-5 inline-flex items-center border border-border text-foreground text-[15px] font-medium hover:border-primary hover:text-primary transition-colors duration-150"
                            >
                                Test it ↗
                            </a>
                        </div>

                        <div className="mt-6">
                            <span className={labelClass}>How it shows in Google Analytics</span>
                            <dl className="mt-2 border-t border-border text-[14px]">
                                {[
                                    ["Source / medium", `${result.cleaned.source} / ${result.cleaned.medium}`],
                                    ["Campaign", result.cleaned.campaign],
                                    ...(result.cleaned.content ? [["Ad content", result.cleaned.content]] : []),
                                    ...(result.cleaned.term ? [["Term", result.cleaned.term]] : []),
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between gap-4 py-2 border-b border-border">
                                        <dt className="text-muted-foreground">{k}</dt>
                                        <dd className="font-mono text-[13px] text-foreground text-right break-all">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </>
                ) : (
                    <div className="mt-3 flex-1 min-h-[140px] flex flex-col justify-center p-5 border border-dashed border-foreground/25 text-[14px] leading-[1.6] text-muted-foreground">
                        {touched ? (
                            <ul className="space-y-1">
                                {result.errors.map((e) => (
                                    <li key={e}>• {e}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Fill in the page, where you're sharing it and a campaign name. Your link appears here as you type.</p>
                        )}
                    </div>
                )}

                {result.warnings.length > 0 && (
                    <ul className="mt-5 space-y-2">
                        {result.warnings.map((w) => (
                            <li key={w} className="text-[13px] leading-[1.55] text-foreground bg-secondary border-l-2 border-primary px-3 py-2">
                                {w}
                            </li>
                        ))}
                    </ul>
                )}

                {history.length > 0 && (
                    <div className="mt-6">
                        <span className={labelClass}>Recently copied (on this device only)</span>
                        <ul className="mt-2 space-y-1">
                            {history.map((h) => (
                                <li key={h} className="flex items-center gap-2">
                                    <span className="flex-1 min-w-0 truncate font-mono text-[12px] text-muted-foreground" title={h}>
                                        {h}
                                    </span>
                                    <button type="button" onClick={() => copy(h)} className="shrink-0 text-[12px] font-semibold text-primary hover:underline">
                                        {copied === h ? "Copied" : "Copy"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <p className="mt-auto pt-6 text-[12px] leading-[1.5] text-muted-foreground">
                    Everything stays in your browser. Nothing you type is sent anywhere.
                </p>
            </div>
        </div>
    );
}
