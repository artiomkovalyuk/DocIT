import { DocumentRepository } from "../repositories/document.repository";
import { TemplateRepository } from "../repositories/template.repository";
import { Document, DocumentSchema } from "../models";
import { AIService } from "./ai/ai.service";

export class DocumentService {
  private static ai = new AIService();
  /**
   * Creates a document from a raw prompt or template.
   */
  static async createDocument(data: Document) {
    const validated = DocumentSchema.parse(data);
    return DocumentRepository.create(validated);
  }

  /**
   * Killer Feature: Magic Fill
   * Extracts data from raw text and fills template variables.
   */
  static async magicFill(document_id: string, raw_text: string) {
    const document = await DocumentRepository.findById(document_id);
    if (!document || !document.template_id) {
      throw new Error("Document or template not found");
    }

    const template = await TemplateRepository.findById(document.template_id);
    if (!template) throw new Error("Template not found");

    // Use AI to extract structured data based on template logic/schema
    const extractedData = await this.ai.extractInformation(raw_text, template.content ? JSON.parse(template.content as string) : {});
    
    const updatedContent = `${document.content || ""}\n\n[Magic Fill Results]:\n${JSON.stringify(extractedData, null, 2)}`;
    
    return DocumentRepository.update(document_id, {
      content: updatedContent,
      status: "review",
    });
  }

  /**
   * Agentic Editing: "Change this"
   * Modifies the document based on a conversational prompt.
   */
  static async agenticEdit(document_id: string, instruction: string) {
    const document = await DocumentRepository.findById(document_id);
    if (!document) throw new Error("Document not found");

    const context = `Document Title: ${document.title}\nContent: ${document.content}`;
    const updatedContent = await this.ai.askGemini(instruction, context);
    
    return DocumentRepository.update(document_id, {
      content: updatedContent,
    });
  }
}
