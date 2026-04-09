import { GeminiRepository } from "../../repositories/ai/gemini.repository";
import { LlamaRepository } from "../../repositories/ai/llama.repository";

export class AIService {
  private geminiRepo = new GeminiRepository();
  private llamaRepo = new LlamaRepository();

  /**
   * Prepares prompts and delegates to Gemini
   */
  async askGemini(prompt: string, context: string = "") {
    console.log("[AIService] Preparing prompt for Gemini...");
    const systemMessage = "You are Docit AI Sidekick. Use the provided context to help the user.";
    const fullPrompt = context ? `Context: ${context}\n\nUser: ${prompt}` : prompt;
    
    const response = await this.geminiRepo.invoke([
      ["system", systemMessage],
      ["human", fullPrompt]
    ]);
    
    return response.content.toString();
  }

  /**
   * Prepares prompts and delegates to Llama
   */
  async askLlama(prompt: string) {
    console.log("[AIService] Preparing prompt for Llama...");
    const response = await this.llamaRepo.invoke(prompt);
    return response.content.toString();
  }

  /**
   * Complex generation: instruction + document elements + resources (files)
   */
  async generateWithContext(params: {
    document_id: string;
    instruction: string;
    resource_ids?: string[];
    files?: { name: string; content: string }[];
    schema?: any;
  }) {
    console.log(`[AIService] Generating with context for doc ${params.document_id}...`);
    
    let context = `Instruction: ${params.instruction}\n\n`;
    
    // 1. Fetch resources (Files)
    const attachedFiles = [...(params.files || [])];
    if (params.resource_ids && params.resource_ids.length > 0) {
      const { ResourceRepository } = await import("../../repositories/resource.repository");
      const resources = await Promise.all(params.resource_ids.map(id => ResourceRepository.findById(id)));
      resources.forEach(r => r?.content && attachedFiles.push({ name: r.name, content: r.content as string }));
    }
    
    // 2. Fetch Rules (Global + Template-specific)
    const { RuleRepository } = await import("../../repositories/rule.repository");
    const { DocumentRepository } = await import("../../repositories/document.repository");
    const globalRules = await RuleRepository.listGlobal();
    let templateRules: any[] = [];

    if (params.document_id && params.document_id !== "global") {
      const doc = await DocumentRepository.findById(params.document_id);
      if (doc?.template_id) {
        templateRules = await RuleRepository.findByTemplate(doc.template_id);
      }
    }

    const allRules = [...globalRules, ...templateRules];
    
    // 3. Construct Context
    let context = `Instruction: ${params.instruction}\n\n`;
    
    if (allRules.length > 0) {
      context += "Rules to follow:\n";
      allRules.forEach(rule => {
        context += `- [${rule.type}] ${rule.name}: ${rule.logic || "No specific logic"}\n`;
      });
      context += "\n";
    }

    if (attachedFiles.length > 0) {
      context += "Attached Resources:\n";
      attachedFiles.forEach(f => {
        context += `--- File: ${f.name} ---\n${f.content}\n\n`;
      });
    }

    if (params.schema) {
      return this.geminiRepo.invokeStructured(context, params.schema);
    }

    return this.askGemini(params.instruction, context);
  }

  /**
   * Magic Fill: Delegation and preparation
   */
  async extractInformation(text: string, schema: any) {
    console.log("[AIService] Formatting extraction request...");
    // Delegates to Gemini as it handles structured output better
    return this.geminiRepo.invokeStructured(text, schema);
  }
}
