import * as z from "zod";

export const newTransactionSchema = z.object({
  profileId: z.string(),
  amount: z.number().min(0, "Amount must be at least 0"),
  paymentType: z.enum(["cash", "online"]),
  note: z
    .string()
    .min(1, "Description is required")
    .max(60, "Description must be at most 60 characters"),
  created: z.date().optional(),
});

export type NewTransactionProps = z.infer<typeof newTransactionSchema>;