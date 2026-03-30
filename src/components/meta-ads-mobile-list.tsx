"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatDate, formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

interface MetaAd {
  campaign_id: number;
  report_date: string;
  campaign_name: string | null;
  spend: number | null;
  impressions: number | null;
  clicks: number | null;
  leads: number | null;
  ctr: number | null;
  cpc: number | null;
  cpl: number | null;
}

export function MetaAdsMobileList({ ads }: { ads: MetaAd[] }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  if (ads.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-gray-400">
        Nenhum dado encontrado
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {ads.map((ad) => {
        const key = `${ad.report_date}-${ad.campaign_id}`;
        const isOpen = expandedKey === key;

        return (
          <div key={key}>
            <button
              onClick={() => setExpandedKey(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-all"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {ad.campaign_name ?? "-"}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">{formatDate(ad.report_date)}</span>
                  <span className="text-xs font-medium text-[#6852FA]">
                    {ad.spend != null ? formatCurrency(ad.spend) : "-"}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-3 grid grid-cols-2 gap-3 bg-gray-50">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Impressões</span>
                  <p className="text-sm text-gray-700">{ad.impressions != null ? formatNumber(ad.impressions) : "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Cliques</span>
                  <p className="text-sm text-gray-700">{ad.clicks != null ? formatNumber(ad.clicks) : "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Leads</span>
                  <p className="text-sm text-gray-700">{ad.leads != null ? formatNumber(ad.leads) : "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">CTR</span>
                  <p className="text-sm text-gray-700">{ad.ctr != null ? formatPercent(ad.ctr) : "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">CPC</span>
                  <p className="text-sm text-gray-700">{ad.cpc != null ? formatCurrency(ad.cpc) : "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">CPL</span>
                  <p className="text-sm text-gray-700">{ad.cpl != null ? formatCurrency(ad.cpl) : "-"}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
