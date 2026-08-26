"use client";

import { useState } from "react";

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

type Stage = "form" | "processing" | "success";

export default function PaymentModal({
  amount,
  onSuccess,
  onClose,
}: {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>("form");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setStage("processing");
    setTimeout(() => {
      setStage("success");
      setTimeout(() => {
        onSuccess();
      }, 1100);
    }, 1400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        <div className="flex items-center justify-between bg-green-600 px-5 py-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-green-100">
              Pay ChipIn
            </span>
            <span className="text-lg font-semibold text-white">
              {currency.format(amount)}
            </span>
          </div>
          {stage !== "processing" && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-green-100 transition-colors hover:bg-green-700/50 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        {stage === "form" && (
          <form onSubmit={handlePay} className="flex flex-col gap-4 p-5">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-zinc-700"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Card number
              </span>
              <input
                required
                inputMode="numeric"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-zinc-700"
              />
            </label>

            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Expiry
                </span>
                <input
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-zinc-700"
                />
              </label>
              <label className="flex w-24 flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  CVV
                </span>
                <input
                  required
                  inputMode="numeric"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-zinc-700"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Pay {currency.format(amount)}
            </button>

            <p className="text-center text-xs text-zinc-400">
              Simulated checkout for learning purposes — no real payment is
              processed.
            </p>
          </form>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center gap-4 px-5 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Processing payment...
            </p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center gap-4 px-5 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-6 w-6 text-green-600 dark:text-green-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Payment successful
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
