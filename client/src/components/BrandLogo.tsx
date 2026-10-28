import { cn } from "@/lib/utils";

const sizes = {
  sm: { mark: "h-6", word: "h-3.5" },
  md: { mark: "h-7", word: "h-4" },
  lg: { mark: "h-8", word: "h-[18px]" },
};

/**
 * Approved DevEdge logo: "DE" mark + DEVEDGE wordmark.
 * Use variant "light" on dark (Obsidian) backgrounds.
 */
export default function BrandLogo({
  size = "lg",
  variant = "dark",
  className,
}: {
  size?: keyof typeof sizes;
  variant?: "dark" | "light";
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src="/images/logo-mark.webp" alt="" aria-hidden="true" className={cn(s.mark, "w-auto")} />
      <img
        src={variant === "light" ? "/images/logo-wordmark-light.webp" : "/images/logo-wordmark.webp"}
        alt="DevEdge"
        className={cn(s.word, "w-auto")}
      />
    </span>
  );
}
