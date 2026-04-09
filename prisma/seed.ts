import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Resources
  console.log('Creating resources...')
  const resource1 = await prisma.resource.create({
    data: {
      name: 'Legal Compliance Guide 2024',
      type: 'url',
      source_url: 'https://example.com/legal-2024',
      content: 'Standard legal compliance requirements for IT services in Ukraine.',
    },
  })

  const resource2 = await prisma.resource.create({
    data: {
      name: 'Company Privacy Policy Template',
      type: 'text',
      content: 'This Privacy Policy describes how your personal information is collected, used, and shared...',
    },
  })

  // 2. Templates
  console.log('Creating templates...')
  const template1 = await prisma.template.create({
    data: {
      name: 'Software Development Agreement',
      description: 'Standard agreement for software development services.',
      counter_agent: 'Client',
      tags: 'it, development, legal',
      content: { 
        version: '1.0', 
        sections: [
          { type: 'header', text: 'Introduction' },
          { type: 'paragraph', text: 'This agreement is between Company A and Client B.' },
          { type: 'header', text: 'Scope of Work' },
          { type: 'paragraph', text: 'The scope of work includes frontend and backend development.' }
        ] 
      },
    },
  })

  const template2 = await prisma.template.create({
    data: {
      name: 'Non-Disclosure Agreement (NDA)',
      description: 'Mutual non-disclosure agreement for business meetings.',
      counter_agent: 'Partner',
      tags: 'legal, confidentiality',
      content: { 
        version: '2.1', 
        sections: [
          { type: 'header', text: 'Definition of Confidential Information' },
          { type: 'paragraph', text: 'Confidential Information means any non-public information disclosed by either party.' }
        ] 
      },
    },
  })

  // 3. Rules
  console.log('Creating rules...')
  await prisma.rule.create({
    data: {
      name: 'VAT Calculation',
      type: 'logic',
      logic: JSON.stringify({ formula: 'total * 1.2', field: 'total_with_vat' }),
      template_id: template1.id,
    },
  })

  await prisma.rule.create({
    data: {
      name: 'Українська юрисдикція',
      type: 'validation',
      logic: JSON.stringify({ field: 'jurisdiction', allowed: ['Ukraine'] }),
      template_id: template1.id,
    },
  })

  // 4. Documents
  console.log('Creating documents...')
  await prisma.document.create({
    data: {
      title: 'Project Alpha Development Agreement',
      content: {
        elements: [
          { id: 'e1', type: 'paragraph', content: 'This agreement is between Company A and Client B.', order: 1 },
          { id: 'e2', type: 'paragraph', content: 'The scope of work includes frontend and backend development.', order: 2 },
        ]
      },
      status: 'draft',
      template_id: template1.id,
      resources: {
        connect: [{ id: resource1.id }],
      },
    },
  })

  await prisma.document.create({
    data: {
      title: 'NDA - TechSummit 2024',
      content: {
        elements: [
          { id: 'e1', type: 'paragraph', content: 'Both parties agree to keep all technical discussions confidential.', order: 1 },
        ]
      },
      status: 'published',
      template_id: template2.id,
      resources: {
        connect: [{ id: resource2.id }],
      },
    },
  })

  console.log('Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
