import { LeadsRepository, type PaginatedResult } from "@/repositories/leads.repository";
import type { Lead } from "@/types/leads";

export class LeadsService {
  private repository: LeadsRepository;

  constructor() {
    this.repository = new LeadsRepository();
  }

  async getPaginated(page: number = 1): Promise<PaginatedResult<Lead>> {
    return this.repository.findPaginated(page);
  }

  async getByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1
  ): Promise<PaginatedResult<Lead>> {
    return this.repository.findByDateRange(startDate, endDate, page);
  }

  async getAll(): Promise<Lead[]> {
    return this.repository.findAll();
  }

  getFilterOptions(leads: Lead[]): { rendas: string[]; tempos: string[] } {
    const rendas = [...new Set(leads.map((l) => l.renda_mensal).filter(Boolean))] as string[];
    const tempos = [...new Set(leads.map((l) => l.tempo_mercado).filter(Boolean))] as string[];
    return { rendas, tempos };
  }

  filterLeads(leads: Lead[], filters: { renda?: string; tempo?: string }): Lead[] {
    let filtered = leads;
    if (filters.renda) {
      filtered = filtered.filter((l) => l.renda_mensal === filters.renda);
    }
    if (filters.tempo) {
      filtered = filtered.filter((l) => l.tempo_mercado === filters.tempo);
    }
    return filtered;
  }
}
