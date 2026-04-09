import { z } from "zod";

export const TemplateSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required"),
  content: z.string().nullable().optional(), // JSON string representing the template structure
  description: z.string().nullable().optional(),
  tags: z.string().nullable().optional(), // Tags used for grouping/searching
  counter_agent: z.string().nullable().optional(), // Targeted counter-party context
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Template = z.infer<typeof TemplateSchema>;
