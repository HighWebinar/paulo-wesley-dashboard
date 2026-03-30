import { MetaAdsRepository } from "@/repositories/meta-ads.repository";
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

  async getPaginated(page: number = 1): Promise<PaginatedResult<MetaAd>> {
    return this.repository.findPaginated(page);
  }

  async getByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1
  ): Promise<PaginatedResult<MetaAd>> {
    return this.repository.findByDateRange(startDate, endDate, page);
  }

  async getAll(): Promise<MetaAd[]> {
    return this.repository.findAll();
  }

  getCampaignNames(ads: MetaAd[]): string[] {
    return [...new Set(ads.map((a) => a.campaign_name).filter(Boolean))] as string[];
  }

  filterByCampaign(ads: MetaAd[], campaign: string): MetaAd[] {
    return ads.filter((a) => a.campaign_name === campaign);
  }

  getSummaryFromAds(ads: MetaAd[]): MetaAdsSummary {
    return this.buildSummary(ads);
  }

  private buildSummary(ads: MetaAd[]): MetaAdsSummary {
    const totalSpend = this.sum(ads, "spend");
    const totalImpressions = this.sum(ads, "impressions");
    const totalClicks = this.sum(ads, "clicks");
    const totalLeads = this.sum(ads, "leads");

    const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalLeads,
      avgCpl,
      avgCpc,
      avgCtr,
    };
  }

  private sum(ads: MetaAd[], key: keyof MetaAd): number {
    return ads.reduce((acc, ad) => acc + (Number(ad[key]) || 0), 0);
  }
}
