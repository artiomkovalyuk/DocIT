import { z } from "zod";

export const ElementType = z.enum(["blank", "paragraph", "image", "table", "signature"]);

export const ElementSchema = z.object({
  id: z.string().cuid().optional(),
  type: ElementType,
  content: z.string().nullable().optional(), // JSON content
  order: z.number().int().default(0),
  document_id: z.string(),
  created_at: z.date().optional(),
});

export type Element = z.infer<typeof ElementSchema>;
