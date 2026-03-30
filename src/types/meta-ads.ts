export interface MetaAd {
  campaign_id: number;
  report_date: string;
  campaign_name: string | null;
  spend: number | null;
  ctr: number | null;
  cpc: number | null;
  cpl: number | null;
  impressions: number | null;
  clicks: number | null;
  leads: number | null;
}
