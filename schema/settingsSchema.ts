import * as z from "zod";
export const SettingsSchema = z.object({
    name: z.string().min(3, "Name is required").max(18, "Name is too long"),
    entityType: z.enum(['individual', 'hotel']),
    rentAmount: z.number().min(0, "Rent amount must be positive"),
    finePerDay: z.number().min(0, "Fine per day must be positive").optional(),
    fineActive: z.boolean(),
    fineStartDate: z.date().optional(),
    fineEndDate: z.date().optional(),
});

export type SettingsType = z.infer<typeof SettingsSchema>;