"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const initial =
    fromParam && toParam
      ? { from: new Date(fromParam + "T00:00:00"), to: new Date(toParam + "T00:00:00") }
      : undefined;

  const [date, setDate] = useState<DateRange | undefined>(initial);
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setClickCount(0);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleSelect(range: DateRange | undefined) {
    setDate(range);
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Segundo clique = range completo
    if (newCount >= 2 && range?.from && range?.to) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", format(range.from, "yyyy-MM-dd"));
      params.set("to", format(range.to, "yyyy-MM-dd"));
      router.push(`?${params.toString()}`);
      setOpen(false);
      setClickCount(0);
    }
  }

  function handleClear() {
    setDate(undefined);
    setClickCount(0);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    router.push(`?${params.toString()}`);
    setOpen(false);
  }

  function handleOpen() {
    if (!open) {
      setDate(undefined);
      setClickCount(0);
    }
    setOpen(!open);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
      >
        <CalendarIcon className="w-4 h-4" />
        {date?.from && date?.to ? (
          <>
            {format(date.from, "dd/MM/yyyy", { locale: ptBR })} –{" "}
            {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
          </>
        ) : (
          "Selecionar período"
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-md">
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
        </div>
      )}
    </div>
  );
}
