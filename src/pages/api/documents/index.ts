import type { NextApiRequest, NextApiResponse } from "next";
import { DocumentService } from "../../../server/services/document.service";
import { DocumentRepository } from "../../../server/repositories/document.repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const docs = await DocumentRepository.list();
        return res.status(200).json(docs);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const doc = await DocumentService.createDocument(req.body);
        return res.status(201).json(doc);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
