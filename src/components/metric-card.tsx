import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#6852FA]" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 truncate">{value}</p>
    </div>
  );
}
