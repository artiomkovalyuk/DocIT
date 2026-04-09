/**
 * Adapter to map Plate's AIChatPlugin request payload to our /generate API format.
 */
export async function plateToGenerate(body: any) {
  // Extract the latest message from Plate's message history
  const lastMessage =
    body.messages?.[body.messages.length - 1]?.content || "";

  // Map to our /generate body structure
  return {
    instruction: lastMessage,
    document_id: body.document_id || body.ctx?.document_id || "global",
    resource_ids: body.resource_ids || body.ctx?.resource_ids || [],
    schema: body.schema || body.ctx?.schema,
    data: body.data || body.ctx?.data, // Generic extra data
  };
}
