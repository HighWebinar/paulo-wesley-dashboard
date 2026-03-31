"use server";

import { createClient } from "@/lib/supabase/server";
import { LeadsService } from "@/services/leads.service";
import { toLeadsFilters } from "@/lib/formatters";
import type { LeadsPageFilters } from "@/types/leads";

const leadsService = new LeadsService();

const CSV_HEADERS = ["data", "nome", "email", "telefone", "renda_mensal", "tempo_mercado", "ativo_principal", "contato_tape", "maior_dificuldade", "objetivo_trading"] as const;

function escapeCsvValue(value: string): string {
  if (/^[=+\-@\t\r\n]/.test(value)) {
    value = "'" + value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

export async function exportLeadsCsv(filters: LeadsPageFilters): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado.");

  const leads = await leadsService.getAllFiltered(toLeadsFilters(filters));

  if (leads.length === 0) return "";

  const headerRow = CSV_HEADERS.map((h) => `"${h}"`).join(",");
  const dataRows = leads.map((l) =>
    CSV_HEADERS.map((h) => escapeCsvValue(l[h] ?? "")).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}
