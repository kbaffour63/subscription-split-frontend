import PaymentCallbackClient from "./PaymentCallbackClient";

export default async function Page({
    searchParams,
}: PageProps<"/payment/callback">) {
    const params = await searchParams;
    // Paystack's redirect uses `trxref`/`reference`; our inline flow passes `reference`
    const raw = params.reference ?? params.trxref;
    const reference = Array.isArray(raw) ? raw[0] : raw;

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top,var(--color-muted)_0%,var(--color-background)_60%)] p-4">
            <PaymentCallbackClient reference={reference} />
        </main>
    );
}
