import type { NextApiRequest, NextApiResponse } from "next";
import { openApiSchema } from "../../server/lib/openapi";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(openApiSchema);
}
