import { DocumentRepository, TemplateRepository, RuleRepository, ResourceRepository } from "../repositories";

export async function seedMockData() {
  console.log("🌱 Seeding mock data...");

  // 1. Create a Template
  const template = await TemplateRepository.create({
    name: "Service Agreement",
    description: "Standard contract for professional services",
    tags: "legal,services,standard",
    counter_agent: "Corporate Clients",
    content: JSON.stringify({
      variables: ["client_name", "amount", "deadline"],
      structure: ["intro", "obligations", "payment", "termination"]
    })
  });

  // 2. Create Rules
  await RuleRepository.create({
    name: "Payment extraction",
    type: "extraction",
    logic: JSON.stringify({ match: "sum", field: "amount" }),
    template_id: template.id
  });

  await RuleRepository.create({
    name: "Legal Tone Check",
    type: "validation",
    logic: JSON.stringify({ style: "formal" })
    // global rule
  });

  // 3. Create a Document
  const doc = await DocumentRepository.create({
    title: "Agreement with ACME Corp",
    status: "draft",
    template_id: template.id
  });

  // 4. Add a Resource (File)
  await ResourceRepository.create({
    name: "ACME Requirements.txt",
    type: "text",
    content: "ACME wants project completed by May 20th. Budget is $5000."
  }, doc.id);

  console.log("✅ Mock data seeded successfully.");
}
