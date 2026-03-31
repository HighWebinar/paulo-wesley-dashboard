"use client";

import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportCsvButtonProps {
  filename: string;
  fetchCsv: () => Promise<string>;
}

export function ExportCsvButton({ filename, fetchCsv }: ExportCsvButtonProps) {
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef(false);

  async function handleExport() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setLoading(true);
    try {
      const csv = await fetchCsv();
      if (!csv) {
        alert("Nenhum dado encontrado com os filtros selecionados.");
        return;
      }

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao exportar. Tente novamente.");
    } finally {
      pendingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-[#6852FA] hover:bg-[#5142B7] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? "Exportando..." : "Exportar CSV"}
    </button>
  );
}
