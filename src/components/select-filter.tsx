"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface SelectFilterProps {
  paramKey: string;
  options: string[];
  placeholder: string;
}

export function SelectFilter({ paramKey, options, placeholder }: SelectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    params.delete("page");

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="relative w-full sm:w-auto max-w-full">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={placeholder}
        className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 min-h-[44px] max-w-full bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-[#6852FA] focus:border-[#6852FA] focus:outline-none cursor-pointer"
        style={{ WebkitTextFillColor: "#4b5563", opacity: 1 }}
      >
        <option value="">{placeholder}</option>
        {options.filter((opt) => opt && opt.trim() !== "").map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
