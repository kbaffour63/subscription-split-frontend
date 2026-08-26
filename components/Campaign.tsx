"use client";

import { useMemo, useState } from "react";
import type { Contributor } from "./types";
import ContributorList from "./ContributorList";
import PaymentModal from "./PaymentModal";

const MEMBERS = 5;
const SHARE = 12;
const GOAL = MEMBERS * SHARE;
const QUICK_AMOUNTS = [SHARE, SHARE * 2, SHARE * 3, GOAL];

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

const seedContributors: Contributor[] = [
  { id: "seed-1", name: "Kwame Boateng", amount: SHARE, timestamp: Date.now() - 1000 * 60 * 8 },
  { id: "seed-2", name: "Ama Serwaa", amount: SHARE, timestamp: Date.now() - 1000 * 60 * 45 },
  { id: "seed-3", name: "Yaw Owusu", amount: SHARE, timestamp: Date.now() - 1000 * 60 * 60 * 3 },
];

export default function Campaign() {
  const [contributors, setContributors] = useState<Contributor[]>(seedContributors);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const raised = useMemo(
    () => contributors.reduce((sum, c) => sum + c.amount, 0),
    [contributors]
  );
  const progress = Math.min(100, (raised / GOAL) * 100);
  const parsedAmount = Number(amount);
  const canContribute = parsedAmount > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContribute) return;
    setShowModal(true);
  }

  function handlePaymentSuccess() {
    setContributors((prev) => [
      {
        id: crypto.randomUUID(),
        name: name.trim() || "Anonymous",
        amount: parsedAmount,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
    setShowModal(false);
    setName("");
    setAmount("");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-linear-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          🎵 Shared Subscription
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          The Squad&apos;s Spotify Split
        </h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          We share one Spotify Premium plan between the {MEMBERS} of us. Chip
          in your {currency.format(SHARE)} share every month so nobody has to
          keep chasing everyone on WhatsApp.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-zinc-950 dark:text-zinc-50">
            {currency.format(raised)}{" "}
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              collected of {currency.format(GOAL)} this month
            </span>
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">
            {contributors.length} of {MEMBERS} paid
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Your name (optional)
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
            className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-zinc-700"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Amount (GHS)
          </span>
          <input
            required
            type="number"
            min={1}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-zinc-700"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(String(value))}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-green-600 hover:text-green-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-green-500 dark:hover:text-green-400"
            >
              {currency.format(value)}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!canContribute}
          className="mt-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Contribute {canContribute ? currency.format(parsedAmount) : ""}
        </button>
      </form>

      <ContributorList contributors={contributors} />

      {showModal && (
        <PaymentModal
          amount={parsedAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
