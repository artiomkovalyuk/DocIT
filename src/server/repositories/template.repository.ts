import { prisma } from "../lib/prisma";
import { Template } from "../models";

export class TemplateRepository {
  static async findById(id: string) {
    return prisma.template.findUnique({
      where: { id },
      include: {
        rules: true,
      },
    });
  }

  static async list() {
    return prisma.template.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  static async create(data: Template) {
    return prisma.template.create({
      data: {
        name: data.name,
        content: data.content,
        description: data.description,
        tags: data.tags,
        counter_agent: data.counter_agent,
      },
    });
  }

  static async update(id: string, data: Partial<Template>) {
    return prisma.template.update({
      where: { id },
      data,
    });
  }
}
