"use client";

import { useQuery } from "@tanstack/react-query";
import PaymentCallback from "@/components/PaymentCallback";
import {
    verifyPayment,
    type VerifyPaymentResponse,
} from "@/services/payment.service";

type Status = "verifying" | "success" | "failed" | "error" | "missing";

// backend transaction status -> UI state
const STATUS_MAP: Record<VerifyPaymentResponse["status"], Status> = {
    SUCCESS: "success",
    FAILED: "failed",
    ABANDONED: "failed",
    PENDING: "verifying",
};

export default function PaymentCallbackClient({
    reference,
}: {
    reference?: string;
}) {
    const enabled = Boolean(reference);

    const query = useQuery({
        queryKey: ["verify-payment", reference],
        queryFn: () => verifyPayment(reference as string),
        enabled,
        retry: 2,
        // Paystack can still be settling the charge — keep polling while pending
        refetchInterval: (q) =>
            q.state.data?.status === "PENDING" ? 3000 : false,
    });

    let status: Status = "verifying";
    if (!enabled) {
        status = "missing";
    } else if (query.isError) {
        status = "error";
    } else if (query.data) {
        status = STATUS_MAP[query.data.status] ?? "error";
    }

    return (
        <PaymentCallback
            status={status}
            reference={reference}
            amount={query.data?.amount}
            channel={query.data?.channel}
            paidAt={query.data?.paidAt}
            onRetry={() => void query.refetch()}
        />
    );
}
