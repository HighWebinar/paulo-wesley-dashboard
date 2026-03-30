import { createClient } from "@/lib/supabase/server";
import type { MetaAd } from "@/types/meta-ads";

const TABLE_NAME = "facebook_ads_daily";

export class MetaAdsRepository {
  async findAll(): Promise<MetaAd[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("report_date", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async findByDateRange(startDate: string, endDate: string): Promise<MetaAd[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .gte("report_date", startDate)
      .lte("report_date", endDate)
      .order("report_date", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
}
