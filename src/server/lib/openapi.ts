import { DocumentSchema, TemplateSchema, RuleSchema, ResourceSchema } from "../models";

/**
 * Manual OpenAPI 3.0 Schema Generator for Docit
 * Follows the models and API structure
 */
export const openApiSchema = {
  openapi: "3.0.0",
  info: {
    title: "Docit API",
    version: "1.0.0",
    description: "AI-powered document ecosystem API",
  },
  servers: [
    {
      url: "/api",
      description: "Local API server",
    },
  ],
  components: {
    schemas: {
      Document: documentToOpenApi(),
      Template: templateToOpenApi(),
      Rule: ruleToOpenApi(),
      Resource: resourceToOpenApi(),
    },
  },
  paths: {
    "/generate": {
      post: {
        summary: "Main Sidekick Generation Request",
        description: "Orchestrates instruction, document context, and attached files to generate AI output.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  document_id: { type: "string" },
                  instruction: { type: "string" },
                  resource_ids: { type: "array", items: { type: "string" } },
                  schema: { type: "object", description: "Optional Zod-like schema for structured output" }
                },
                required: ["instruction"]
              }
            }
          }
        },
        responses: { 200: { description: "Generation successful", content: { "application/json": { schema: { type: "object", properties: { result: { type: "object" } } } } } } },
      },
    },
    "/documents": {
      get: {
        summary: "List all documents",
        responses: {
          200: { description: "Success", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Document" } } } } },
        },
      },
      post: {
        summary: "Create a new document",
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/Document" } } },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/documents/{id}/fill": {
      post: {
        summary: "Magic Fill: Extract data from text into template variables",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { type: "object", properties: { raw_text: { type: "string" } } } } },
        },
        responses: { 200: { description: "Data extracted and document updated" } },
      },
    },
    "/documents/{id}/edit": {
      post: {
        summary: "Agentic Edit: Modify document via AI instruction",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { type: "object", properties: { instruction: { type: "string" } } } } },
        },
        responses: { 200: { description: "Document edited" } },
      },
      "/rules": {
        post: {
          summary: "Create a new rule",
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/Rule" } } },
          },
          responses: { 201: { description: "Rule created" } },
        },
      },
      "/rules/test": {
        post: {
          summary: "Test a prompt or rule against sample text",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    prompt: { type: "string" },
                    sample_text: { type: "string" },
                    context: { type: "object" }
                  }
                }
              }
            }
          },
          responses: { 200: { description: "Test result", content: { "application/json": { schema: { type: "object", properties: { result: { type: "string" }, valid: { type: "boolean" } } } } } } },
        },
      },
    },
  };

  // Simple converters from Zod-like logic to OpenAPI (Simulated since we don't install zod-to-openapi)
  function documentToOpenApi() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        content: { type: "string", nullable: true },
        status: { type: "string", enum: ["draft", "published", "archived", "review"] },
        author_id: { type: "string", nullable: true },
      },
    };
}

function templateToOpenApi() {
  return {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      tags: { type: "string" },
      counter_agent: { type: "string" },
    },
  };
}

function ruleToOpenApi() {
  return {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      type: { type: "string", enum: ["validation", "logic", "transformation", "extraction"] },
    },
  };
}

function resourceToOpenApi() {
  return {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      type: { type: "string", enum: ["file", "url", "text", "context"] },
    },
  };
}
