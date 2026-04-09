import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIProvider } from "./base";
import { env } from "../../lib/env";

export class GeminiService implements AIProvider {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: env.GEMINI_API_KEY,
      modelName: "gemini-1.5-pro",
    });
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    const res = await this.model.invoke([
      ["system", "You are an AI Sidekick for Docit, an intelligent document ecosystem. Help the user edit and understand their document."],
      ["human", prompt]
    ]);
    return res.content.toString();
  }

  async extractData(text: string, schema: any): Promise<any> {
    // Logic for "Magic Fill" using structured output
    const modelWithStructuredOutput = this.model.withStructuredOutput(schema);
    return modelWithStructuredOutput.invoke(text);
  }
}
