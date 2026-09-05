import { z } from "zod";

export const paymentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  amount: z.number().positive("Amount must be greater than zero"),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
