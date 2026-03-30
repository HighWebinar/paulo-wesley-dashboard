import { MetaAdsRepository } from "@/repositories/meta-ads.repository";
import type { MetaAd } from "@/types/meta-ads";

export class MetaAdsService {
  private repository: MetaAdsRepository;

  constructor() {
    this.repository = new MetaAdsRepository();
  }

  async getAll(): Promise<MetaAd[]> {
    return this.repository.findAll();
  }

  async getByDateRange(startDate: string, endDate: string): Promise<MetaAd[]> {
    return this.repository.findByDateRange(startDate, endDate);
  }

  async getSummaryFromAds(ads: MetaAd[]) {
    return this.buildSummary(ads);
  }

  async getSummary() {
    const ads = await this.repository.findAll();
    return this.buildSummary(ads);
  }

  private buildSummary(ads: MetaAd[]) {
    const totalSpend = this.sum(ads, "spend");
    const totalImpressions = this.sum(ads, "impressions");
    const totalClicks = this.sum(ads, "clicks");
    const totalLeads = this.sum(ads, "leads");
    const totalPurchases = this.sum(ads, "purchases");

    const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalLeads,
      totalPurchases,
      avgCpl,
      avgCpc,
      avgCtr,
    };
  }

  private sum(ads: MetaAd[], key: keyof MetaAd): number {
    return ads.reduce((acc, ad) => acc + (Number(ad[key]) || 0), 0);
  }
}
