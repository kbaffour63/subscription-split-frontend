"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
    Copy,
    Check,
    type LucideIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "verifying" | "success" | "failed" | "error" | "missing";

type PaymentCallbackProps = {
    status?: Status;
    reference?: string;
    amount?: number;
    channel?: string | null;
    paidAt?: string | null;
    onRetry?: () => void;
};

const STATUS_CONTENT: Record<
    Status,
    { icon: LucideIcon; iconClassName: string; title: string; description: string }
> = {
    verifying: {
        icon: Loader2,
        iconClassName: "bg-muted text-muted-foreground [&_svg]:animate-spin",
        title: "Confirming your payment",
        description: "This usually takes a few seconds. Please don't close this page.",
    },
    success: {
        icon: CheckCircle2,
        iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        title: "Payment successful",
        description: "Your subscription is active. A receipt has been sent to your email.",
    },
    failed: {
        icon: XCircle,
        iconClassName: "bg-destructive/10 text-destructive",
        title: "Payment not completed",
        description: "The transaction didn't go through. You have not been charged.",
    },
    error: {
        icon: AlertTriangle,
        iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        title: "Couldn't confirm your payment",
        description:
            "We had trouble reaching our server. If you were charged, the payment is safe and will be confirmed shortly.",
    },
    missing: {
        icon: AlertTriangle,
        iconClassName: "bg-muted text-muted-foreground",
        title: "Nothing to show here",
        description: "This page confirms a payment, but no transaction reference was found.",
    },
};

export default function PaymentCallback({
    status = "verifying",
    reference,
    amount,
    channel,
    paidAt,
    onRetry,
}: PaymentCallbackProps) {
    const { icon: Icon, iconClassName, title, description } = STATUS_CONTENT[status];
    const showDetails = status === "success";
    const showReferenceOnly = status === "failed" || status === "error";

    return (
        <Card className="w-full max-w-sm gap-0 p-0">
            <div className="flex flex-col items-center px-8 pt-10 pb-2 text-center">
                <div
                    className={cn(
                        "flex size-14 items-center justify-center rounded-full [&_svg]:size-7",
                        iconClassName
                    )}
                >
                    <Icon />
                </div>
                <h1 className="mt-5 text-lg font-semibold tracking-tight">{title}</h1>
                <p className="mt-1.5 text-sm text-balance text-muted-foreground">
                    {description}
                </p>
            </div>

            {showDetails && (
                <div className="mx-6 mt-6 space-y-2.5 rounded-lg bg-muted/50 p-4">
                    {amount != null && <DetailRow label="Amount" value={formatAmount(amount)} />}
                    {channel && <DetailRow label="Method" value={formatChannel(channel)} />}
                    {paidAt && <DetailRow label="Date" value={formatDate(paidAt)} />}
                    {reference && <ReferenceRow reference={reference} />}
                </div>
            )}

            {showReferenceOnly && reference && (
                <div className="mx-6 mt-6 rounded-lg bg-muted/50 p-4">
                    <ReferenceRow reference={reference} />
                </div>
            )}

            <div className="flex flex-col gap-2 p-6 pt-6">
                {status === "success" && (
                    <Link href="/" className={buttonVariants({ size: "lg", className: "w-full" })}>
                        Continue
                    </Link>
                )}

                {status === "failed" && (
                    <>
                        <Link
                            href="/payment"
                            className={buttonVariants({ size: "lg", className: "w-full" })}
                        >
                            Try again
                        </Link>
                        <Link
                            href="/"
                            className={buttonVariants({ variant: "ghost", size: "lg", className: "w-full" })}
                        >
                            Back to home
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <Button size="lg" className="w-full" onClick={onRetry}>
                            Check again
                        </Button>
                        <Link
                            href="/"
                            className={buttonVariants({ variant: "ghost", size: "lg", className: "w-full" })}
                        >
                            Back to home
                        </Link>
                    </>
                )}

                {status === "missing" && (
                    <Link
                        href="/"
                        className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
                    >
                        Back to home
                    </Link>
                )}

                {status === "verifying" && <div className="h-9" aria-hidden />}
            </div>
        </Card>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function ReferenceRow({ reference }: { reference: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="shrink-0 text-muted-foreground">Reference</span>
            <span className="flex items-center gap-1.5">
                <span className="truncate font-mono text-xs">{reference}</span>
                <button
                    onClick={copy}
                    aria-label="Copy reference"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
            </span>
        </div>
    );
}

function formatAmount(subunits: number) {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
    }).format(subunits / 100);
}

function formatChannel(channel: string) {
    return channel.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-GH", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
