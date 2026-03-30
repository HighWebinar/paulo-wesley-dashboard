"use client";

import { AlertCircle } from "lucide-react";

export default function MetaAdsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4">
      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Erro ao carregar Meta Ads</h2>
      <p className="text-sm text-gray-500">Ocorreu um erro ao buscar os dados. Tente novamente.</p>
      <button
        onClick={reset}
        className="px-4 py-2.5 min-h-[44px] bg-[#6852FA] hover:bg-[#5142B7] text-white text-sm font-medium rounded-xl transition-all"
      >
        Tentar novamente
      </button>
    </div>
  );
}
