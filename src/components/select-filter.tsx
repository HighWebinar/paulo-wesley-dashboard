"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { NULL_FILTER_SENTINEL } from "@/lib/constants";

function displayValue(v: string): string {
  return v === NULL_FILTER_SENTINEL ? "Não informado" : v;
}

interface SelectFilterProps {
  paramKey: string;
  options: string[];
  placeholder: string;
}

export function SelectFilter({ paramKey, options, placeholder }: SelectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentParam = searchParams.get(paramKey) ?? "";
  const selected = currentParam ? currentParam.split(",") : [];

  function pushUrl(values: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(paramKey, values.join(","));
    } else {
      params.delete(paramKey);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function handleToggle(option: string) {
    const newSelected = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    pushUrl(newSelected);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    pushUrl([]);
  }

  const hasSelection = selected.length > 0;
  const label = !hasSelection
    ? placeholder
    : selected.length === 1
      ? displayValue(selected[0])
      : `${selected.length} selecionados`;

  const allOptions = [
    ...options.filter((opt) => opt && opt.trim() !== "" && opt !== NULL_FILTER_SENTINEL),
    NULL_FILTER_SENTINEL,
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex items-center gap-2 w-full sm:w-auto pl-3 pr-2 py-2 min-h-[44px] bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-all cursor-pointer"
      >
        <span className={hasSelection ? "text-gray-900" : "text-gray-500"}>
          {label}
        </span>
        <div className="flex items-center gap-1 ml-auto">
          {hasSelection && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClear(e as unknown as React.MouseEvent); }}
              className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Limpar filtro"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-[200px] p-1">
        {allOptions.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
          >
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => handleToggle(opt)}
              className="data-checked:bg-[#6852FA] data-checked:border-[#6852FA]"
            />
            {displayValue(opt)}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}
