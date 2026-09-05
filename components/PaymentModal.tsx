"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-sm gap-0 overflow-hidden p-0">
        <div className="flex items-center justify-between bg-emerald-600 px-5 py-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-emerald-100">Pay ChipIn</span>
            <span className="text-lg font-semibold text-white">{currency.format(amount)}</span>
          </div>
          {stage !== "processing" && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-emerald-100 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {stage === "form" && (
          <form onSubmit={handlePay} className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-email">Email</Label>
              <Input
                id="checkout-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkout-card">Card number</Label>
              <Input
                id="checkout-card"
                required
                inputMode="numeric"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="checkout-expiry">Expiry</Label>
                <Input
                  id="checkout-expiry"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div className="flex w-24 flex-col gap-1.5">
                <Label htmlFor="checkout-cvv">CVV</Label>
                <Input
                  id="checkout-cvv"
                  required
                  inputMode="numeric"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Pay {currency.format(amount)}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Simulated checkout for learning purposes — no real payment is processed.
            </p>
          </form>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center gap-4 px-5 py-12">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
            <p className="text-sm text-muted-foreground">Processing payment...</p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center gap-4 px-5 py-12">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-foreground">Payment successful</p>
          </div>
        )}
      </Card>
    </div>
  );
}
