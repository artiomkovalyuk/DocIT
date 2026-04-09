import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIProvider } from "./base";

export class LlamaService implements AIProvider {
  private model: ChatOllama;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: "http://localhost:11434", // Default Ollama URL
      model: "llama3",
    });
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    const res = await this.model.invoke(prompt);
    return res.content.toString();
  }

  async extractData(text: string, schema: any): Promise<any> {
    // Basic extraction logic for local models (might need more prompt engineering)
    const prompt = `Extract data from the following text based on this schema: ${JSON.stringify(schema)}\n\nText: ${text}\n\nReturn JSON only.`;
    const res = await this.model.invoke(prompt);
    try {
      return JSON.parse(res.content.toString());
    } catch (e) {
      console.error("Failed to parse Llama output as JSON", e);
      return { error: "Failed to parse structured output" };
    }
  }
}
