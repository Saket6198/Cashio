import * as z from "zod";
export const newProfileSchema = z.object({
  name: z.string().min(3, "Name is required").max(18, "Name is too long"),
  entityType: z.enum(["individual", "hotel"]),
  rentAmount: z.number().min(0, "Rent amount must be positive").default(0),
  finePerDay: z
    .number()
    .min(0, "Fine per day must be positive")
    .optional()
    .default(0),
  fineActive: z.boolean().default(false),
  fineStartDate: z.date().optional().default(undefined),
  fineEndDate: z.date().optional().default(undefined),
  note: z.string().optional().default(""),
});

export type NewProfileType = z.infer<typeof newProfileSchema>;
