import { LeadsRepository } from "@/repositories/leads.repository";
import type { Lead } from "@/types/leads";

export class LeadsService {
  private repository: LeadsRepository;

  constructor() {
    this.repository = new LeadsRepository();
  }

  async getAll(): Promise<Lead[]> {
    return this.repository.findAll();
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Lead[]> {
    return this.repository.findByDateRange(startDate, endDate);
  }

  async getTotalCount(): Promise<number> {
    return this.repository.count();
  }

  async getSummary() {
    const leads = await this.repository.findAll();

    const bySource = this.groupBy(leads, "utm_source");
    const byCampaign = this.groupBy(leads, "utm_campaign");

    return {
      total: leads.length,
      bySource,
      byCampaign,
    };
  }

  private groupBy(
    leads: Lead[],
    key: keyof Lead
  ): Record<string, number> {
    return leads.reduce(
      (acc, lead) => {
        const value = (lead[key] as string) ?? "Não informado";
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }
}
