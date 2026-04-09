import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../../lib/env";

export class GeminiRepository {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: env.GEMINI_API_KEY,
      modelName: "gemini-1.5-pro",
    });
  }

  async invoke(messages: any[]) {
    return this.model.invoke(messages);
  }

  async invokeStructured(text: string, schema: any) {
    const modelWithStructuredOutput = this.model.withStructuredOutput(schema);
    return modelWithStructuredOutput.invoke(text);
  }
}
