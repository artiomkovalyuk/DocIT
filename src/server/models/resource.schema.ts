import { z } from "zod";

export const ResourceType = z.enum(["file", "url", "text", "context"]);

export const ResourceSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Resource name is required"),
  type: ResourceType,
  url: z.string().url().nullable().optional(),
  content: z.string().nullable().optional(), // Raw content or summary
  created_at: z.date().optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;
