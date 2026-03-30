import { createClient } from "@/lib/supabase/server";
import type { MetaAd } from "@/types/meta-ads";
import type { PaginatedResult } from "@/repositories/leads.repository";

const TABLE_NAME = "facebook_ads_daily";
const PAGE_SIZE = 50;
const SELECT_COLUMNS = "campaign_id, report_date, campaign_name, spend, impressions, clicks, leads, ctr, cpc, cpl";

export class MetaAdsRepository {
  async findPaginated(page: number = 1): Promise<PaginatedResult<MetaAd>> {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const [{ data, error }, { count, error: countError }] = await Promise.all([
      supabase
        .from(TABLE_NAME)
        .select(SELECT_COLUMNS)
        .order("report_date", { ascending: false })
        .range(from, to),
      supabase
        .from(TABLE_NAME)
        .select(SELECT_COLUMNS, { count: "exact", head: true }),
    ]);

    if (error) throw new Error("Erro ao buscar dados de Meta Ads. Tente novamente.");
    if (countError) throw new Error("Erro ao buscar dados de Meta Ads. Tente novamente.");

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
  ): Promise<PaginatedResult<MetaAd>> {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const baseQuery = supabase
      .from(TABLE_NAME)
      .select(SELECT_COLUMNS, { count: "exact" })
      .gte("report_date", startDate)
      .lte("report_date", endDate)
      .order("report_date", { ascending: false })
      .range(from, to);

    const { data, error, count } = await baseQuery;

    if (error) throw new Error("Erro ao buscar dados de Meta Ads. Tente novamente.");

    const total = count ?? 0;

    return {
      data: data ?? [],
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    };
  }

  async findAll(): Promise<MetaAd[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(SELECT_COLUMNS)
      .order("report_date", { ascending: false })
      .limit(10000);

    if (error) throw new Error("Erro ao buscar dados de Meta Ads. Tente novamente.");
    return data ?? [];
  }
}
