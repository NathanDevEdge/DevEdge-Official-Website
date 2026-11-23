import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EmbedTheme = "light" | "dark";

/** "c97b3a" or "#C97B3A" → "#c97b3a"; anything else → undefined */
export function cleanHex(value: string | null | undefined) {
    const hex = (value ?? "").trim().replace(/^#/, "").toLowerCase();
    if (/^[0-9a-f]{6}$/.test(hex)) return `#${hex}`;
    if (/^[0-9a-f]{3}$/.test(hex)) return `#${hex.replace(/./g, "$&$&")}`;
    return undefined;
}

/** Dark text on light accents, light text on dark ones */
function readableOn(hex: string) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.22 ? "#1A1008" : "#FFFFFF";
}

/**
 * The box every tool renders in, on its own page and in embeds. Tools style themselves with
 * theme tokens (bg-card, text-primary, border-border ...), so `theme` and `accent` restyle them.
 */
export default function ToolSurface({
    children,
    theme = "light",
    accent,
    className,
    bare,
}: {
    children: ReactNode;
    theme?: EmbedTheme;
    /** Hex colour that replaces Ember as the accent */
    accent?: string;
    className?: string;
    /** No border or padding (the embed page draws its own edge) */
    bare?: boolean;
}) {
    const hex = cleanHex(accent);
    const style = hex
        ? ({ "--primary": hex, "--ring": hex, "--primary-foreground": readableOn(hex) } as CSSProperties)
        : undefined;
    return (
        <div
            className={cn(
                theme === "dark" && "dark",
                "bg-background text-foreground",
                !bare && "border border-border shadow-[0_20px_60px_rgba(46,31,15,0.10)]",
                className,
            )}
            style={style}
            data-tool-theme={theme}
        >
            {children}
        </div>
    );
}
