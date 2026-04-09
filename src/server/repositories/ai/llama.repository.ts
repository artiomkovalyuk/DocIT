import { ChatOllama } from "@langchain/community/chat_models/ollama";

export class LlamaRepository {
  private model: ChatOllama;

  constructor() {
    this.model = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: "llama3",
    });
  }

  async invoke(prompt: string) {
    return this.model.invoke(prompt);
  }
}
