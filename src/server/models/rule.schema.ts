import { z } from "zod";

export const RuleType = z.enum(["validation", "logic", "transformation", "extraction"]);

export const RuleSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Rule name is required"),
  type: RuleType,
  logic: z.string().nullable().optional(), // JSON string for rule logic
  template_id: z.string().nullable().optional(),
  created_at: z.date().optional(),
});

export type Rule = z.infer<typeof RuleSchema>;
