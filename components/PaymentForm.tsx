"use client";

import { useForm } from "@tanstack/react-form-nextjs";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { PaymentFormDefaultValues } from "@/lib/default-values";
import { paymentSchema } from "@/lib/schema";

const MEMBERS = 5;
const SHARE = 12;
const GOAL = MEMBERS * SHARE;
const QUICK_AMOUNTS = [SHARE, SHARE * 2, SHARE * 3, GOAL];

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

export default function PaymentForm() {
  const form = useForm({
    defaultValues: PaymentFormDefaultValues,
    validators: {
      onChange: paymentSchema,
      onBlur: paymentSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <Card className="w-full gap-6 p-2">
        <CardContent className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Subscription
          </h1>
        </CardContent>

        <Separator />

        <CardContent>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const invalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={invalid || undefined}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={invalid || undefined}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      <FieldDescription>
                        Shown to the other members on the split.
                      </FieldDescription>
                      {invalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
                {(field) => {
                  const invalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={invalid || undefined}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        required
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={invalid || undefined}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      <FieldDescription>
                        Your receipt from Paystack goes here.
                      </FieldDescription>
                      {invalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="amount">
                {(field) => {
                  const invalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={invalid || undefined}>
                      <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          type="number"
                          inputMode="decimal"
                          min={1}
                          step="0.01"
                          required
                          value={Number.isFinite(field.state.value) ? field.state.value : ""}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value === "" ? Number.NaN : e.target.valueAsNumber,
                            )
                          }
                          aria-invalid={invalid || undefined}
                          placeholder="0.00"
                        />
                        <InputGroupAddon>GH₵</InputGroupAddon>
                      </InputGroup>

                      <ButtonGroup className="mt-1 flex-wrap">
                        {QUICK_AMOUNTS.map((value) => (
                          <Button
                            key={value}
                            type="button"
                            size="sm"
                            variant={
                              field.state.value === value ? "default" : "outline"
                            }
                            aria-pressed={field.state.value === value}
                            onClick={() => field.handleChange(value)}
                          >
                            {currency.format(value)}
                          </Button>
                        ))}
                      </ButtonGroup>

                      <FieldDescription>
                        One share is {currency.format(SHARE)}. Pay for more than one
                        member if you like.
                      </FieldDescription>
                      {invalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                  amount: state.values.amount,
                })}
              >
                {({ canSubmit, isSubmitting, amount }) => (
                  <Field>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting
                        ? "Starting payment…"
                        : `Pay ${Number.isFinite(amount) ? currency.format(amount) : ""
                          }`.trim()}
                    </Button>
                  </Field>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}