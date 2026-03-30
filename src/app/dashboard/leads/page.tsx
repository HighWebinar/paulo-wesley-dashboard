import { LeadsService } from "@/services/leads.service";
import { ExportCsvButton } from "@/components/export-csv-button";
import { DateRangePicker } from "@/components/date-range-picker";
import { SelectFilter } from "@/components/select-filter";
import { DataPagination } from "@/components/data-pagination";
import { MetricCard } from "@/components/metric-card";
import { formatDate, isValidDateParam } from "@/lib/formatters";
import { Users } from "lucide-react";

const leadsService = new LeadsService();

interface LeadsPageProps {
  searchParams: Promise<{ from?: string; to?: string; renda?: string; tempo?: string; page?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { from, to, renda, tempo, page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Math.min(Number(pageParam) || 1, 1000));

  const validRange = from && to && isValidDateParam(from) && isValidDateParam(to);

  const result = validRange
    ? await leadsService.getByDateRange(from, to, requestedPage)
    : await leadsService.getPaginated(requestedPage);

  const { rendas: rendasOptions, tempos: tempoOptions } = leadsService.getFilterOptions(result.data);
  const leads = leadsService.filterLeads(result.data, { renda, tempo });

  const csvFilename = from && to
    ? `leads-paulo-wesley_${from}_${to}`
    : "leads-paulo-wesley";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Captação Paulo Wesley</p>
        </div>
        <div className="flex items-center gap-3">
          <SelectFilter paramKey="renda" options={rendasOptions} placeholder="Renda mensal" />
          <SelectFilter paramKey="tempo" options={tempoOptions} placeholder="Tempo de mercado" />
          <DateRangePicker />
          <ExportCsvButton
            data={leads.map((l) => ({
              data: l.data ?? "",
              nome: l.nome ?? "",
              email: l.email ?? "",
              telefone: l.telefone ?? "",
              renda_mensal: l.renda_mensal ?? "",
              tempo_mercado: l.tempo_mercado ?? "",
              ativo_principal: l.ativo_principal ?? "",
              contato_tape: l.contato_tape ?? "",
              maior_dificuldade: l.maior_dificuldade ?? "",
              objetivo_trading: l.objetivo_trading ?? "",
            }))}
            filename={csvFilename}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total de Leads" value={String(result.total)} icon={Users} />
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Data</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Telefone</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Renda Mensal</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Tempo de Mercado</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhum lead encontrado
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                    <td className="px-4 py-3 text-gray-900">
                      {formatDate(lead.data)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{lead.nome ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.email ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.telefone ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.renda_mensal ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.tempo_mercado ?? "-"}</td>
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
