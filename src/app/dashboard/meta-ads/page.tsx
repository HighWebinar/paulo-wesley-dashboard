import { redirect } from "next/navigation";
import { MetaAdsService } from "@/services/meta-ads.service";
import { ExportCsvButton } from "@/components/export-csv-button";
import { DateRangePicker } from "@/components/date-range-picker";
import { SelectFilter } from "@/components/select-filter";
import { DataPagination } from "@/components/data-pagination";
import { MetricCard } from "@/components/metric-card";
import { MetaAdsMobileList } from "@/components/meta-ads-mobile-list";
import { formatCurrency, formatNumber, formatPercent, formatDate, isValidDateParam } from "@/lib/formatters";
import { DollarSign, Eye, MousePointerClick, Users, Target } from "lucide-react";

const metaAdsService = new MetaAdsService();

const metricCards = [
  { label: "Investimento Total", key: "totalSpend" as const, icon: DollarSign, format: formatCurrency },
  { label: "Impressões", key: "totalImpressions" as const, icon: Eye, format: formatNumber },
  { label: "Cliques", key: "totalClicks" as const, icon: MousePointerClick, format: formatNumber },
  { label: "Leads", key: "totalLeads" as const, icon: Users, format: formatNumber },
  { label: "CTR Médio", key: "avgCtr" as const, icon: Target, format: formatPercent },
  { label: "CPC Médio", key: "avgCpc" as const, icon: MousePointerClick, format: formatCurrency },
  { label: "CPL Médio", key: "avgCpl" as const, icon: Users, format: formatCurrency },
];

interface MetaAdsPageProps {
  searchParams: Promise<{ from?: string; to?: string; campaign?: string; page?: string }>;
}

export default async function MetaAdsPage({ searchParams }: MetaAdsPageProps) {
  const { from, to, campaign, page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Math.min(Number(pageParam) || 1, 1000));

  const validRange = from && to && isValidDateParam(from) && isValidDateParam(to);

  const filters = {
    startDate: validRange ? from : undefined,
    endDate: validRange ? to : undefined,
    campaign,
  };

  const [result, campaignNames, summary] = await Promise.all([
    metaAdsService.getPaginated(requestedPage, filters),
    metaAdsService.getCampaignNames(),
    metaAdsService.getSummary(filters),
  ]);

  if (result.totalPages > 0 && requestedPage > result.totalPages) {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (campaign) params.set("campaign", campaign);
    params.set("page", String(result.totalPages));
    redirect(`/dashboard/meta-ads?${params.toString()}`);
  }

  const csvFilename = from && to
    ? `meta-ads-paulo-wesley_${from}_${to}`
    : "meta-ads-paulo-wesley";

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meta Ads</h1>
          <p className="text-sm text-gray-500 mt-1">Facebook Ads Daily</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SelectFilter paramKey="campaign" options={campaignNames} placeholder="Todas as campanhas" />
          <DateRangePicker />
          <ExportCsvButton
            data={result.data.map((a) => ({
              report_date: a.report_date,
              campaign_name: a.campaign_name ?? "",
              spend: a.spend ?? 0,
              impressions: a.impressions ?? 0,
              clicks: a.clicks ?? 0,
              leads: a.leads ?? 0,
              ctr: a.ctr ?? 0,
              cpc: a.cpc ?? 0,
              cpl: a.cpl ?? 0,
            }))}
            filename={csvFilename}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={metric.format(summary[metric.key])}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Mobile: lista expandível */}
      <div className="block lg:hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <MetaAdsMobileList ads={result.data} />
        <div className="px-4 py-3 border-t border-gray-200">
          <DataPagination
            currentPage={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </div>
      </div>

      {/* Desktop: tabela */}
      <div className="hidden lg:block bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Data</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Campanha</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Investimento</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Impressões</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Cliques</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Leads</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">CTR</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">CPC</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">CPL</th>
              </tr>
            </thead>
            <tbody>
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    Nenhum dado encontrado
                  </td>
                </tr>
              ) : (
                result.data.map((ad) => (
                  <tr
                    key={`${ad.report_date}-${ad.campaign_id}`}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{formatDate(ad.report_date)}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{ad.campaign_name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.spend != null ? formatCurrency(ad.spend) : "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.impressions != null ? formatNumber(ad.impressions) : "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.clicks != null ? formatNumber(ad.clicks) : "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.leads != null ? formatNumber(ad.leads) : "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.ctr != null ? formatPercent(ad.ctr) : "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.cpc != null ? formatCurrency(ad.cpc) : "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">{ad.cpl != null ? formatCurrency(ad.cpl) : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200">
          <DataPagination
            currentPage={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </div>
      </div>
    </div>
  );
}
