"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  locale: string;
};

export default function Pagination({ currentPage, totalPages, locale: _locale }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const copy = useLanguage("pagination");

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2" aria-label={copy.nav_aria}>
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex items-center justify-center border border-gray-300 p-2 transition-colors md:px-4 md:py-2 ${
          currentPage === 1 ? "pointer-events-none opacity-50" : "hover:border-gray-900 hover:bg-gray-50"
        }`}
        aria-label={copy.previous_page_aria}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Link>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "...") return <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>;
          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;
          return (
            <Link
              key={pageNumber}
              href={createPageURL(pageNumber)}
              className={`flex h-8 w-8 items-center justify-center border text-sm font-bold transition-colors md:h-10 md:w-10 md:text-base ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50"
              }`}
              aria-label={copy.page_aria.replace("{page}", String(pageNumber))}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex items-center justify-center border border-gray-300 p-2 transition-colors md:px-4 md:py-2 ${
          currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:border-gray-900 hover:bg-gray-50"
        }`}
        aria-label={copy.next_page_aria}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Link>
    </nav>
  );
}

