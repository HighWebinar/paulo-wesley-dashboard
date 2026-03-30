import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
        <FileQuestion className="w-6 h-6 text-gray-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Página não encontrada</h2>
      <p className="text-sm text-gray-500">A página que você está procurando não existe.</p>
      <Link
        href="/dashboard/leads"
        className="px-4 py-2 bg-[#6852FA] hover:bg-[#5142B7] text-white text-sm font-medium rounded-xl transition-all"
      >
        Voltar para Leads
      </Link>
    </div>
  );
}
