"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

interface CampaignFilterProps {
  campaigns: string[];
}

export function CampaignFilter({ campaigns }: CampaignFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("campaign") ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("campaign", value);
    } else {
      params.delete("campaign");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-[#6852FA] focus:border-[#6852FA] focus:outline-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
        }}
      >
        <option value="">Todas as campanhas</option>
        {campaigns.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
