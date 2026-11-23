import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

/** "Tell me when a new tool comes out": one email field, sent to DevEdge's inbox */
export default function ToolsSignup({ source }: { source: string }) {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setState("error");
            return;
        }
        setState("sending");
        try {
            const res = await fetch("/api/tools-signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source }),
            });
            if (!res.ok) throw new Error(String(res.status));
            setState("done");
            trackEvent("tools_signup", { source });
        } catch {
            setState("error");
        }
    };

    if (state === "done") {
        return (
            <p className="text-[#F5E6D5] text-[17px] leading-relaxed">
                <span className="text-[#C97B3A] font-semibold">You're on the list.</span> We'll email you when the next free tool goes live.
            </p>
        );
    }

    return (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl" noValidate>
            <label htmlFor={`tools-signup-${source}`} className="sr-only">
                Email address
            </label>
            <input
                id={`tools-signup-${source}`}
                type="email"
                required
                autoComplete="email"
                placeholder="you@yourbusiness.com.au"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                }}
                className="flex-1 h-12 px-4 bg-[#120B05] border border-[#2E1F0F] text-[#F5E6D5] placeholder:text-[#7A5C3A] text-[15px] focus:outline-none focus:border-[#C97B3A]"
            />
            <button
                type="submit"
                disabled={state === "sending"}
                className="h-12 px-6 bg-[#C97B3A] hover:bg-[#b8692e] disabled:opacity-60 text-[#1A1008] font-semibold text-[15px] transition-colors duration-150"
            >
                {state === "sending" ? "Adding you…" : "Email me new tools"}
            </button>
            {state === "error" && (
                <p role="alert" className="sm:basis-full text-[14px] text-[#e05252]">
                    That didn't work. Check the email address and try again.
                </p>
            )}
        </form>
    );
}
