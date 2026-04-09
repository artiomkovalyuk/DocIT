import { plateToGenerate } from "./aiAdapter";

/**
 * Custom fetch wrapper to intercept and adapt /generate calls for Plate AI.
 */
export async function aiFetch(url: string, options: any) {
  if (url === "/generate") {
    try {
      const body = JSON.parse(options.body);
      const adapted = await plateToGenerate(body);

      const res = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        body: JSON.stringify(adapted),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();

      // Plate AIChatPlugin expects a response with a 'content' field
      // or a stream of chunks. Since /generate returns static JSON,
      // we wrap it in a Response that Plate can consume.
      return new Response(
        JSON.stringify({
          content: data.result,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("[aiFetch Error]:", error);
      throw error;
    }
  }

  return fetch(url, options);
}
