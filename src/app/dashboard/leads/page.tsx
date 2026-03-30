import { redirect } from "next/navigation";
import { LeadsService } from "@/services/leads.service";
import { ExportCsvButton } from "@/components/export-csv-button";
import { DateRangePicker } from "@/components/date-range-picker";
import { SelectFilter } from "@/components/select-filter";
import { DataPagination } from "@/components/data-pagination";
import { MetricCard } from "@/components/metric-card";
import { LeadsMobileList } from "@/components/leads-mobile-list";
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

  const [result, rendasOptions, tempoOptions] = await Promise.all([
    leadsService.getPaginated(requestedPage, {
      startDate: validRange ? from : undefined,
      endDate: validRange ? to : undefined,
      renda,
      tempo,
    }),
    leadsService.getRendaOptions(),
    leadsService.getTempoOptions(),
  ]);

  if (result.totalPages > 0 && requestedPage > result.totalPages) {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (renda) params.set("renda", renda);
    if (tempo) params.set("tempo", tempo);
    params.set("page", String(result.totalPages));
    redirect(`/dashboard/leads?${params.toString()}`);
  }

  const csvFilename = from && to
    ? `leads-paulo-wesley_${from}_${to}`
    : "leads-paulo-wesley";

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Captação Paulo Wesley</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SelectFilter paramKey="renda" options={rendasOptions} placeholder="Renda mensal" />
          <SelectFilter paramKey="tempo" options={tempoOptions} placeholder="Tempo de mercado" />
          <DateRangePicker />
          <ExportCsvButton
            data={result.data.map((l) => ({
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

      {/* Mobile: lista expandível */}
      <div className="block lg:hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <LeadsMobileList leads={result.data} />
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
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Telefone</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Renda Mensal</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">Tempo de Mercado</th>
              </tr>
            </thead>
            <tbody>
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhum lead encontrado
                  </td>
                </tr>
              ) : (
                result.data.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{formatDate(lead.data)}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{lead.nome ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.email ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.telefone ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.renda_mensal ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.tempo_mercado ?? "-"}</td>
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
