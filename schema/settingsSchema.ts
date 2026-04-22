import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.string().min(3, "Name is required").max(18, "Name is too long"),
  entityType: z.enum(["individual", "hotel"]),
  month: z.number().int().min(1, "Month must be between 1 and 12").max(12, "Month must be between 1 and 12"),
  year: z.number().int().min(2020, "Year must be 2020 or later"),
  rentAmount: z.number().min(0, "Rent amount must be positive"),
  gstAmount: z.number().min(0, "GST amount must be positive"),
  vatAmount: z.number().min(0, "VAT amount must be positive"),
  otherCharges: z.number().min(0, "Other charges must be positive"),
  note: z.string().optional(),
  finePerDay: z.number().min(0, "Fine per day must be positive").optional(),
  fineActive: z.boolean(),
  fineStartDate: z.date().optional(),
  fineEndDate: z.date().optional(),
});

export type SettingsType = z.infer<typeof SettingsSchema>;
