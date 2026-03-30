import { LeadsService } from "@/services/leads.service";
import { ExportCsvButton } from "@/components/export-csv-button";
import { Users } from "lucide-react";

const leadsService = new LeadsService();

export default async function LeadsPage() {
  const leads = await leadsService.getAll();
  const total = leads.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Captação Paulo Wesley</p>
        </div>
        <ExportCsvButton data={JSON.parse(JSON.stringify(leads))} filename="leads-paulo-wesley" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Total de Leads
            </span>
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-[#6852FA]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Data
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Nome
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Telefone
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  UTM Source
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  UTM Campaign
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    Nenhum lead encontrado
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3 text-gray-900">
                      {lead.data
                        ? new Date(lead.data + "T00:00:00").toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {lead.nome ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.email ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.telefone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.utm_source ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.utm_campaign ?? "-"}
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
