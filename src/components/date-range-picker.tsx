"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [date, setDate] = useState<DateRange | undefined>(
    fromParam && toParam
      ? { from: new Date(fromParam + "T00:00:00"), to: new Date(toParam + "T00:00:00") }
      : undefined
  );
  const [open, setOpen] = useState(false);

  function applyFilter(range: DateRange | undefined) {
    setDate(range);

    const params = new URLSearchParams(searchParams.toString());

    if (range?.from && range?.to) {
      params.set("from", format(range.from, "yyyy-MM-dd"));
      params.set("to", format(range.to, "yyyy-MM-dd"));
    } else {
      params.delete("from");
      params.delete("to");
    }

    router.push(`?${params.toString()}`);
  }

  function handleSelect(range: DateRange | undefined) {
    setDate(range);
    if (range?.from && range?.to) {
      applyFilter(range);
      setOpen(false);
    }
  }

  function handleClear() {
    applyFilter(undefined);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
        <CalendarIcon className="w-4 h-4" />
        {date?.from && date?.to ? (
          <>
            {format(date.from, "dd/MM/yyyy", { locale: ptBR })} –{" "}
            {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
          </>
        ) : (
          "Selecionar período"
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={ptBR}
        />
        {date?.from && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-900 transition-all"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
