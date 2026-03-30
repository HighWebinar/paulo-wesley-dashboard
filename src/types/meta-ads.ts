export interface MetaAd {
  campaign_id: number;
  report_date: string;
  created_at: string | null;
  id_unico: string | null;
  campaign_name: string | null;
  spend: number | null;
  ctr: number | null;
  cpc: number | null;
  cpl: number | null;
  cost_per_purchase: number | null;
  connect_rate: number | null;
  conversion_rate: number | null;
  impressions: number | null;
  clicks: number | null;
  link_clicks: number | null;
  landing_page_views: number | null;
  leads: number | null;
  purchases: number | null;
  initiate_checkout: number | null;
  ad_account_id: number | null;
  cpm: number | null;
  email: string | null;
}
