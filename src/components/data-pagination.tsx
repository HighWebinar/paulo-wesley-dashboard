"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function DataPagination({ currentPage, totalPages, total }: DataPaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `?${params.toString()}`;
  }

  function getVisiblePages(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 pt-4">
      <p className="text-sm text-gray-500">
        {total} registro{total !== 1 ? "s" : ""}
      </p>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={buildHref(currentPage - 1)} text="Anterior" />
            </PaginationItem>
          )}

          {getVisiblePages().map((page, i) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink href={buildHref(page)} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={buildHref(currentPage + 1)} text="Próxima" />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
