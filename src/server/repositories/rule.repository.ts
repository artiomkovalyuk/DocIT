import { prisma } from "../lib/prisma";
import { Rule } from "../models";

export class RuleRepository {
  static async create(data: Rule) {
    return prisma.rule.create({
      data: {
        name: data.name,
        type: data.type,
        logic: data.logic,
        template_id: data.template_id,
      },
    });
  }

  static async list() {
    return prisma.rule.findMany();
  }

  static async linkToTemplate(rule_id: string, template_id: string) {
    return prisma.rule.update({
      where: { id: rule_id },
      data: { template_id },
    });
  }

  static async findByTemplate(template_id: string) {
    return prisma.rule.findMany({
      where: { template_id },
    });
  }

  /**
   * Global rules (no template_id)
   */
  static async listGlobal() {
    return prisma.rule.findMany({
      where: { template_id: null },
    });
  }
}
