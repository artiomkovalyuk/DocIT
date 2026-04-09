import type { NextApiRequest, NextApiResponse } from "next";
import { AIService } from "../../server/services/ai/ai.service";

/**
 * The Core Sidekick Generation API (Thin Handler)
 * Delegation of all logic to AIService.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { document_id, instruction, resource_ids, schema, data } = req.body;
    
    if (!instruction) {
      return res.status(400).json({ error: "instruction is required" });
    }

    const aiService = new AIService();

    // Call service which handles context preparation and model delegation
    const result = await aiService.generateWithContext({
      document_id: document_id || "global",
      instruction,
      resource_ids,
      schema,
      data
    });

    return res.status(200).json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error("[Generation API Error]:", error);
    return res.status(500).json({ error: error.message });
  }
}
