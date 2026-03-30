import { MetaAdsService } from "@/services/meta-ads.service";
import { ExportCsvButton } from "@/components/export-csv-button";
import { DollarSign, Eye, MousePointerClick, Users, ShoppingCart, Target } from "lucide-react";

const metaAdsService = new MetaAdsService();

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR");
}

function formatPercent(value: number): string {
  return value.toFixed(2) + "%";
}

const metricCards = [
  { label: "Investimento Total", key: "totalSpend" as const, icon: DollarSign, format: formatCurrency },
  { label: "Impressões", key: "totalImpressions" as const, icon: Eye, format: formatNumber },
  { label: "Cliques", key: "totalClicks" as const, icon: MousePointerClick, format: formatNumber },
  { label: "Leads", key: "totalLeads" as const, icon: Users, format: formatNumber },
  { label: "Compras", key: "totalPurchases" as const, icon: ShoppingCart, format: formatNumber },
  { label: "CTR Médio", key: "avgCtr" as const, icon: Target, format: formatPercent },
  { label: "CPC Médio", key: "avgCpc" as const, icon: MousePointerClick, format: formatCurrency },
  { label: "CPL Médio", key: "avgCpl" as const, icon: Users, format: formatCurrency },
];

export default async function MetaAdsPage() {
  const [ads, summary] = await Promise.all([
    metaAdsService.getAll(),
    metaAdsService.getSummary(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meta Ads</h1>
          <p className="text-sm text-gray-500 mt-1">Facebook Ads Daily</p>
        </div>
        <ExportCsvButton data={JSON.parse(JSON.stringify(ads))} filename="meta-ads-paulo-wesley" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => (
          <div
            key={metric.key}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                {metric.label}
              </span>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-[#6852FA]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {metric.format(summary[metric.key])}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Data</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Campanha</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Investimento</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Impressões</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Cliques</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Leads</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">CTR</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">CPC</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">CPL</th>
              </tr>
            </thead>
            <tbody>
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    Nenhum dado encontrado
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr
                    key={`${ad.report_date}-${ad.campaign_id}`}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3 text-gray-900">
                      {new Date(ad.report_date + "T00:00:00").toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {ad.campaign_name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.spend != null ? formatCurrency(ad.spend) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.impressions != null ? formatNumber(ad.impressions) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.clicks != null ? formatNumber(ad.clicks) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.leads != null ? formatNumber(ad.leads) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.ctr != null ? formatPercent(ad.ctr) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.cpc != null ? formatCurrency(ad.cpc) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right">
                      {ad.cpl != null ? formatCurrency(ad.cpl) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
