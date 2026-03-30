"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((m) => m.Calendar),
  { ssr: false }
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const hasUrlRange = !!(fromParam && toParam);
  const urlRange: DateRange | undefined = hasUrlRange
    ? { from: new Date(fromParam + "T00:00:00"), to: new Date(toParam + "T00:00:00") }
    : undefined;

  const [date, setDate] = useState<DateRange | undefined>(urlRange);
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef(fromParam);
  const toRef = useRef(toParam);

  if (fromParam !== fromRef.current || toParam !== toRef.current) {
    fromRef.current = fromParam;
    toRef.current = toParam;
    if (!open) {
      setDate(urlRange);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDate(
          fromRef.current && toRef.current
            ? { from: new Date(fromRef.current + "T00:00:00"), to: new Date(toRef.current + "T00:00:00") }
            : undefined
        );
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

    if (newCount >= 2 && range?.from && range?.to) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", format(range.from, "yyyy-MM-dd"));
      params.set("to", format(range.to, "yyyy-MM-dd"));
      params.delete("page");
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
    params.delete("page");
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
        className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
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
        <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 top-auto sm:top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-md max-w-[calc(100vw-2rem)] overflow-auto">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
            locale={ptBR}
          />
          {date?.from && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-gray-900 transition-all px-2 py-1 min-h-[44px] flex items-center"
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
