import { LeadsRepository } from "@/repositories/leads.repository";
import { NULL_FILTER_SENTINEL } from "@/lib/constants";
import type { LeadsFilters } from "@/types/leads";
import type { PaginatedResult } from "@/types/pagination";
import type { Lead } from "@/types/leads";

export class LeadsService {
  private repository: LeadsRepository;

  constructor() {
    this.repository = new LeadsRepository();
  }

  private sanitizeFilters(
    filters: LeadsFilters,
    validRendas: string[],
    validTempos: string[],
  ): LeadsFilters {
    return {
      ...filters,
      renda: filters.renda?.filter((v) => v === NULL_FILTER_SENTINEL || validRendas.includes(v)),
      tempo: filters.tempo?.filter((v) => v === NULL_FILTER_SENTINEL || validTempos.includes(v)),
    };
  }

  private async resolveAndSanitize(
    filters: LeadsFilters,
    validOptions?: { rendas: string[]; tempos: string[] },
  ): Promise<LeadsFilters> {
    const options = validOptions ?? {
      rendas: filters.renda?.length ? await this.repository.getDistinctRenda() : [] as string[],
      tempos: filters.tempo?.length ? await this.repository.getDistinctTempo() : [] as string[],
    };
    return this.sanitizeFilters(filters, options.rendas, options.tempos);
  }

  async getPaginated(
    page: number = 1,
    filters: LeadsFilters = {},
    validOptions?: { rendas: string[]; tempos: string[] },
  ): Promise<PaginatedResult<Lead>> {
    const safe = await this.resolveAndSanitize(filters, validOptions);
    return this.repository.findPaginated(page, safe);
  }

  async getAllFiltered(
    filters: LeadsFilters = {},
    validOptions?: { rendas: string[]; tempos: string[] },
  ): Promise<Lead[]> {
    const safe = await this.resolveAndSanitize(filters, validOptions);
    return this.repository.findAllFiltered(safe);
  }

  async getRendaOptions(): Promise<string[]> {
    return this.repository.getDistinctRenda();
  }

  async getTempoOptions(): Promise<string[]> {
    return this.repository.getDistinctTempo();
  }
}
