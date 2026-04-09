import type { NextApiRequest, NextApiResponse } from "next";
import { RuleRepository } from "../../../server/repositories/rule.repository";
import { RuleSchema } from "../../../server/models/rule.schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const rules = await RuleRepository.list();
        return res.status(200).json(rules);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const validated = RuleSchema.parse(req.body);
        const rule = await RuleRepository.create(validated);
        return res.status(201).json(rule);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
