import type { NextApiRequest, NextApiResponse } from "next";
import { DocumentService } from "../../../../server/services/document.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { instruction } = req.body;
    if (!instruction) return res.status(400).json({ error: "instruction is required" });

    const updatedDoc = await DocumentService.agenticEdit(id as string, instruction);
    return res.status(200).json(updatedDoc);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
