"use client";

import { useCallback } from "react";
import { exportLeadsCsv } from "@/app/dashboard/leads/actions";
import type { LeadsPageFilters } from "@/types/leads";
import { ExportCsvButton } from "@/components/export-csv-button";

interface ExportLeadsCsvProps {
  filters: LeadsPageFilters;
  filename: string;
}

export function ExportLeadsCsv({ filters, filename }: ExportLeadsCsvProps) {
  const { from, to, renda, tempo } = filters;
  const fetchCsv = useCallback(
    () => exportLeadsCsv({ from, to, renda, tempo }),
    [from, to, renda, tempo]
  );

  return (
    <ExportCsvButton
      filename={filename}
      fetchCsv={fetchCsv}
    />
  );
}
