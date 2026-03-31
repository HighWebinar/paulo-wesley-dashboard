import { createClient } from "@/lib/supabase/server";
import type { MetaAd } from "@/types/meta-ads";
import type { PaginatedResult } from "@/types/pagination";

const TABLE_NAME = "facebook_ads_daily";
const PAGE_SIZE = 50;
const SELECT_COLUMNS = "campaign_id, report_date, campaign_name, spend, impressions, clicks, leads, ctr, cpc, cpl";

export interface MetaAdsFilters {
  startDate?: string;
  endDate?: string;
  campaign?: string;
}

export class MetaAdsRepository {
  async findPaginated(page: number = 1, filters: MetaAdsFilters = {}): Promise<PaginatedResult<MetaAd>> {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from(TABLE_NAME)
      .select(SELECT_COLUMNS, { count: "exact" })
      .order("report_date", { ascending: false });

    if (filters.startDate && filters.endDate) {
      query = query.gte("report_date", filters.startDate).lte("report_date", filters.endDate);
    }
    if (filters.campaign) {
      query = query.eq("campaign_name", filters.campaign);
    }

    const { data, error, count } = await query.range(from, to);

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

  async getDistinctCampaigns(): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_distinct_campaigns");

    if (error) throw new Error("Erro ao buscar campanhas. Tente novamente.");
    return (data ?? []) as string[];
  }

  async getAggregates(filters: MetaAdsFilters = {}): Promise<{
    total_spend: number;
    total_impressions: number;
    total_clicks: number;
    total_leads: number;
  }> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_meta_ads_summary", {
      p_start_date: filters.startDate ?? null,
      p_end_date: filters.endDate ?? null,
      p_campaign: filters.campaign ?? null,
    });

    if (error) throw new Error("Erro ao buscar métricas. Tente novamente.");

    const row = data?.[0] ?? { total_spend: 0, total_impressions: 0, total_clicks: 0, total_leads: 0 };
    return row;
  }
}
