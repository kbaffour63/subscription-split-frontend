"use client";

import { useState } from "react";
import PaymentCallback from "@/components/PaymentCallback";

const STATUSES = ["verifying", "success", "failed", "error", "missing"] as const;

export default function Page() {
    const [status, setStatus] = useState<(typeof STATUSES)[number]>("success");

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top,var(--color-muted)_0%,var(--color-background)_60%)] p-4">
            <PaymentCallback status={status} />

            {/* Preview-only: lets you eyeball every state before real verification logic lands. */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2 py-1.5 backdrop-blur">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={
                            "rounded-full px-2.5 py-1 text-xs capitalize transition-colors " +
                            (status === s
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground")
                        }
                    >
                        {s}
                    </button>
                ))}
            </div>
        </main>
    );
}
