import { MetaAdsRepository, type MetaAdsFilters } from "@/repositories/meta-ads.repository";
import type { PaginatedResult } from "@/repositories/leads.repository";
import type { MetaAd } from "@/types/meta-ads";

export interface MetaAdsSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  avgCpl: number;
  avgCpc: number;
  avgCtr: number;
}

export class MetaAdsService {
  private repository: MetaAdsRepository;

  constructor() {
    this.repository = new MetaAdsRepository();
  }

  async getPaginated(page: number = 1, filters: MetaAdsFilters = {}): Promise<PaginatedResult<MetaAd>> {
    return this.repository.findPaginated(page, filters);
  }

  async getCampaignNames(): Promise<string[]> {
    return this.repository.getDistinctCampaigns();
  }

  async getSummary(filters: MetaAdsFilters = {}): Promise<MetaAdsSummary> {
    const row = await this.repository.getAggregates(filters);

    const totalSpend = Number(row.total_spend) || 0;
    const totalImpressions = Number(row.total_impressions) || 0;
    const totalClicks = Number(row.total_clicks) || 0;
    const totalLeads = Number(row.total_leads) || 0;

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalLeads,
      avgCpl: totalLeads > 0 ? totalSpend / totalLeads : 0,
      avgCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
      avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    };
  }
}
