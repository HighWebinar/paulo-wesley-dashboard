import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/leads";

const TABLE_NAME = "captacao-paulo-wesley";
const PAGE_SIZE = 50;
const SELECT_COLUMNS = "id, data, nome, email, telefone, renda_mensal, tempo_mercado, ativo_principal, contato_tape, maior_dificuldade, objetivo_trading";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class LeadsRepository {
  async findPaginated(page: number = 1): Promise<PaginatedResult<Lead>> {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const [{ data, error }, { count, error: countError }] = await Promise.all([
      supabase
        .from(TABLE_NAME)
        .select(SELECT_COLUMNS)
        .order("data", { ascending: false })
        .range(from, to),
      supabase
        .from(TABLE_NAME)
        .select(SELECT_COLUMNS, { count: "exact", head: true }),
    ]);

    if (error) throw new Error("Erro ao buscar leads. Tente novamente.");
    if (countError) throw new Error("Erro ao buscar leads. Tente novamente.");

    const total = count ?? 0;

    return {
      data: data ?? [],
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    };
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1
  ): Promise<PaginatedResult<Lead>> {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const baseQuery = supabase
      .from(TABLE_NAME)
      .select(SELECT_COLUMNS, { count: "exact" })
      .gte("data", startDate)
      .lte("data", endDate)
      .order("data", { ascending: false })
      .range(from, to);

    const { data, error, count } = await baseQuery;

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

  async findAll(): Promise<Lead[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(SELECT_COLUMNS)
      .order("data", { ascending: false });

    if (error) throw new Error("Erro ao buscar leads. Tente novamente.");
    return data ?? [];
  }
}
