import { prisma } from "../lib/prisma";
import { Resource } from "../models";

export class ResourceRepository {
  static async findById(id: string) {
    return prisma.resource.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });
  }

  static async listByDocument(document_id: string) {
    return prisma.resource.findMany({
      where: {
        documents: {
          some: { id: document_id },
        },
      },
    });
  }

  static async create(data: Resource, document_id?: string) {
    return prisma.resource.create({
      data: {
        name: data.name,
        type: data.type,
        url: data.url,
        content: data.content,
        ...(document_id && {
          documents: {
            connect: { id: document_id },
          },
        }),
      },
    });
  }

  static async linkToDocument(resource_id: string, document_id: string) {
    return prisma.resource.update({
      where: { id: resource_id },
      data: {
        documents: {
          connect: { id: document_id },
        },
      },
    });
  }
}
