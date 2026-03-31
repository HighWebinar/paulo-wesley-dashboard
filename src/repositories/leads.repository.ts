import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadsFilters } from "@/types/leads";
import type { PaginatedResult } from "@/types/pagination";

const TABLE_NAME = "captacao-paulo-wesley";
const PAGE_SIZE = 50;
const SELECT_COLUMNS = "id, data, nome, email, telefone, renda_mensal, tempo_mercado, ativo_principal, contato_tape, maior_dificuldade, objetivo_trading";

export class LeadsRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyFilters(query: any, filters: LeadsFilters): any {
    if (filters.startDate && filters.endDate) {
      query = query.gte("data", filters.startDate).lte("data", filters.endDate);
    }
    if (filters.renda) {
      query = query.eq("renda_mensal", filters.renda);
    }
    if (filters.tempo) {
      query = query.eq("tempo_mercado", filters.tempo);
    }
    return query;
  }

  async findPaginated(page: number = 1, filters: LeadsFilters = {}): Promise<PaginatedResult<Lead>> {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from(TABLE_NAME)
      .select(SELECT_COLUMNS, { count: "exact" })
      .order("data", { ascending: false });

    query = this.applyFilters(query, filters);

    const { data, error, count } = await query.range(from, to);

    if (error) throw new Error("Erro ao buscar leads. Tente novamente.");

    const total = count ?? 0;

    return {
      data: data ?? [],
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    };
  }

  async findAllFiltered(filters: LeadsFilters = {}): Promise<Lead[]> {
    const supabase = await createClient();
    const BATCH_SIZE = 1000;
    const MAX_ROWS = 5000;
    const allData: Lead[] = [];
    let from = 0;

    while (from < MAX_ROWS) {
      const to = Math.min(from + BATCH_SIZE - 1, MAX_ROWS - 1);

      let query = supabase
        .from(TABLE_NAME)
        .select(SELECT_COLUMNS)
        .order("data", { ascending: false })
        .range(from, to);

      query = this.applyFilters(query, filters);

      const { data, error } = await query;

      if (error) throw new Error("Erro ao buscar leads para exportação. Tente novamente.");
      if (!data || data.length === 0) break;

      allData.push(...data);
      if (data.length < BATCH_SIZE) break;
      from += BATCH_SIZE;
    }

    return allData;
  }

  async getDistinctRenda(): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_distinct_renda_mensal");

    if (error) throw new Error("Erro ao buscar filtros. Tente novamente.");
    return (data ?? []) as string[];
  }

  async getDistinctTempo(): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_distinct_tempo_mercado");

    if (error) throw new Error("Erro ao buscar filtros. Tente novamente.");
    return (data ?? []) as string[];
  }
}
