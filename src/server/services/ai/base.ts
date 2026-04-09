export interface AIProvider {
  generateResponse(prompt: string, context?: any): Promise<string>;
  extractData(text: string, schema: any): Promise<any>;
}
