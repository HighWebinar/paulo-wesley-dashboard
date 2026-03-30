"use client";

import { Download } from "lucide-react";

interface ExportCsvButtonProps {
  data: Record<string, unknown>[];
  filename: string;
}

export function ExportCsvButton({ data, filename }: ExportCsvButtonProps) {
  function handleExport() {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            let value = String(row[header] ?? "");
            // Previne CSV injection: valores que começam com =, +, -, @
            if (/^[=+\-@\t\r]/.test(value)) {
              value = "'" + value;
            }
            return value.includes(",") || value.includes('"') || value.includes("\n")
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const isEmpty = data.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isEmpty}
      className="flex items-center gap-2 px-4 py-2 bg-[#6852FA] hover:bg-[#5142B7] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </button>
  );
}
