import { z } from "zod";

export const DocumentStatus = z.enum(["draft", "published", "archived", "review"]);

export const DocumentSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.any().nullable().optional(),
  status: DocumentStatus.default("draft"),
  author_id: z.string().nullable().optional(),
  template_id: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Document = z.infer<typeof DocumentSchema>;
