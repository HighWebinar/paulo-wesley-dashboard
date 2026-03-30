import { LeadsRepository, type PaginatedResult, type LeadsFilters } from "@/repositories/leads.repository";
import type { Lead } from "@/types/leads";

export class LeadsService {
  private repository: LeadsRepository;

  constructor() {
    this.repository = new LeadsRepository();
  }

  async getPaginated(page: number = 1, filters: LeadsFilters = {}): Promise<PaginatedResult<Lead>> {
    return this.repository.findPaginated(page, filters);
  }

  async getRendaOptions(): Promise<string[]> {
    return this.repository.getDistinctRenda();
  }

  async getTempoOptions(): Promise<string[]> {
    return this.repository.getDistinctTempo();
  }
}
