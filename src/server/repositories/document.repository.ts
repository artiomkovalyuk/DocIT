import { prisma } from "../lib/prisma";
import { Document } from "../models";

export class DocumentRepository {
  static async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        template: true,
        resources: true,
      },
    });
  }

  static async list(filters: { status?: string; author_id?: string } = {}) {
    return prisma.document.findMany({
      where: filters,
      orderBy: { created_at: "desc" },
    });
  }

  static async create(data: Document) {
    return prisma.document.create({
      data: {
        title: data.title,
        content: data.content,
        status: data.status,
        author_id: data.author_id,
        template_id: data.template_id,
      },
    });
  }

  static async update(id: string, data: Partial<Document>) {
    return prisma.document.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }
}
