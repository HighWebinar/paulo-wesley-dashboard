"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/formatters";

interface Lead {
  id: number;
  data: string | null;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  renda_mensal: string | null;
  tempo_mercado: string | null;
}

export function LeadsMobileList({ leads }: { leads: Lead[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (leads.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-gray-400">
        Nenhum lead encontrado
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {leads.map((lead) => {
        const isOpen = expandedId === lead.id;

        return (
          <div key={lead.id}>
            <button
              onClick={() => setExpandedId(isOpen ? null : lead.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-all"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {lead.nome ?? "-"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(lead.data)}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-3 space-y-2 bg-gray-50">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Email</span>
                  <p className="text-sm text-gray-700 break-all">{lead.email ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Telefone</span>
                  <p className="text-sm text-gray-700">{lead.telefone ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Renda Mensal</span>
                  <p className="text-sm text-gray-700">{lead.renda_mensal ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Tempo de Mercado</span>
                  <p className="text-sm text-gray-700">{lead.tempo_mercado ?? "-"}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
