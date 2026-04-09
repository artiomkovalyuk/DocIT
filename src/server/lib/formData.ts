import { NextApiRequest } from "next";

/**
 * Helper to process FormData from the request.
 * Note: Modern browsers use standard Request.formData() but in Pages Router with API routes
 * you often need a library like 'formidable' or 'busboy'.
 * This is a basic mock/interface structure depending on your specific multipart setup.
 */
export async function getFormData(req: NextApiRequest) {
  // If not using a parser like formidable, you'd implement logic here
  // For standard JSON/URL encoded it's just req.body
  return req.body;
}
